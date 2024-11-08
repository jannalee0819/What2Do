// utilities/firebaseSummaryHelper.js
import { ref, get, update, getDatabase } from "firebase/database";
import { firebase } from "./firebase";

export const fetchTripDataFromFirebase = async (userId, tripId) => {
  try {
    const db = getDatabase(firebase);
    const tripRef = ref(db, `users/${userId}/trips/${tripId}`);
    const snapshot = await get(tripRef);

    if (snapshot.exists()) {
      const rawData = snapshot.val();
      const locations = rawData.locations || {};

      // Group locations by day
      const locationsByDay = {};
      Object.entries(locations).forEach(([locId, locData]) => {
        const day = locData.day;
        if (!locationsByDay[day]) {
          locationsByDay[day] = [];
        }
        locationsByDay[day].push({
          destination: locData.destination,
          description: locData.description,
          originalDestination: locData.destination, // Keep track of original name for updates
        });
      });

      // Convert to the format your component expects
      const formattedData = {
        title: rawData.tripName || "Untitled Trip",
        days: Object.entries(locationsByDay)
          .map(([day, locs]) => ({
            day: parseInt(day),
            locations: locs,
          }))
          .sort((a, b) => a.day - b.day),
        locations: locations, // Keep original locations data for reference
      };

      return { data: formattedData, error: null, isUsingMockData: false };
    }

    return { data: null, error: null, isUsingMockData: true };
  } catch (error) {
    console.error("Error fetching trip data:", error);
    return { data: null, error, isUsingMockData: true };
  }
};

export const updateTripInFirebase = async (userId, tripId, editedData) => {
  try {
    const db = getDatabase(firebase);
    const updates = {};

    editedData.days.forEach((day) => {
      day.locations.forEach((location) => {
        // Find the location key in the original data structure
        const locationKey = Object.keys(editedData.locations).find(
          (key) =>
            editedData.locations[key].destination ===
            location.originalDestination
        );
        if (locationKey) {
          updates[
            `users/${userId}/trips/${tripId}/locations/${locationKey}/destination`
          ] = location.destination;
          updates[
            `users/${userId}/trips/${tripId}/locations/${locationKey}/description`
          ] = location.description;
        }
      });
    });

    await update(ref(db), updates);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating trip:", error);
    return { success: false, error: error.message };
  }
};
