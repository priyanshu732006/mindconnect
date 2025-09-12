
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
        const db = getDatabase();
        const userRoleRef = ref(db, `userRoles/${user.uid}`);
        try {
          const snapshot = await get(userRoleRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const userRole = userData.role;
            setRole(userRole);
            sessionStorage.setItem('userRole', userRole);

            if (userData.counsellorType) {
              setCounsellorType(userData.counsellorType);
              sessionStorage.setItem('counsellorType', userData.counsellorType);
            } else {
              setCounsellorType(null);
              sessionStorage.removeItem('counsellorType');
            }
          } else {
            // User exists in Auth, but not in DB (e.g. just registered)
            setRole(null);
            setCounsellorType(null);
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('counsellorType');
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setRole(null);
          setCounsellorType(null);
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in
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

      // Set state locally after successful DB write
      setUser({ ...user, displayName: fullName });
      setRole(role);
      sessionStorage.setItem('userRole', role);
      if (role === UserRole.counsellor && counsellorType) {
        setCounsellorType(counsellorType);
        sessionStorage.setItem('counsellorType', counsellorType);
      }
    }
  };

  const handleLogin = async (email: string, password: string) => {
    // Clear session storage on new login to force a full data refetch
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('counsellorType');
    // The onAuthStateChanged listener will handle fetching the new user's data after this succeeds.
    return await signInWithEmailAndPassword(auth, email, password);
  }

  const handleLogout = async () => {
    await signOut(auth);
    // onAuthStateChanged will handle clearing user state
  }

  const handleSetRole = async (newRole: UserRole) => {
    if (user) {
      try {
        setLoading(true);
        const db = getDatabase();
        const userRoleRef = ref(db, `userRoles/${user.uid}`);
        // We only set the role, counsellorType should have been set at registration.
        await set(userRoleRef, { role: newRole });
        setRole(newRole);
        sessionStorage.setItem('userRole', newRole);
      } catch (error) {
        console.error("Failed to set user role in database:", error);
      } finally {
        setLoading(false);
      }
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

  if (loading && !user) {
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
