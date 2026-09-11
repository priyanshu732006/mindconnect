
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
  studentDetails: any | null;
  login: (email: string, password: string, role: UserRole, counsellorType?: CounsellorType) => Promise<{ role: UserRole, counsellorType: CounsellorType | null }>;
  register: (email: string, password: string, fullName: string, role: UserRole, details?: { counsellorType?: CounsellorType, studentDetails?: any, peerBuddyDetails?: any }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [counsellorType, setCounsellorType] = useState<CounsellorType | null>(null);
  const [studentDetails, setStudentDetails] = useState<any | null>(null);

  useEffect(() => {
    // This runs only on the client side
    if (typeof window !== 'undefined') {
        const savedRole = sessionStorage.getItem('userRole') as UserRole | null;
        const savedCounsellorType = sessionStorage.getItem('counsellorType') as CounsellorType | null;
        const savedStudentDetails = sessionStorage.getItem('studentDetails');
        
        if (savedRole) setRole(savedRole);
        if (savedCounsellorType) setCounsellorType(savedCounsellorType);
        if (savedStudentDetails) {
            try {
                setStudentDetails(JSON.parse(savedStudentDetails));
            } catch (e) {
                console.error("Failed to parse studentDetails from sessionStorage", e);
            }
        }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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

            if (userData.studentDetails) {
                setStudentDetails(userData.studentDetails);
                sessionStorage.setItem('studentDetails', JSON.stringify(userData.studentDetails));
            } else {
                setStudentDetails(null);
                sessionStorage.removeItem('studentDetails');
            }

          } else {
            setUser(user);
            setRole(null);
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUser(user);
          setRole(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setRole(null);
        setCounsellorType(null);
        setStudentDetails(null);
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('counsellorType');
        sessionStorage.removeItem('studentDetails');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, fullName: string, role: UserRole, details?: { counsellorType?: CounsellorType, studentDetails?: any, peerBuddyDetails?: any }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await updateProfile(user, {
          displayName: fullName,
        });

        const db = getDatabase();
        const userRoleRef = ref(db, `userRoles/${user.uid}`);
        const userData: { role: UserRole, fullName: string, counsellorType?: CounsellorType, studentDetails?: any, peerBuddyDetails?: any } = { 
          role, 
          fullName
        };
        
        if (role === UserRole.counsellor && details?.counsellorType) {
          userData.counsellorType = details.counsellorType;
        }

        if(role === UserRole.student && details?.studentDetails) {
          userData.studentDetails = details.studentDetails;
          const studentDataRef = ref(db, `studentData/${user.uid}`);
          await set(studentDataRef, {
              messages: [],
              assessmentResults: {"phq-9": null, "gad-7": null, "ghq-12": null},
              dailyCheckinData: null,
              coins: 15,
              streak: 0,
          });
        }
        
        if(role === UserRole['peer-buddy'] && details?.peerBuddyDetails) {
          userData.peerBuddyDetails = details.peerBuddyDetails;
          const buddyRef = ref(db, `peerBuddies/${user.uid}`);
          await set(buddyRef, {
            name: fullName,
            email,
            status: 'Available',
            specializations: details.peerBuddyDetails.specializations || ['General Chat'],
          });
        }
        
        await set(userRoleRef, userData);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string, loginRole: UserRole, loginCounsellorType?: CounsellorType) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      if (loggedInUser) {
          const db = getDatabase();
          const userRoleRef = ref(db, `userRoles/${loggedInUser.uid}`);
          const snapshot = await get(userRoleRef);

          if (snapshot.exists()) {
              const userData = snapshot.val();
              const dbRole = userData.role as UserRole;
              const dbCounsellorType = (userData.counsellorType as CounsellorType) || null;
              
              if(dbRole !== loginRole) {
                  await signOut(auth);
                  throw new Error(`Login failed. This account is registered as a ${dbRole}, not a ${loginRole}.`);
              }

              if (loginRole === UserRole.counsellor) {
                  if (dbCounsellorType !== loginCounsellorType) {
                      await signOut(auth);
                      throw new Error(`Login failed. This account is registered as an ${dbCounsellorType} counsellor, not an ${loginCounsellorType} one.`);
                  }
              }
              
              setRole(dbRole);
              sessionStorage.setItem('userRole', dbRole);
              
              setCounsellorType(dbCounsellorType);
              if(dbCounsellorType) {
                sessionStorage.setItem('counsellorType', dbCounsellorType);
              }

              if (userData.studentDetails) {
                  setStudentDetails(userData.studentDetails);
                  sessionStorage.setItem('studentDetails', JSON.stringify(userData.studentDetails));
              }

              return { role: dbRole, counsellorType: dbCounsellorType };
          } else {
              await signOut(auth);
              throw new Error("Login failed. User profile not found in database. Please contact support.");
          }
      }
      throw new Error("Login failed. Please check your credentials.");
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          throw new Error("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/operation-not-allowed') {
          throw new Error("Email/Password sign-in is not enabled in the Firebase Console.");
      } else {
          throw new Error(error.message || "An unexpected error occurred during login.");
      }
    }
  }

  const logout = async () => {
    await signOut(auth);
  }

  const value = {
    user,
    loading,
    role,
    counsellorType,
    studentDetails,
    login,
    register,
    logout,
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
