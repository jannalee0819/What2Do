import React, { useState } from 'react';
import { Card, CardContent } from './Card';
import { TripCard } from './TripCard';
import { Plus, LogOut, Star, MapPin } from "lucide-react";
import sampleData from '../assets/parsed_data.json';

export const Profile = () => {
  const [data, setData] = useState(sampleData);

  const recommendedTrips = Array(4).fill(null).map((_, index) => ({
    locations: {
      1: {
        destination: `Destination ${index + 1}`,
        description: `Exciting activities in destination ${index + 1}`,
        day: 1
      },
      2: {
        destination: `Destination ${index + 1} Side Trip`,
        description: `More activities in destination ${index + 1}`,
        day: 2
      }
    },
    source: `https://travel-blog.com/trip${index + 1}`,
    days: 2
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b to-gray-100 from-white">
      <div className="container mx-auto pb-16 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-row flex-end justify-between items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome, <span className="text-blue-500">{data.user.name}</span> 👋
              </h1>
              <p className="text-gray-500">Ready for your next adventure?</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-4 sm:py-2 bg-white hover:bg-gray-50 text-gray-600 font-medium rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <LogOut className="w-4 h-4" strokeWidth={2} />
              <span className='hidden sm:block'>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Recommended Trips - Horizontal Scroll */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-700">Recommended Trips</h2>
          </div>
          <div className="relative">
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-2 sm:gap-4">
                {recommendedTrips.map((trip, index) => (
                  <div className="w-80 flex-shrink-0">
                    <TripCard key={index} trip={trip} rec={1} tripName="Fun Adventure!" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-700">My Trips</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-sm transition-all hover:shadow-md">
              Create Trip
              <Plus className="w-4 h-4" strokeWidth={2.6} />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.entries(data.user.trips).map(([key, trip]) => (
              <div className="transform transition-all hover:scale-[1.02]">
                <TripCard key={key} trip={trip} tripName={key} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;