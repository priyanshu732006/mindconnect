
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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: UserRole, details?: { counsellorType?: CounsellorType, studentDetails?: any }) => Promise<void>;
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
        // User is logged in, now fetch their role from session or DB
        const sessionRole = sessionStorage.getItem('userRole') as UserRole | null;
        if(sessionRole) {
           setUser(user);
           setRole(sessionRole);
           const sessionCounsellorType = sessionStorage.getItem('counsellorType') as CounsellorType | null;
           if (sessionCounsellorType) {
               setCounsellorType(sessionCounsellorType);
           }
           setLoading(false);
        } else {
            // This case handles initial login or refresh where session is empty
            const db = getDatabase();
            const userRoleRef = ref(db, `userRoles/${user.uid}`);
            try {
              const snapshot = await get(userRoleRef);
              if (snapshot.exists()) {
                const userData = snapshot.val();
                setUser(user);
                setRole(userData.role);
                sessionStorage.setItem('userRole', userData.role);

                if (userData.counsellorType) {
                  setCounsellorType(userData.counsellorType);
                  sessionStorage.setItem('counsellorType', userData.counsellorType);
                } else {
                  setCounsellorType(null);
                  sessionStorage.removeItem('counsellorType');
                }
              } else {
                // This is a new user who just registered. They need to select a role.
                setRole(null);
                sessionStorage.removeItem('userRole');
                setUser(user);
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

  const register = async (email: string, password: string, fullName: string, role: UserRole, details?: { counsellorType?: CounsellorType, studentDetails?: any }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      await updateProfile(user, {
        displayName: fullName,
      });

      const db = getDatabase();
      const userRoleRef = ref(db, `userRoles/${user.uid}`);
      const userData: { role: UserRole, fullName: string, counsellorType?: CounsellorType, studentDetails?: any } = { 
        role, 
        fullName
      };
      
      if (role === UserRole.counsellor && details?.counsellorType) {
        userData.counsellorType = details.counsellorType;
      }

      if(role === UserRole.student && details?.studentDetails) {
        userData.studentDetails = details.studentDetails;
      }
      
      await set(userRoleRef, userData);

      // Do not set user/role state here. The onAuthStateChanged listener will handle it.
    }
  };

  const handleLogin = async (email: string, password: string, loginRole: UserRole) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;

    if (loggedInUser) {
        const db = getDatabase();
        const userRoleRef = ref(db, `userRoles/${loggedInUser.uid}`);
        const snapshot = await get(userRoleRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const dbRole = userData.role as UserRole;
            
            if(dbRole !== loginRole) {
                await signOut(auth); // Log the user out immediately
                throw new Error(`Login failed. This account is registered as a ${dbRole.replace('-', ' ')}, not a ${loginRole.replace('-', ' ')}.`);
            }

            // Roles match, proceed with setting state and session storage
            setRole(dbRole);
            sessionStorage.setItem('userRole', dbRole);
            
            if (userData.counsellorType) {
                const dbCounsellorType = userData.counsellorType as CounsellorType;
                setCounsellorType(dbCounsellorType);
                sessionStorage.setItem('counsellorType', dbCounsellorType);
            } else {
                setCounsellorType(null);
                sessionStorage.removeItem('counsellorType');
            }
            setUser(loggedInUser);

        } else {
            await signOut(auth);
            throw new Error("Login failed. User role not found in the database. Please register first.");
        }
    }
  }

  const handleLogout = async () => {
    await signOut(auth);
    // onAuthStateChanged will handle clearing user and role state
  }

  const handleSetRole = async (newRole: UserRole) => {
    if (user) {
      try {
        setLoading(true);
        const db = getDatabase();
        const userRoleRef = ref(db, `userRoles/${user.uid}`);
        
        const snapshot = await get(userRoleRef);
        const existingData = snapshot.exists() ? snapshot.val() : {};
        
        const updateData = {
           ...existingData,
           role: newRole,
           fullName: user.displayName || 'Anonymous' 
        };

        await set(userRoleRef, updateData);
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
  
  // Do not render children until loading is false
  // to prevent race conditions with routing.
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

    