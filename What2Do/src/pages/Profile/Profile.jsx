import React, { useEffect, useState } from 'react';
import { TripCard } from '../../components/TripCard';
import { Plus, LogOut, Star, MapPin, FileUp, PenSquare } from "lucide-react";
import { signOut, useAuthState } from "../../utilities/firebase_helper";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from '../../utilities/fetchProfileData';

export function Profile() {
  const [data, setData] = useState({ trips: {} });
  const [recs, setRecs] = useState({ trips: {} });
  const [user, loading] = useAuthState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeProfile = async () => {
      if (user && !loading && !isInitialized) {
        try {
          const profileData = await getProfile(user.uid, user.displayName);
          setData({trips: profileData.trips || {} });
          setIsInitialized(true);
          const recsData = await getProfile("recommendations", "recommendations");
          setRecs({ trips: recsData.trips || {} });
        } catch (error) {
          console.error("Error initializing profile:", error);
        }
      }
    };
    initializeProfile();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [user, loading, isInitialized]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b to-gray-100 from-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b to-gray-100 from-white">
      <div className="container mx-auto pb-16 px-4 sm:px-6 lg:px-8 py-8">
        {/* header */}
        <div className="mb-12">
          <div className="flex flex-row flex-end justify-between items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Hey, <span className="text-blue-500">{user.displayName || 'User'}</span> 👋
              </h1>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-4 sm:py-2 bg-white hover:bg-gray-50 text-gray-600 font-medium rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              <span className='hidden sm:block'>Sign Out</span>
            </button>
          </div>
        </div>

        {/* recs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-700">Recommended Trips</h2>
          </div>
          <div className="relative">
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-2 sm:gap-4">
                {Object.entries(recs.trips).map(([tripName, tripData]) => (
                  <div key={tripName} className="w-80 flex-shrink-0">
                    <TripCard trip={tripData} rec={1} tripName={tripName} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* my trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-700">My Trips</h2>
            </div>
            <div className="dropdown-container relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                Create Trip
                <Plus className="w-4 h-4" strokeWidth={2.6} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <Link
                  to="/add"
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Manual Input</span>
                </Link>
                <Link
                  to="/upload"
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FileUp className="w-4 h-4" />
                  <span>URL Upload</span>
                </Link>
              </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.entries(data.trips).map(([tripName, tripData]) => (
              <div key={tripName} className="transform transition-all hover:scale-[1.02]">
                <TripCard trip={tripData} tripName={tripName} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;