
'use client';

import { analyzeWellbeing } from '@/app/actions';
import type { Message, WellbeingData, TrustedContact, FacialAnalysisData, VoiceAnalysisData, NavItem, UserRole, DailyCheckinData, AssessmentId, AssessmentResult, AssessmentResults } from '@/lib/types';
import React, { useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getWellbeingCategory } from '@/lib/utils';
import { useAuth } from './auth-provider';
import { studentNavItems } from '@/lib/student-nav';
import { adminNavItems } from '@/lib/admin-nav';
import { counsellorNavItems } from '@/lib/counsellor-nav';
import { peerBuddyNavItems } from '@/lib/peer-buddy-nav';
import { getDatabase, ref, set, get } from 'firebase/database';
import { sendSmsAction } from '@/app/actions';


type AppContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  wellbeingData: WellbeingData | null;
  isAnalyzing: boolean;
  trustedContacts: TrustedContact[];
  addContact: (contact: Omit<TrustedContact, 'id' | 'avatar'>) => void;
  updateContact: (contact: TrustedContact) => void;
  deleteContact: (contactId: string) => void;
  facialAnalysis: FacialAnalysisData | null;
  setFacialAnalysis: React.Dispatch<React.SetStateAction<FacialAnalysisData | null>>;
  voiceAnalysis: VoiceAnalysisData | null;
  setVoiceAnalysis: React.Dispatch<React.SetStateAction<VoiceAnalysisData | null>>;
  navItems: NavItem[];
  setNavItemsByRole: (role: UserRole | null) => void;

  // Gamification
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  addJournalEntry: (data: DailyCheckinData) => void;
  
  // Daily Check-in
  isCheckinOpen: boolean;
  setCheckinOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dailyCheckinData: DailyCheckinData | null;
  setDailyCheckinData: React.Dispatch<React.SetStateAction<DailyCheckinData | null>>;

  // Assessments
  assessmentResults: AssessmentResults;
  addAssessmentResult: (result: AssessmentResult) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [wellbeingData, setWellbeingData] = React.useState<WellbeingData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [trustedContacts, setTrustedContacts] = React.useState<TrustedContact[]>([]);
  const [facialAnalysis, setFacialAnalysis] = React.useState<FacialAnalysisData | null>(null);
  const [voiceAnalysis, setVoiceAnalysis] = React.useState<VoiceAnalysisData | null>(null);
  const [navItems, setNavItems] = React.useState<NavItem[]>(studentNavItems);
  
  // Gamification state
  const [coins, setCoins] = React.useState(15);
  const [streak, setStreak] = React.useState(0);
  
  // Daily Check-in state
  const [isCheckinOpen, setCheckinOpen] = React.useState(false);
  const [dailyCheckinData, setDailyCheckinData] = React.useState<DailyCheckinData | null>(null);
  
  // Assessment state
  const [assessmentResults, setAssessmentResults] = React.useState<AssessmentResults>({
    "phq-9": null,
    "gad-7": null,
    "ghq-12": null,
  });

  const { toast } = useToast();
  const { user, role, loading } = useAuth();
  const db = getDatabase();
  
  // Ref to track if initial data load is complete
  const isDataLoaded = useRef(false);

  // --- DATABASE SYNC ---
  useEffect(() => {
    async function fetchStudentData() {
        if (loading || !user || role !== 'student') {
            isDataLoaded.current = false; // Not a student, or still loading
            return;
        }

        try {
            // Fetch emergency contacts from userRoles
            const userRoleRef = ref(db, `userRoles/${user.uid}`);
            const userRoleSnapshot = await get(userRoleRef);
            if (userRoleSnapshot.exists()) {
                const userData = userRoleSnapshot.val();
                if (userData.studentDetails?.emergencyContacts) {
                    const contactsFromDb = userData.studentDetails.emergencyContacts.map((contact: any, index: number) => ({
                        ...contact,
                        id: `${user.uid}-contact-${index}`,
                        avatar: `https://picsum.photos/seed/${user.uid}-${index}/100/100`,
                    }));
                    setTrustedContacts(contactsFromDb);
                }
            }

            // Fetch main student data
            const studentDataRef = ref(db, `studentData/${user.uid}`);
            const studentDataSnapshot = await get(studentDataRef);
            if (studentDataSnapshot.exists()) {
                const data = studentDataSnapshot.val();
                setMessages(data.messages || []);
                setAssessmentResults(data.assessmentResults || {"phq-9": null, "gad-7": null, "ghq-12": null});
                setDailyCheckinData(data.dailyCheckinData || null);
                setCoins(data.coins ?? 15);
                setStreak(data.streak ?? 0);
            } else {
                 setMessages([]);
                 setAssessmentResults({"phq-9": null, "gad-7": null, "ghq-12": null});
                 setDailyCheckinData(null);
                 setCoins(15);
                 setStreak(0);
            }
            isDataLoaded.current = true;
        } catch (error) {
            console.error("Error fetching student data:", error);
            isDataLoaded.current = true; // Still allow the app to function even if data load fails
            toast({
                variant: 'destructive',
                title: 'Data Load Error',
                description: 'Could not load your saved data. Please try refreshing.'
            });
        }
    }

    if (!loading) {
      fetchStudentData();
    } else {
      isDataLoaded.current = false;
    }
  }, [user, role, loading, db, toast]);
  
  const writeStudentData = useCallback(() => {
    if (user && role === 'student' && isDataLoaded.current) {
        const studentDataRef = ref(db, `studentData/${user.uid}`);
        set(studentDataRef, {
            messages,
            assessmentResults,
            dailyCheckinData,
            coins,
            streak,
        }).catch(error => {
            console.error("Error writing student data:", error);
        });
    }
  }, [user, role, db, messages, assessmentResults, dailyCheckinData, coins, streak]);

  useEffect(() => {
    // This effect ensures data is written back to DB whenever it changes, but only after initial load.
    if (isDataLoaded.current) {
        writeStudentData();
    }
  }, [writeStudentData]);
  // --- END DATABASE SYNC ---


  const setNavItemsByRole = useCallback((role: UserRole | null) => {
    switch (role) {
      case 'admin':
        setNavItems(adminNavItems);
        break;
      case 'counsellor':
        setNavItems(counsellorNavItems);
        break;
      case 'peer-buddy':
        setNavItems(peerBuddyNavItems);
        break;
      case 'student':
      default:
        setNavItems(studentNavItems);
        break;
    }
  }, []);


  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content }]);
  };

  const analyzeCurrentState = React.useCallback(async (currentAssessmentResults?: AssessmentResults) => {
    if (!user) return; // Don't analyze if there's no user
    
    const conversation = messages.map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`).join('\n\n');
    const resultsToAnalyze = currentAssessmentResults || assessmentResults;
    const completedAssessments = Object.values(resultsToAnalyze).filter(Boolean) as AssessmentResult[];


    if (messages.length === 0 && !facialAnalysis && !voiceAnalysis && !dailyCheckinData && completedAssessments.length === 0) {
      setWellbeingData({ wellbeingScore: 0, summary: "Start a conversation or use the analysis tools to get your well-being score.", selfHarmRisk: false });
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await analyzeWellbeing({
        conversation: conversation.length > 0 ? conversation : undefined,
        facialAnalysis: facialAnalysis || undefined,
        voiceAnalysis: voiceAnalysis || undefined,
        mood: dailyCheckinData?.mood,
        journalEntry: dailyCheckinData?.journalEntry,
        sleepHours: dailyCheckinData?.sleepHours,
        screenTimeHours: dailyCheckinData?.screenTimeHours,
        assessmentResults: completedAssessments.length > 0 ? completedAssessments : undefined,
      });
      if (data) {
        setWellbeingData(data);
      }
    } catch (error) {
      console.error('Failed to analyze wellbeing:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, messages, facialAnalysis, voiceAnalysis, dailyCheckinData, assessmentResults]);


   const addContact = async (contact: Omit<TrustedContact, 'id' | 'avatar'>) => {
      if(!user) return;
      const newContacts = [...trustedContacts.map(c => ({name: c.name, relation: c.relation, phone: c.phone})), contact];
      const userRoleRef = ref(db, `userRoles/${user.uid}/studentDetails/emergencyContacts`);
      await set(userRoleRef, newContacts);
      // Re-fetch to update IDs and avatars correctly
      const newId = `${user.uid}-contact-${trustedContacts.length}`;
      setTrustedContacts(prev => [...prev, { ...contact, id: newId, avatar: `https://picsum.photos/seed/${newId}/100/100` }]);
  };

  const updateContact = async (updatedContact: TrustedContact) => {
      if(!user) return;
      const indexToUpdate = trustedContacts.findIndex(c => c.id === updatedContact.id);
      if (indexToUpdate === -1) return;
      
      const newContacts = trustedContacts.map(c => ({name: c.name, relation: c.relation, phone: c.phone}));
      newContacts[indexToUpdate] = { name: updatedContact.name, relation: updatedContact.relation, phone: updatedContact.phone };
      
      const userRoleRef = ref(db, `userRoles/${user.uid}/studentDetails/emergencyContacts`);
      await set(userRoleRef, newContacts);

      setTrustedContacts(prev => prev.map(c => (c.id === updatedContact.id ? updatedContact : c)));
  };

  const deleteContact = async (contactId: string) => {
      if(!user) return;
      const newContactsForDb = trustedContacts
        .filter(c => c.id !== contactId)
        .map(c => ({ name: c.name, relation: c.relation, phone: c.phone }));
      
      const userRoleRef = ref(db, `userRoles/${user.uid}/studentDetails/emergencyContacts`);
      await set(userRoleRef, newContactsForDb);

      setTrustedContacts(prev => prev.filter(c => c.id !== contactId));
  };
  
  const addJournalEntry = (data: DailyCheckinData) => {
    setDailyCheckinData(data);
    setCoins(c => c + 2);
    setStreak(s => s + 1);
    toast({
      title: "Daily Check-in Complete!",
      description: `You've earned 2 coins and extended your streak to ${streak + 1} days! Your Well-being Score is being updated.`,
    });
    sessionStorage.setItem('hasCheckedInToday', 'true');
  };

  const addAssessmentResult = (result: AssessmentResult) => {
    const newResults = {
        ...assessmentResults,
        [result.id]: result,
    };
    setAssessmentResults(newResults);
    setCoins(c => c + 5);
    toast({
        title: `${result.name} Completed!`,
        description: `You've earned 5 coins. Your score is being updated.`
    });
    // Trigger analysis with the newest results immediately
    analyzeCurrentState(newResults);
  };
  
  React.useEffect(() => {
    if(isDataLoaded.current) {
        analyzeCurrentState();
    }
  }, [messages, facialAnalysis, voiceAnalysis, dailyCheckinData, analyzeCurrentState]);
  
  const triggerCrisisAlerts = React.useCallback(async (currentContacts: TrustedContact[], isSelfHarmRisk: boolean) => {
    if (!user || !user.displayName) {
        // Don't send alerts if there's no user or user name.
        return;
    }
    const studentName = user.displayName;
    
    let messageBody: string;

    if(isSelfHarmRisk) {
        messageBody = `Hi, this is an Autogenerated message \n  "${studentName}" is in severe distress and there is a high probability of self harm , please immediately check upon him before its too late.`;
    } else {
        messageBody = `Crisis Alert: ${studentName} may be in distress. Please check in with them. This is an automated message from the Student Wellness Hub.`;
    }


    if(currentContacts.length === 0) {
        toast({
            variant: 'destructive',
            title: 'No Trusted Contacts',
            description: 'Please add a trusted contact to send crisis alerts.',
            duration: 10000,
        });
        return;
    }

    const contactPromises = currentContacts.map(contact => 
        sendSmsAction(contact.phone, messageBody)
    );

    const results = await Promise.all(contactPromises);
    const successfulContacts = currentContacts.filter((_, index) => results[index].success);
    const failedContacts = currentContacts.map((contact, index) => ({ ...contact, result: results[index] })).filter(c => !c.result.success);


    if (successfulContacts.length > 0) {
        const contactNames = successfulContacts.map(c => c.name).join(', ');
        toast({
            variant: 'destructive',
            title: 'Crisis Alert Triggered',
            description: `An SMS alert has been sent to your trusted contacts: ${contactNames}.`,
            duration: 10000,
        });
    }

    if (failedContacts.length > 0) {
        const failedContactNames = failedContacts.map(c => c.name).join(', ');
        const firstError = failedContacts[0].result.error;
        toast({
            variant: 'destructive',
            title: 'SMS Failed for Some Contacts',
            description: `Could not send SMS to ${failedContactNames}. Reason: ${firstError}`,
            duration: 10000,
        });
    }
  }, [user, toast]);

  React.useEffect(() => {
    if (wellbeingData && wellbeingData.wellbeingScore > 0) {
      const { name } = getWellbeingCategory(wellbeingData.wellbeingScore);
      if (name === 'Crisis') {
        triggerCrisisAlerts(trustedContacts, wellbeingData.selfHarmRisk);
      }
    }
  }, [wellbeingData, triggerCrisisAlerts, trustedContacts]);


  const value = {
    messages,
    setMessages,
    addMessage,
    wellbeingData,
    isAnalyzing,
    trustedContacts,
    addContact,
    updateContact,
    deleteContact,
    facialAnalysis,
    setFacialAnalysis,
    voiceAnalysis,
    setVoiceAnalysis,
    navItems,
    setNavItemsByRole,
    coins,
    setCoins,
    streak,
    setStreak,
    addJournalEntry,
    isCheckinOpen,
    setCheckinOpen,
    dailyCheckinData,
    setDailyCheckinData,
    assessmentResults,
    addAssessmentResult,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
