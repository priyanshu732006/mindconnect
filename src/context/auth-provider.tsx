
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
  }, []);

  useEffect(() => {
    setLoading(true);
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
             // User exists in Auth but not in DB (edge case)
            console.warn("User exists in Auth but not in DB");
            setUser(user);
            setRole(null);
            sessionStorage.removeItem('userRole');
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setUser(user); // Keep user logged in but without role
          setRole(null);
          setCounsellorType(null);
          setStudentDetails(null);
        } finally {
          setLoading(false);
        }
      } else {
        // No user is signed in
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
        // Create initial empty record for the student in studentData path
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
      }
      
      await set(userRoleRef, userData);
    }
  };

  const login = async (email: string, password: string, loginRole: UserRole, loginCounsellorType?: CounsellorType) => {
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
                throw new Error(`Login failed. This account is registered as a ${dbRole.replace('-', ' ')}, not a ${loginRole.replace('-', ' ')}.`);
            }

            if (loginRole === UserRole.counsellor) {
                if (dbCounsellorType !== loginCounsellorType) {
                    await signOut(auth);
                    throw new Error(`Login failed. This account is registered as an ${dbCounsellorType?.replace('-', ' ')} counsellor, not an ${loginCounsellorType?.replace('-', ' ')} one.`);
                }
            }
            
            // Manually set state and session storage here to ensure it's available immediately for redirection
            setRole(dbRole);
            sessionStorage.setItem('userRole', dbRole);
            
            setCounsellorType(dbCounsellorType);
            if(dbCounsellorType) {
              sessionStorage.setItem('counsellorType', dbCounsellorType);
            } else {
              sessionStorage.removeItem('counsellorType');
            }

            if (userData.studentDetails) {
                setStudentDetails(userData.studentDetails);
                sessionStorage.setItem('studentDetails', JSON.stringify(userData.studentDetails));
            } else {
                setStudentDetails(null);
                sessionStorage.removeItem('studentDetails');
            }


            // onAuthStateChanged will also fire, but this makes the data available instantly.
            return { role: dbRole, counsellorType: dbCounsellorType };
        } else {
            await signOut(auth);
            throw new Error("Login failed. User role not found in the database. Please register first.");
        }
    }
    // This part should not be reached in a successful login
    throw new Error("Login failed. Please check your credentials.");
  }

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged will clear user/role state and sessionStorage will be cleared in that handler.
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
