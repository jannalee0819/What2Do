import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const AddTrip = ({ onAddTrip }) => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    activities: [],
  });
  const [currentActivity, setCurrentActivity] = useState("");
  const [errors, setErrors] = useState({
    activities: "",
    time: "",
  });

  const validateTime = (startTime, endTime) => {
    if (!startTime || !endTime) return true;
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    if (startHours > endHours) return false;
    if (startHours === endHours && startMinutes >= endMinutes) return false;
    return true;
  };

  const handleTimeChange = (e, timeType) => {
    const newTime = e.target.value;
    const newTripData = {
      ...tripData,
      [timeType]: newTime,
    };

    if (
      !validateTime(
        timeType === "startTime" ? newTime : tripData.startTime,
        timeType === "endTime" ? newTime : tripData.endTime
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        time: "End time must be later than start time",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        time: "",
      }));
    }

    setTripData(newTripData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      activities: "",
      time: "",
    };

    if (tripData.activities.length === 0) {
      newErrors.activities = "Please add at least one activity";
    }

    if (!validateTime(tripData.startTime, tripData.endTime)) {
      newErrors.time = "End time must be later than start time";
    }

    if (newErrors.activities || newErrors.time) {
      setErrors(newErrors);
      return;
    }

    const startTimestamp = new Date(`${tripData.date}T${tripData.startTime}`);
    const endTimestamp = new Date(`${tripData.date}T${tripData.endTime}`);

    onAddTrip({
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
      setErrors((prev) => ({
        ...prev,
        activities: "",
      }));
    }
  };

  const handleActivityKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addActivity();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Trip</h1>
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
              onChange={(e) => handleTimeChange(e, "startTime")}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={tripData.endTime}
              onChange={(e) => handleTimeChange(e, "endTime")}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
        <div>
          <label className="block text-sm font-medium mb-1">
            Activities<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentActivity}
              onChange={(e) => setCurrentActivity(e.target.value)}
              onKeyPress={handleActivityKeyPress}
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
          {errors.activities && (
            <p className="text-red-500 text-sm mt-1">{errors.activities}</p>
          )}
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
