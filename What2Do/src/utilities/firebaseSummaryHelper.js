import { ref, get } from "firebase/database";
import { db } from "./firebase";

export const fetchTripDataFromFirebase = async (userId, tripId) => {
  try {
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
        });
      });

      // Convert to the format your component expects
      const formattedData = {
        title: `Trip to ${
          Object.values(locations)[0]?.destination || "Unknown"
        }`,
        days: Object.entries(locationsByDay)
          .map(([day, locs]) => ({
            day: parseInt(day),
            locations: locs,
          }))
          .sort((a, b) => a.day - b.day),
      };

      return { data: formattedData, error: null, isUsingMockData: false };
    }

    return { data: null, error: null, isUsingMockData: true };
  } catch (error) {
    console.error("Error fetching trip data:", error);
    return { data: null, error, isUsingMockData: true };
  }
};
