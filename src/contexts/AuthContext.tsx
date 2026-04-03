import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import type { AdminUser } from '../lib/database.types';

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = undefined;
      }

      if (user) {
        // Listen to admin user data from Firestore
        try {
          unsubscribeUser = onSnapshot(
            doc(db, 'users', user.uid),
            (userDoc) => {
              if (userDoc.exists()) {
                setAdminUser(userDoc.data() as AdminUser);
              } else {
                setAdminUser(null);
              }
            },
            (error) => {
              console.error('Failed to listen to admin user data:', error);
              setAdminUser(null);
            }
          );
        } catch (error) {
          console.error('Failed to setup admin user listener:', error);
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, adminUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
