import { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { firebase } from "./firebase";

console.log('Firebase helper initializing...'); // Debug log
const auth = getAuth(firebase);
const db = getDatabase(firebase);
console.log('Auth initialized successfully'); // Debug log

export const signInWithGoogle = () => {
  console.log('Attempting Google sign in...'); // Debug log
  return signInWithPopup(auth, new GoogleAuthProvider());
};

const firebaseSignOut = () => {
  console.log('Attempting sign out...'); // Debug log
  return signOut(auth);
};

export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    console.log('Setting up auth state listener...'); // Debug log
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user'); // Debug log
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return [user];
};

export const useUser = () => {
  const [user] = useAuthState();
  return user;
};

// Add the missing addTrip function
export const addTrip = async (tripData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const tripId = `trip_${Date.now()}`; // Generate a unique ID for the trip
    const tripRef = ref(db, `users/${user.uid}/trips/${tripId}`);

    await set(tripRef, {
      ...tripData,
      createdAt: new Date().toISOString(),
    });

    return tripId;
  } catch (error) {
    console.error("Error in addTrip:", error);
    throw error;
  }
};