import React from "react";
import { Link } from "react-router-dom";
import AuthBanner from "../pages/LoginPage/AuthBanner";
import { WorldMapBackground } from "../pages/LoginPage/loginBackground";

export const TripList = ({ trips }) => {
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "No date set";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const formatDuration = (startTimestamp, endTimestamp) => {
    if (!startTimestamp || !endTimestamp) return "";
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="p-6 min-h-screen relative overflow-hidden bg-[#E6F3FF]">
      <WorldMapBackground />
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <AuthBanner />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 z-10 relative">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 shadow-lg bg-white hover:shadow-xl transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold">{trip.location}</h2>
            <div className="text-gray-600 space-y-1">
              <p>{formatDateTime(trip.startTimestamp).split("at")[0]}</p>
              <p className="text-sm">
                {new Date(trip.startTimestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(trip.endTimestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                <span className="ml-2 text-gray-500">
                  ({formatDuration(trip.startTimestamp, trip.endTimestamp)})
                </span>
              </p>
            </div>
            <div className="mt-2">
              <p className="font-medium">
                Activities ({trip.activities.length}):
              </p>
              <ul className="mt-1 text-sm text-gray-600">
                {trip.activities.slice(0, 3).map((activity, i) => (
                  <li key={i} className="truncate">
                    • {activity}
                  </li>
                ))}
                {trip.activities.length > 3 && (
                  <li className="text-gray-500">
                    +{trip.activities.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-4 space-x-2">
              <Link to={`/options`} className="text-blue-500 hover:underline">
                Generate Options
              </Link>
              <Link
                to={`/edit/${index}`}
                className="text-green-500 hover:underline"
              >
                Edit Trip
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripList;
