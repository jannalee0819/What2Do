import React from "react";
import { Link, useParams } from "react-router-dom";

export const MapView = ({ trips }) => {
  const { id } = useParams();
  const trip = trips[id];

  return (
    // TODO
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trip Map - {trip?.location}</h1>
      <div className="bg-gray-200 h-96 rounded flex items-center justify-center">
        <p>Map View Placeholder for {trip?.location}</p>
      </div>
      <Link
        to="/"
        className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Back to Trips
      </Link>
    </div>
  );
};
