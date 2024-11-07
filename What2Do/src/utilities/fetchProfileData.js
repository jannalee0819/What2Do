import { firebase } from './firebase';
import { getDatabase, ref, get, set} from 'firebase/database';

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
        console.error("Error in checkProfile:", error);
        throw error;
    }
}

// return trip
export const getTrip = async (uid, tripName) => {
    try {
        const tripRef = ref(db, `users/${uid}/trips/${tripName}`);
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

// /**
//  * Create a new trip
//  * @param {string} userEmail - User's email
//  * @param {string} tripName - Name of the trip
//  * @param {Object} tripData - Trip details
//  */
// export const createTrip = async (userEmail, tripName, tripData) => {
//     try {
//         const tripRef = ref(db, `users/${userEmail}/trips/${tripName}`);
//         await set(tripRef, {
//             locations: {},
//             totalDays: tripData.totalDays || 1,
//             link: tripData.link || '',
//             ...tripData
//         });
//     } catch (error) {
//         console.error("Error in createTrip:", error);
//         throw error;
//     }
// }

// /**
//  * Update an existing trip
//  * @param {string} userEmail - User's email
//  * @param {string} tripName - Name of the trip
//  * @param {Object} updates - Updated trip data
//  */
// export const updateTrip = async (userEmail, tripName, updates) => {
//     try {
//         const tripRef = ref(db, `users/${userEmail}/trips/${tripName}`);
//         await update(tripRef, updates);
//     } catch (error) {
//         console.error("Error in updateTrip:", error);
//         throw error;
//     }
// }

// /**
//  * Delete a trip
//  * @param {string} userEmail - User's email
//  * @param {string} tripName - Name of the trip
//  */
// export const deleteTrip = async (userEmail, tripName) => {
//     try {
//         const tripRef = ref(db, `users/${userEmail}/trips/${tripName}`);
//         await remove(tripRef);
//     } catch (error) {
//         console.error("Error in deleteTrip:", error);
//         throw error;
//     }
// }

// /**
//  * Add a location to a trip
//  * @param {string} userEmail - User's email
//  * @param {string} tripName - Name of the trip
//  * @param {string} locationId - Location identifier
//  * @param {Object} locationData - Location details
//  */
// export const addLocation = async (userEmail, tripName, locationId, locationData) => {
//     try {
//         const locationRef = ref(db, `users/${userEmail}/trips/${tripName}/locations/${locationId}`);
//         await set(locationRef, {
//             destination: locationData.destination,
//             whichDay: locationData.whichDay,
//             description: locationData.description
//         });
//     } catch (error) {
//         console.error("Error in addLocation:", error);
//         throw error;
//     }
// }

// /**
//  * Get all trips for a user
//  * @param {string} userEmail - User's email
//  * @returns {Promise<Object>} All trips data
//  */
// export const getAllTrips = async (userEmail) => {
//     try {
//         const tripsRef = ref(db, `users/${userEmail}/trips`);
//         const tripsSnapshot = await get(tripsRef);
//         return tripsSnapshot.val() || {};
//     } catch (error) {
//         console.error("Error in getAllTrips:", error);
//         throw error;
//     }
// }

// /**
//  * Update a location in a trip
//  * @param {string} userEmail - User's email
//  * @param {string} tripName - Name of the trip
//  * @param {string} locationId - Location identifier
//  * @param {Object} updates - Updated location data
//  */
// export const updateLocation = async (userEmail, tripName, locationId, updates) => {
//     try {
//         const locationRef = ref(db, `users/${userEmail}/trips/${tripName}/locations/${locationId}`);
//         await update(locationRef, updates);
//     } catch (error) {
//         console.error("Error in updateLocation:", error);
//         throw error;
//     }
// }

// /**
//  * Delete a location from a trip
//  * @param {string} userEmail - User's email
//  * @param {string} tripName - Name of the trip
//  * @param {string} locationId - Location identifier
//  */
// export const deleteLocation = async (userEmail, tripName, locationId) => {
//     try {
//         const locationRef = ref(db, `users/${userEmail}/trips/${tripName}/locations/${locationId}`);
//         await remove(locationRef);
//     } catch (error) {
//         console.error("Error in deleteLocation:", error);
//         throw error;
//     }
// }