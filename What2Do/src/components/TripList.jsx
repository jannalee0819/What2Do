import React from "react";
import { Link } from "react-router-dom";

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Link
          to="/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Trip
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip, index) => (
          <div key={index} className="border rounded-lg p-4 shadow">
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
              <Link
                to={`/map/${index}`}
                className="text-blue-500 hover:underline"
              >
                View Map
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
