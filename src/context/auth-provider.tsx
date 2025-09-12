
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/client-app';
import { Loader2 } from 'lucide-react';
import { CounsellorType, UserRole } from '@/lib/types';
import { set, get, ref, getDatabase } from 'firebase/database';


type AuthContextType = {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  counsellorType: CounsellorType | null;
  setRole: (role: UserRole) => void;
  login: typeof signInWithEmailAndPassword;
  register: (email: string, password: string, fullName: string, role: UserRole, counsellorType?: CounsellorType) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [counsellorType, setCounsellorType] = useState<CounsellorType | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const sessionRole = sessionStorage.getItem('userRole') as UserRole;
        const sessionCounsellorType = sessionStorage.getItem('counsellorType') as CounsellorType;

        if (sessionRole) {
            setRole(sessionRole);
            if (sessionCounsellorType) {
                setCounsellorType(sessionCounsellorType);
            }
            setLoading(false);
        } else {
            const db = getDatabase();
            const userRoleRef = ref(db, `userRoles/${user.uid}`);
            try {
                const snapshot = await get(userRoleRef);
                if(snapshot.exists()) {
                    const userData = snapshot.val();
                    const userRole = userData.role;
                    setRole(userRole);
                    sessionStorage.setItem('userRole', userRole);

                    if (userData.counsellorType) {
                        setCounsellorType(userData.counsellorType);
                        sessionStorage.setItem('counsellorType', userData.counsellorType);
                    }
                } else {
                    setRole(null);
                    setCounsellorType(null);
                }
            } catch (error) {
                console.error("Failed to fetch user role:", error);
                setRole(null);
                setCounsellorType(null);
            } finally {
                setLoading(false);
            }
        }
      } else {
        setUser(null);
        setRole(null);
        setCounsellorType(null);
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('counsellorType');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, fullName: string, role: UserRole, counsellorType?: CounsellorType) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      await updateProfile(user, {
        displayName: fullName,
      });

      const db = getDatabase();
      const userRoleRef = ref(db, `userRoles/${user.uid}`);
      const userData: { role: UserRole, counsellorType?: CounsellorType } = { role };
      if (role === UserRole.counsellor && counsellorType) {
        userData.counsellorType = counsellorType;
      }
      await set(userRoleRef, userData);

      setUser({...user, displayName: fullName });
    }
  };

  const handleLogin = async (email:string, password:string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // After login, clear session storage to force a re-fetch of role data
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('counsellorType');
    // The onAuthStateChanged listener will handle fetching and setting the new user's data
    return userCredential;
  }
  
  const handleLogout = async () => {
    await signOut(auth);
    // The onAuthStateChanged listener will handle state cleanup
  }

  const handleSetRole = (newRole: UserRole) => {
      if(user) {
        setRole(newRole);
        sessionStorage.setItem('userRole', newRole);
      }
  }

  const value = { 
    user, 
    loading,
    role,
    counsellorType,
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
