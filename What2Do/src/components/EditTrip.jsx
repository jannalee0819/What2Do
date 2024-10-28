import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const EditTrip = ({ trips, onUpdateTrip }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const tripIndex = parseInt(id);

  const [tripData, setTripData] = useState({
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    activities: [],
  });
  const [currentActivity, setCurrentActivity] = useState("");

  useEffect(() => {
    if (trips[tripIndex]) {
      const trip = trips[tripIndex];
      const startDate = new Date(trip.startTimestamp);
      const endDate = new Date(trip.endTimestamp);

      setTripData({
        location: trip.location,
        date: startDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        activities: trip.activities,
      });
    }
  }, [trips, tripIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const startTimestamp = new Date(`${tripData.date}T${tripData.startTime}`);
    const endTimestamp = new Date(`${tripData.date}T${tripData.endTime}`);

    onUpdateTrip(tripIndex, {
      ...tripData,
      startTimestamp,
      endTimestamp,
    });
    navigate("/");
  };

  const addActivity = () => {
    if (currentActivity.trim()) {
      setTripData((prev) => ({
        ...prev,
        activities: [...prev.activities, currentActivity],
      }));
      setCurrentActivity("");
    }
  };

  if (!trips[tripIndex]) {
    return <div>Trip not found</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Trip</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={tripData.location}
            onChange={(e) =>
              setTripData((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={tripData.date}
              onChange={(e) =>
                setTripData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={tripData.startTime}
              onChange={(e) =>
                setTripData((prev) => ({ ...prev, startTime: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={tripData.endTime}
              onChange={(e) =>
                setTripData((prev) => ({ ...prev, endTime: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Activities</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentActivity}
              onChange={(e) => setCurrentActivity(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add an activity"
            />
            <button
              type="button"
              onClick={addActivity}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {tripData.activities.map((activity, index) => (
              <li key={index} className="flex items-center gap-2">
                <span>{activity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setTripData((prev) => ({
                      ...prev,
                      activities: prev.activities.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Save Trip
          </button>
          <Link
            to="/"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
