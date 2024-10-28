import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Footprints } from 'lucide-react';

export const TripItinerary = () => {
  const itineraryData = {
    day1: {
      destination: 'option 1',
      time: '10:00 AM',
      description: 'eat breakfast',
      travelToNext: '20 mins'
    },
    day2: {
      destination: 'option 2',
      time: '12:00 PM',
      description: 'touch grass',
      travelToNext: '20 mins'
    },
    day3: {
      destination: 'option 1',
      time: '3:00 PM',
      description: 'touch grass',
      travelToNext: null
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div id="itinerary-card" className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="bg-white px-6 py-4 rounded-t-lg">
            <h1 className="text-2xl font-bold">Trip Itinerary</h1>
        </div>

        <div className="p-6">
            <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Destination</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {Object.entries(itineraryData).map(([key, item], index) => (
                    <React.Fragment key={key}>
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{item.time}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span>{item.destination}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                        {item.description}
                        </td>
                    </tr>
                    {item.travelToNext && (
                        <tr className="bg-gray-50">
                        <td colSpan="3" className="px-6 py-2 text-sm text-gray-500 italic">
                            <div className="flex items-center justify-center space-x-2">
                            <Footprints className="w-4 h-4 text-gray-400" />
                            <span>Travel time: {item.travelToNext}</span>
                            </div>
                        </td>
                        </tr>
                    )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        <div className="flex justify-end mt-4">
        </div>
        </div>
        <Link
            to="/map"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Back to Map
        </Link>
    </div>
  );
};