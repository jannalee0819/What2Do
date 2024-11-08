import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { fetchTripDataFromFirebase } from '../../utilities/firebaseSummaryHelper'; 
import { useUser, useAuthState } from '../../utilities/firebase_helper';
import AuthBanner from '../../pages/LoginPage/AuthBanner';
import recommendedTrips from '../../assets/parsed_data.json';

const formatRecommendedTrip = (recId) => {
    const tripData = recommendedTrips.users.recommendations.trips[recId];
    if (!tripData) return null;

    const locationsByDay = {};
    Object.values(tripData.locations).forEach(location => {
        if (!locationsByDay[location.day]) {
            locationsByDay[location.day] = [];
        }
        locationsByDay[location.day].push({
            destination: location.destination,
            description: location.description
        });
    });

    return {
        title: `Trip to ${Object.values(tripData.locations)[0]?.destination}`,
        days: Object.entries(locationsByDay).map(([day, locations]) => ({
            day: parseInt(day),
            locations
        })).sort((a, b) => a.day - b.day),
        link: tripData.link,
        totalDays: tripData.days
    };
};

const SummaryCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
        {children}
    </div>
);
const mockData = {
    title: "Northwestern Campus Tour",
    days: [
        {
            day: 1,
            locations: [
                {
                    destination: "Evanston Campus",
                    description: "9:00 AM - 12:00 PM: Tour the beautiful lakeside campus including University Library and The Rock"
                },
                {
                    destination: "Downtown Evanston",
                    description: "2:00 PM - 5:00 PM: Explore local restaurants and shops on Davis Street"
                }
            ]
        },
        {
            day: 2,
            locations: [
                {
                    destination: "Lakefill",
                    description: "10:00 AM - 1:00 PM: Walk along Lake Michigan and visit the nature areas"
                },
                {
                    destination: "Ryan Field",
                    description: "3:00 PM - 5:00 PM: Check out the football stadium and athletic facilities"
                }
            ]
        },
        {
            day: 3,
            locations: [
                {
                    destination: "Technological Institute",
                    description: "11:00 AM - 2:00 PM: Visit the engineering buildings and research labs"
                }
            ]
        }
    ]
};

export const TripSummaryPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUsingMockData, setIsUsingMockData] = useState(false);
    const [user] = useAuthState();

    const getUserId = () => {
        // If we have both id and tripId in the route
        if (params.id && params.tripId) {
            return params.id; // Use the provided userId
        }
        // If we only have tripId in the route
        if (params.tripId && !params.id) {
            return user?.uid; // Use the authenticated user's uid
        }
        return null;
    };

    const getTripId = () => {
        return params.tripId || params.id; // params.id in this case would be the tripId
    };
    
    useEffect(() => {
        const loadTripData = async () => {
            try {
                setLoading(true);
                const tripId = params.tripId || params.id;

                // Check if this is a recommendation route (rec1, rec2, etc.)
                if (tripId?.startsWith('rec')) {
                    const recData = formatRecommendedTrip(tripId);
                    if (recData) {
                        setTripData(recData);
                        setIsUsingMockData(false);
                        setLoading(false);
                        return;
                    }
                }

                // If not a recommendation or recommendation not found, proceed with normal flow
                if (!params.id && !user) {
                    console.log('Waiting for user data...');
                    return;
                }

                const effectiveUserId = getUserId();
                const effectiveTripId = getTripId();

                if (!effectiveUserId || !effectiveTripId) {
                    console.log('Missing required IDs');
                    return;
                }

                console.log('Using User ID:', effectiveUserId);
                
                const { data, error, isUsingMockData: usingMock } = 
                    await fetchTripDataFromFirebase(effectiveUserId, effectiveTripId);
                
                setTripData(data || formatRecommendedTrip('rec1')); // Fallback to rec1 if no data
                setIsUsingMockData(usingMock);
            } catch (error) {
                console.error("Error loading trip data:", error);
                setTripData(formatRecommendedTrip('rec1')); // Fallback to rec1 on error
                setIsUsingMockData(true);
            } finally {
                setLoading(false);
            }
        };

        loadTripData();
    }, [params, user]);

    const handleAddToTrips = () => {
        navigate(`/itinerary/${params.tripId}`);
    };

    const handleShare = () => {
        // Get the base URL (e.g., "https://yourapp.com")
        const baseUrl = window.location.origin;
        
        // Get the effective user ID (either from params or current user)
        const effectiveUserId = params.id || user?.uid;
        const effectiveTripId = params.tripId || params.id; // depending on route pattern
    
        if (effectiveUserId && effectiveTripId) {
            // Construct the sharing URL with the correct format
            const shareUrl = `${baseUrl}/summary/${effectiveUserId}/${effectiveTripId}`;
            
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } else {
            alert('Unable to generate sharing link');
        }
    };

    const handleBackHome = () => {
        navigate('/');
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl">Loading trip details...</div>
        </div>;
    }

    if (!tripData) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl">Trip not found</div>
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <SummaryCard>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="border-b pb-4">
                        <h1 className="text-2xl font-bold text-center">{tripData.title}</h1>
                    </div>

                    {/* Itinerary Summary */}
                    <div className="space-y-4">
                        {tripData.days.map((day, index) => (
                            <div key={index} className="border-b last:border-0 pb-4">
                                <h2 className="font-semibold text-lg mb-2">Day {day.day}</h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    {day.locations.map((location, locIndex) => (
                                        <li key={locIndex} className="space-y-1">
                                            <span className="font-medium text-gray-800">
                                                {location.destination}
                                            </span>
                                            <p className="ml-6 text-gray-600">
                                                {location.description}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={handleBackHome}
                            className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg
                                     hover:bg-gray-200 transition-colors duration-200
                                     font-medium border border-gray-300"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={handleAddToTrips}
                            className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-lg
                                     hover:bg-blue-600 transition-colors duration-200
                                     font-medium shadow-sm"
                        >
                            Back To Edit Itinerary
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg
                                     hover:bg-green-600 transition-colors duration-200
                                     font-medium shadow-sm"
                        >
                            Share Summary
                        </button>
                    </div>
                </div>
            </SummaryCard>
        </div>
    );
};