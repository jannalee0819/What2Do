import { firebase } from './firebase';
import { getDatabase, ref, get, set, remove} from 'firebase/database';

// Initialize the database
const db = getDatabase(firebase);

// return profile if exsits, else create
export const getProfile = async (uid, name) => {

    try {
        const userRef = ref(db, `users/${uid}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists()) {
            console.log(name)
            const initialData = {
                trips: {},
                createdAt: new Date().toISOString(),
                displayName: name
            };
            await set(userRef, initialData); // Using set instead of update for initial data
            return initialData;
        }
        return userSnapshot.val();
    } catch (error) {
        console.error("Error in getProfile:", error);
        throw error;
    }
}

// return trip
export const getTrip = async (uid, tripId) => {
    try {
        const tripRef = ref(db, `users/${uid}/trips/${tripId}`);
        const tripSnapshot = await get(tripRef);
        
        if (!tripSnapshot.exists()) {
            throw new Error('Trip not found');
        }
        
        return tripSnapshot.val();
    } catch (error) {
        console.error("Error in getTrip:", error);
        throw error;
    }
}


// Delete a question -- maybe use a resolve for pm side too?
export const deleteTrip = async (tripId, uid) => {
    try {
      const tripRef = ref(db, `users/${uid}/trips/${tripId}`);
      await remove(tripRef);
      console.log(`success! ${tripId} deleted`);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  };