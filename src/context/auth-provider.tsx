
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/client-app';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { set, get, ref, getDatabase } from 'firebase/database';


type AuthContextType = {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  login: typeof signInWithEmailAndPassword;
  register: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const sessionRole = sessionStorage.getItem('userRole') as UserRole;
        if (sessionRole) {
          setRole(sessionRole);
          setLoading(false);
        } else {
            const db = getDatabase();
            const userRoleRef = ref(db, `userRoles/${user.uid}`);
            try {
                const snapshot = await get(userRoleRef);
                if(snapshot.exists()) {
                    const userRole = snapshot.val().role;
                    setRole(userRole);
                    sessionStorage.setItem('userRole', userRole);
                } else {
                    setRole(null); // No role found
                }
            } catch (error) {
                console.error("Failed to fetch user role:", error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        }
      } else {
        setUser(null);
        setRole(null);
        sessionStorage.removeItem('userRole');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, fullName: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      await updateProfile(user, {
        displayName: fullName,
      });

      // Save role to Realtime Database
      const db = getDatabase();
      const userRoleRef = ref(db, `userRoles/${user.uid}`);
      await set(userRoleRef, { role });

      // Re-trigger onAuthStateChanged to get updated user info
      setUser({...user, displayName: fullName });
    }
  };

  const handleLogin = async (email:string, password:string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
        setLoading(true);
        const db = getDatabase();
        const userRoleRef = ref(db, `userRoles/${user.uid}`);
        const snapshot = await get(userRoleRef);
        if(snapshot.exists()) {
            const userRole = snapshot.val().role;
            setRole(userRole);
            sessionStorage.setItem('userRole', userRole);
        } else {
            // Default to student if no role is found (for older accounts)
            setRole(UserRole.student);
            sessionStorage.setItem('userRole', UserRole.student);
        }
        setLoading(false);
    }
    return userCredential;
  }
  
  const handleLogout = async () => {
    await signOut(auth);
    setRole(null);
    sessionStorage.removeItem('userRole');
  }

  const handleSetRole = (newRole: UserRole) => {
      setRole(newRole);
      sessionStorage.setItem('userRole', newRole);
  }

  const value = { 
    user, 
    loading,
    role,
    setRole: handleSetRole,
    login: handleLogin,
    register,
    logout: handleLogout,
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
