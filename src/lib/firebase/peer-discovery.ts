// src/lib/firebase/peer-discovery.ts
import { database } from './client-app';
import { 
  ref, 
  get, 
  onValue, 
  query, 
  orderByChild, 
  equalTo
} from 'firebase/database';

// Type definitions for peer buddy and student data
export type PeerBuddy = {
  uid: string;
  fullName: string;
  email: string;
  role: string;
  specializations?: string[];
  status?: 'Available' | 'Busy';
};

export type Student = {
  uid: string;
  fullName: string;
  email: string;
  role: string;
};

/**
 * Fetches all peer buddies from the database
 */
export async function getAvailablePeerBuddies(): Promise<PeerBuddy[]> {
  try {
    const userRolesRef = ref(database, 'userRoles');
    const peerBuddyQuery = query(
      userRolesRef,
      orderByChild('role'),
      equalTo('peer-buddy')
    );

    const snapshot = await get(peerBuddyQuery);
    const peerBuddies: PeerBuddy[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        peerBuddies.push({
          uid: childSnapshot.key as string,
          fullName: data.fullName || 'Peer Buddy',
          email: data.email || '',
          role: data.role,
          specializations: data.peerBuddyDetails?.specializations || ['General Support'],
          status: 'Available' as const, // Default status
        });
      });
    }

    return peerBuddies;
  } catch (error) {
    console.error('Error fetching peer buddies:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates for peer buddies
 */
export function subscribeToPeerBuddies(
  callback: (peerBuddies: PeerBuddy[]) => void
): () => void {
  const userRolesRef = ref(database, 'userRoles');
  const peerBuddyQuery = query(
    userRolesRef,
    orderByChild('role'),
    equalTo('peer-buddy')
  );

  const unsubscribe = onValue(peerBuddyQuery, (snapshot) => {
    const peerBuddies: PeerBuddy[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        peerBuddies.push({
          uid: childSnapshot.key as string,
          fullName: data.fullName || 'Peer Buddy',
          email: data.email || '',
          role: data.role,
          specializations: data.peerBuddyDetails?.specializations || ['General Support'],
          status: 'Available' as const, // Default status
        });
      });
    }

    callback(peerBuddies);
  });

  return unsubscribe;
}

/**
 * Fetches all students from the database
 */
export async function getAvailableStudents(): Promise<Student[]> {
  try {
    const userRolesRef = ref(database, 'userRoles');
    const studentQuery = query(
      userRolesRef,
      orderByChild('role'),
      equalTo('student')
    );

    const snapshot = await get(studentQuery);
    const students: Student[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        students.push({
          uid: childSnapshot.key as string,
          fullName: data.fullName || 'Student',
          email: data.email || '',
          role: data.role,
        });
      });
    }

    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates for students
 */
export function subscribeToStudents(
  callback: (students: Student[]) => void
): () => void {
  const userRolesRef = ref(database, 'userRoles');
  const studentQuery = query(
    userRolesRef,
    orderByChild('role'),
    equalTo('student')
  );

  const unsubscribe = onValue(studentQuery, (snapshot) => {
    const students: Student[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        students.push({
          uid: childSnapshot.key as string,
          fullName: data.fullName || 'Student',
          email: data.email || '',
          role: data.role,
        });
      });
    }

    callback(students);
  });

  return unsubscribe;
}
