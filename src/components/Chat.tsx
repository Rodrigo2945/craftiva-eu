import React, { useState, useEffect, useRef } from 'react';
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
  const [chats, setChats] = useState<{ userId: string; lastMessage: string; profile?: UserProfile }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch chats list
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'messages'),
      where('receiverId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const uniqueUsers = new Set<string>();
      const chatList: any[] = [];

      for (const d of snapshot.docs) {
        const data = d.data() as Message;
        if (!uniqueUsers.has(data.senderId)) {
          uniqueUsers.add(data.senderId);
          const userDoc = await getDoc(doc(db, 'users', data.senderId));
          chatList.push({
            userId: data.senderId,
            lastMessage: data.text,
            profile: userDoc.exists() ? userDoc.data() as UserProfile : undefined
          });
        }
      }
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch active chat messages
  useEffect(() => {
    if (!user || !activeChat) return;

    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [user.uid, activeChat]),
      where('receiverId', 'in', [user.uid, activeChat]),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      // Filter manually because Firestore doesn't support complex OR queries easily with ordering
      const filtered = msgs.filter(m => 
        (m.senderId === user.uid && m.receiverId === activeChat) || 
        (m.senderId === activeChat && m.receiverId === user.uid)
      );
      setMessages(filtered);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    // Fetch receiver profile
    getDoc(doc(db, 'users', activeChat)).then(snap => {
      if (snap.exists()) setReceiverProfile(snap.data() as UserProfile);
    });

    // Fetch product if any
    const prodId = searchParams.get('product');
    if (prodId) {
      getDoc(doc(db, 'products', prodId)).then(snap => {
        if (snap.exists()) setActiveProduct({ id: snap.id, ...snap.data() } as Product);
      });
    }

    return () => unsubscribe();
  }, [user, activeChat, searchParams]);

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
                  {chat.profile?.photoURL ? (
                    <img src={chat.profile.photoURL} className="w-full h-full rounded-xl object-cover" alt="" />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{chat.profile?.displayName || t('chat.userDisplay')}</p>
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
                    <p className="font-bold text-gray-900">{receiverProfile?.displayName || t('chat.loading')}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{t('chat.online')}</p>
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
