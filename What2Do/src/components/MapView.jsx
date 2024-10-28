import React from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { TripItinerary } from "./TripItinerary";

export const MapView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedActivities = location.state?.selectedOptions || [];

  const handleViewItinerary = () => {
    navigate('/itinerary', { state: { selectedActivities: selectedActivities } });
  };


  return (
    // TODO
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trip Map</h1>
      <div className="bg-gray-200 h-96 rounded flex items-center gap-8 bg-[url('/map.png')] justify-center gap-8">
      </div>
      {/* <button
        onClick={handleViewItinerary}
        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        View Itinerary
      </button> */}
      <TripItinerary trip={selectedActivities}/>
      <Link
        to="/"
        className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Back to Trips
      </Link>
    </div>
    
    
  );
};
