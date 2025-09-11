
'use client';

import { analyzeWellbeing } from '@/app/actions';
import type { Message, WellbeingData, TrustedContact } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getWellbeingCategory } from '@/lib/utils';

const initialContacts: TrustedContact[] = [
    { id: '1', name: 'Jane Doe', relation: 'Mother', avatar: 'https://picsum.photos/seed/contact1/100/100', phone: '123-456-7890' },
    { id: '2', name: 'John Smith', relation: 'Friend', avatar: 'https://picsum.photos/seed/contact2/100/100', phone: '098-765-4321' },
];


type AppContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  wellbeingData: WellbeingData | null;
  isAnalyzing: boolean;
  analyzeConversation: () => Promise<void>;
  trustedContacts: TrustedContact[];
  addContact: (contact: Omit<TrustedContact, 'id' | 'avatar'>) => void;
  updateContact: (contact: TrustedContact) => void;
  deleteContact: (contactId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [wellbeingData, setWellbeingData] = useState<WellbeingData | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(initialContacts);
  const { toast } = useToast();
  const [lastNotifiedScore, setLastNotifiedScore] = useState<number | null>(null);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content }]);
  };

  const analyzeConversation = async () => {
    if (messages.length === 0) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeWellbeing(messages);
      if (data) {
        setWellbeingData(data);
      }
    } catch (error) {
      console.error('Failed to analyze conversation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

   const addContact = (contact: Omit<TrustedContact, 'id' | 'avatar'>) => {
    const newId = (trustedContacts.length + 1).toString() + Date.now().toString();
    setTrustedContacts(prev => [
      ...prev,
      { 
        ...contact, 
        id: newId,
        avatar: `https://picsum.photos/seed/${newId}/100/100`
      },
    ]);
  };

  const updateContact = (updatedContact: TrustedContact) => {
    setTrustedContacts(prev =>
      prev.map(c => (c.id === updatedContact.id ? updatedContact : c))
    );
  };

  const deleteContact = (contactId: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== contactId));
  };


  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      analyzeConversation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);
  
  useEffect(() => {
    if (wellbeingData && wellbeingData.wellbeingScore !== lastNotifiedScore) {
      const { name } = getWellbeingCategory(wellbeingData.wellbeingScore);
      if (name === 'Crisis') {
        const contactNames = trustedContacts.map(c => c.name).join(', ');
        toast({
            variant: 'destructive',
            title: 'Crisis Alert Triggered',
            description: `A notification has been automatically sent to your trusted contacts (${contactNames}) and the on-campus counselor.`
        });
        setLastNotifiedScore(wellbeingData.wellbeingScore);
      }
    }
  }, [wellbeingData, trustedContacts, toast, lastNotifiedScore]);

  const value = {
    messages,
    setMessages,
    addMessage,
    wellbeingData,
    isAnalyzing,
    analyzeConversation,
    trustedContacts,
    addContact,
    updateContact,
    deleteContact,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
