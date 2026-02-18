// src/lib/firebase/peer-messaging.ts
import { database } from './client-app';
import { 
  ref, 
  push, 
  set, 
  get, 
  onValue, 
  query, 
  orderByChild, 
  equalTo,
  update,
  serverTimestamp,
  off
} from 'firebase/database';

// Type definitions for Firebase conversation and message data
export type FirebaseConversation = {
  studentId: string;
  studentName: string;
  peerBuddyId: string;
  peerBuddyName: string;
  status: 'pending' | 'accepted' | 'active' | 'closed';
  createdAt: string;
  lastMessageAt: string;
};

export type FirebaseMessage = {
  sender: string;
  senderId: string;
  text: string;
  timestamp: string;
  conversationId: string;
  createdAt: string;
};

/**
 * Creates a new conversation request from student to peer buddy
 */
export async function createConversationRequest(
  studentId: string,
  studentName: string,
  peerBuddyId: string,
  peerBuddyName: string
): Promise<string> {
  try {
    const conversationsRef = ref(database, 'conversations');
    const newConversationRef = push(conversationsRef);
    const conversationId = newConversationRef.key;

    if (!conversationId) {
      throw new Error('Failed to generate conversation ID');
    }

    const conversation: FirebaseConversation = {
      studentId,
      studentName,
      peerBuddyId,
      peerBuddyName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
    };

    await set(newConversationRef, conversation);
    return conversationId;
  } catch (error) {
    console.error('Error creating conversation request:', error);
    throw error;
  }
}

/**
 * Allows peer buddy to accept a conversation request
 */
export async function acceptConversation(conversationId: string): Promise<void> {
  try {
    const conversationRef = ref(database, `conversations/${conversationId}`);
    await update(conversationRef, {
      status: 'accepted',
      lastMessageAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error accepting conversation:', error);
    throw error;
  }
}

/**
 * Sends a message to a conversation
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<string> {
  try {
    const messagesRef = ref(database, `messages/${conversationId}`);
    const newMessageRef = push(messagesRef);
    const messageId = newMessageRef.key;

    if (!messageId) {
      throw new Error('Failed to generate message ID');
    }

    const now = new Date();
    const message: FirebaseMessage = {
      sender: senderName,
      senderId,
      text,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      conversationId,
      createdAt: now.toISOString(),
    };

    await set(newMessageRef, message);

    // Update conversation's lastMessageAt
    const conversationRef = ref(database, `conversations/${conversationId}`);
    await update(conversationRef, {
      lastMessageAt: now.toISOString(),
    });

    return messageId;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Real-time listener for messages in a conversation
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (messages: (FirebaseMessage & { id: string })[]) => void
): () => void {
  const messagesRef = ref(database, `messages/${conversationId}`);

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const messages: (FirebaseMessage & { id: string })[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val() as FirebaseMessage,
        });
      });
    }

    // Sort messages by creation time
    messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    callback(messages);
  });

  // Return unsubscribe function
  return () => off(messagesRef, 'value', unsubscribe);
}

/**
 * Fetches all conversations for a student
 */
export async function getStudentConversations(
  studentId: string
): Promise<(FirebaseConversation & { id: string })[]> {
  try {
    const conversationsRef = ref(database, 'conversations');
    const studentQuery = query(
      conversationsRef,
      orderByChild('studentId'),
      equalTo(studentId)
    );

    const snapshot = await get(studentQuery);
    const conversations: (FirebaseConversation & { id: string })[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        conversations.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val() as FirebaseConversation,
        });
      });
    }

    // Sort by lastMessageAt (most recent first)
    conversations.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return conversations;
  } catch (error) {
    console.error('Error fetching student conversations:', error);
    throw error;
  }
}

/**
 * Fetches all conversations for a peer buddy
 */
export async function getPeerBuddyConversations(
  peerBuddyId: string
): Promise<(FirebaseConversation & { id: string })[]> {
  try {
    const conversationsRef = ref(database, 'conversations');
    const peerBuddyQuery = query(
      conversationsRef,
      orderByChild('peerBuddyId'),
      equalTo(peerBuddyId)
    );

    const snapshot = await get(peerBuddyQuery);
    const conversations: (FirebaseConversation & { id: string })[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        conversations.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val() as FirebaseConversation,
        });
      });
    }

    // Sort by lastMessageAt (most recent first)
    conversations.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return conversations;
  } catch (error) {
    console.error('Error fetching peer buddy conversations:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates for student conversations
 */
export function subscribeToStudentConversations(
  studentId: string,
  callback: (conversations: (FirebaseConversation & { id: string })[]) => void
): () => void {
  const conversationsRef = ref(database, 'conversations');
  const studentQuery = query(
    conversationsRef,
    orderByChild('studentId'),
    equalTo(studentId)
  );

  const unsubscribe = onValue(studentQuery, (snapshot) => {
    const conversations: (FirebaseConversation & { id: string })[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        conversations.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val() as FirebaseConversation,
        });
      });
    }

    // Sort by lastMessageAt (most recent first)
    conversations.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    callback(conversations);
  });

  return () => off(conversationsRef, 'value', unsubscribe);
}

/**
 * Subscribe to real-time updates for peer buddy conversations
 */
export function subscribeToPeerBuddyConversations(
  peerBuddyId: string,
  callback: (conversations: (FirebaseConversation & { id: string })[]) => void
): () => void {
  const conversationsRef = ref(database, 'conversations');
  const peerBuddyQuery = query(
    conversationsRef,
    orderByChild('peerBuddyId'),
    equalTo(peerBuddyId)
  );

  const unsubscribe = onValue(peerBuddyQuery, (snapshot) => {
    const conversations: (FirebaseConversation & { id: string })[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        conversations.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val() as FirebaseConversation,
        });
      });
    }

    // Sort by lastMessageAt (most recent first)
    conversations.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    callback(conversations);
  });

  return () => off(conversationsRef, 'value', unsubscribe);
}
