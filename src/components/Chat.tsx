import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { useAuth } from './Auth';
import { Message, UserProfile, Product } from '../types';
import { Send, User as UserIcon, Package, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Chat: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(searchParams.get('to'));
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [receiverProfile, setReceiverProfile] = useState<UserProfile | null>(null);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [peerProfiles, setPeerProfiles] = useState<Record<string, UserProfile | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Two listeners rather than one: a conversation needs the messages we sent as
  // well as the ones we received, and Firestore cannot OR across two fields.
  useEffect(() => {
    if (!user) return;

    const subscribe = (
      field: 'senderId' | 'receiverId',
      setter: React.Dispatch<React.SetStateAction<Message[]>>
    ) =>
      onSnapshot(
        query(collection(db, 'messages'), where(field, '==', user.uid), orderBy('createdAt', 'desc')),
        snapshot => setter(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message))),
        error => console.error(`Chat: ${field} listener failed`, error)
      );

    const unsubscribeSent = subscribe('senderId', setSentMessages);
    const unsubscribeReceived = subscribe('receiverId', setReceivedMessages);

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [user]);

  const chats = useMemo(() => {
    if (!user) return [];

    const latestPerPeer = new Map<string, Message>();
    for (const message of [...sentMessages, ...receivedMessages]) {
      const peerId = message.senderId === user.uid ? message.receiverId : message.senderId;
      if (!peerId || peerId === user.uid) continue;
      const current = latestPerPeer.get(peerId);
      if (!current || message.createdAt.toMillis() > current.createdAt.toMillis()) {
        latestPerPeer.set(peerId, message);
      }
    }

    return [...latestPerPeer.entries()]
      .sort(([, a], [, b]) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .map(([userId, message]) => ({ userId, lastMessage: message.text }));
  }, [user, sentMessages, receivedMessages]);

  // Peers with no user document are recorded as null so they are not re-fetched.
  useEffect(() => {
    const missing = chats.map(c => c.userId).filter(id => !(id in peerProfiles));
    if (missing.length === 0) return;

    let cancelled = false;
    Promise.all(missing.map(async id => [id, await getDoc(doc(db, 'users', id))] as const))
      .then(entries => {
        if (cancelled) return;
        setPeerProfiles(prev => {
          const next = { ...prev };
          for (const [id, snap] of entries) {
            next[id] = snap.exists() ? (snap.data() as UserProfile) : null;
          }
          return next;
        });
      })
      .catch(error => console.error('Chat: failed to load peer profiles', error));

    return () => {
      cancelled = true;
    };
  }, [chats, peerProfiles]);

  // Fetch active thread
  useEffect(() => {
    if (!user || !activeChat) return;

    const thread = (senderId: string, receiverId: string) =>
      query(
        collection(db, 'messages'),
        where('senderId', '==', senderId),
        where('receiverId', '==', receiverId),
        orderBy('createdAt', 'asc')
      );

    let outgoing: Message[] = [];
    let incoming: Message[] = [];
    const publish = () => {
      setMessages(
        [...outgoing, ...incoming].sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
      );
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const unsubscribeOutgoing = onSnapshot(
      thread(user.uid, activeChat),
      snapshot => {
        outgoing = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message));
        publish();
      },
      error => console.error('Chat: outgoing thread listener failed', error)
    );

    const unsubscribeIncoming = onSnapshot(
      thread(activeChat, user.uid),
      snapshot => {
        incoming = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Message));
        publish();
      },
      error => console.error('Chat: incoming thread listener failed', error)
    );

    setReceiverProfile(null);
    getDoc(doc(db, 'users', activeChat))
      .then(snap => setReceiverProfile(snap.exists() ? (snap.data() as UserProfile) : null))
      .catch(error => console.error('Chat: failed to load receiver profile', error));

    return () => {
      unsubscribeOutgoing();
      unsubscribeIncoming();
    };
  }, [user, activeChat]);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (!productId) {
      setActiveProduct(null);
      return;
    }
    getDoc(doc(db, 'products', productId))
      .then(snap => setActiveProduct(snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null))
      .catch(error => console.error('Chat: failed to load product', error));
  }, [searchParams]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        receiverId: activeChat,
        productId: searchParams.get('product') || '',
        text: newMessage,
        createdAt: Timestamp.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) return <div className="p-8 text-center">{t('chat.loginPrompt')}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-120px)]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex h-full">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-black text-gray-900 mb-4">{t('chat.messagesTitle')}</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('chat.searchPlaceholder')} 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chats.map(chat => (
              <button
                key={chat.userId}
                onClick={() => setActiveChat(chat.userId)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  activeChat === chat.userId ? 'bg-white shadow-md ring-1 ring-emerald-50' : 'hover:bg-white/50'
                }`}
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                  {peerProfiles[chat.userId]?.photoURL ? (
                    <img src={peerProfiles[chat.userId]!.photoURL} className="w-full h-full rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{peerProfiles[chat.userId]?.displayName || t('chat.userDisplay')}</p>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))}
            {chats.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm">{t('chat.noConversations')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{receiverProfile?.displayName || t('chat.userDisplay')}</p>
                  </div>
                </div>
                {activeProduct && (
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <img src={activeProduct.images[0]} className="w-8 h-8 rounded-md object-cover" alt="" />
                    <div className="text-xs">
                      <p className="font-bold text-gray-900 truncate max-w-[120px]">{activeProduct.name}</p>
                      <p className="text-emerald-600 font-black">{activeProduct.price}€</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === user.uid;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                        isMe 
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-100' 
                        : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}>
                        {msg.text}
                        <p className={`text-[10px] mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                          {msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('chat.inputPlaceholder')}
                    className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t('chat.selectConversationTitle')}</h3>
              <p className="max-w-xs">{t('chat.selectConversationDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
