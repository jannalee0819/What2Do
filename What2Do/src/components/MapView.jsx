import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";

export const MapView = () => {
  const location = useLocation();
  const selectedActivities = location.state?.selectedOptions || [];

  return (
    // TODO
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trip Map</h1>
      <div className="bg-gray-200 h-96 rounded flex items-center justify-center">
        <p>Map View Placeholder</p>
      </div>
      <Link
        to="/"
        className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Back to Trips
      </Link>
      <Link
        to="/itinerary"
        className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        View Itinerary
      </Link>
      <div>
          <h2>Map Page</h2>
        
          {selectedActivities.map((item, index) => (
              <div key={index}>
                  <h3>{item.activity}</h3>
                  <ul>
                      {item.selectedOptions.map((option, optIndex) => (
                          <li key={optIndex}>{option}</li>
                      ))}
                  </ul>
              </div>
          ))}
      </div>
    </div>
    
    
  );
};
