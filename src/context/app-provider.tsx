
'use client';

import { analyzeWellbeing } from '@/app/actions';
import type { Message, WellbeingData } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  wellbeingData: WellbeingData | null;
  isAnalyzing: boolean;
  analyzeConversation: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [wellbeingData, setWellbeingData] = useState<WellbeingData | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const value = {
    messages,
    setMessages,
    addMessage,
    wellbeingData,
    isAnalyzing,
    analyzeConversation,
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
