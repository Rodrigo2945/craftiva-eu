import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
  reauthenticateWithPopup
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import i18n from '../i18n';
import { UserProfile, UserRole } from '../types';
import { LogIn, LogOut, User as UserIcon, Shield } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const AuthContext = React.createContext<{
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
  updateLanguage: (lang: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  exportData: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signInEmail: async () => {},
  signUpEmail: async () => {},
  logout: async () => {},
  updateRole: async () => {},
  updateLanguage: async () => {},
  updateProfileData: async () => {},
  exportData: async () => {},
  deleteAccount: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        try {
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Anonymous',
              photoURL: firebaseUser.photoURL || undefined,
              role: '' as UserRole,
              preferredLanguage: i18n.language || 'pt',
              createdAt: Timestamp.now(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (profile?.preferredLanguage) {
      i18n.changeLanguage(profile.preferredLanguage);
    }
  }, [profile?.preferredLanguage]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string, role: UserRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });
      
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: name,
        role: role,
        preferredLanguage: i18n.language || 'pt',
        createdAt: Timestamp.now(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateRole = async (role: UserRole) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { role }, { merge: true });
    setProfile(prev => prev ? { ...prev, role } : null);
  };

  const updateLanguage = async (lang: string) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { preferredLanguage: lang }, { merge: true });
    setProfile(prev => prev ? { ...prev, preferredLanguage: lang } : null);
    i18n.changeLanguage(lang);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, data, { merge: true });
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  // GDPR Art. 20: everything we hold about this user, in a portable format.
  const exportData = async () => {
    if (!user) return;

    const ownedBy = (field: string) =>
      getDocs(query(collection(db, field === 'sellerId' ? 'products' : 'reviews'), where(field, '==', user.uid)));

    const [profileSnap, products, reviews, sent, received, wishlist] = await Promise.all([
      getDoc(doc(db, 'users', user.uid)),
      ownedBy('sellerId'),
      ownedBy('buyerId'),
      getDocs(query(collection(db, 'messages'), where('senderId', '==', user.uid))),
      getDocs(query(collection(db, 'messages'), where('receiverId', '==', user.uid))),
      getDocs(collection(db, 'users', user.uid, 'wishlist')),
    ]);

    const contents = (snap: { docs: { id: string; data: () => unknown }[] }) =>
      snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));

    const payload = {
      exportedAt: new Date().toISOString(),
      account: { uid: user.uid, email: user.email, displayName: user.displayName },
      profile: profileSnap.exists() ? profileSnap.data() : null,
      products: contents(products),
      reviews: contents(reviews),
      messages: [...contents(sent), ...contents(received)],
      wishlist: contents(wishlist),
    };

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `craftiva-dados-${user.uid}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // GDPR Art. 17. Reauthentication happens first so the account is never left
  // half-deleted: Firebase refuses deleteUser on an old session.
  const deleteAccount = async () => {
    if (!user) return;

    await reauthenticateWithPopup(user, new GoogleAuthProvider());

    const [products, reviews, wishlist] = await Promise.all([
      getDocs(query(collection(db, 'products'), where('sellerId', '==', user.uid))),
      getDocs(query(collection(db, 'reviews'), where('buyerId', '==', user.uid))),
      getDocs(collection(db, 'users', user.uid, 'wishlist')),
    ]);

    await Promise.all([
      ...products.docs.map(d => deleteDoc(d.ref)),
      ...wishlist.docs.map(d => deleteDoc(d.ref)),
      // Kept, but detached from a name, so other sellers' ratings stay intact.
      ...reviews.docs.map(d => updateDoc(d.ref, { buyerName: '' })),
    ]);

    await deleteDoc(doc(db, 'users', user.uid));
    await deleteUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signInEmail, signUpEmail, logout, updateRole, updateLanguage, updateProfileData, exportData, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
