import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { fetchTripDataFromFirebase } from '../../utilities/firebaseSummaryHelper'; 

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
    const { userId, tripId } = useParams();
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUsingMockData, setIsUsingMockData] = useState(false);

    useEffect(() => {
        const loadTripData = async () => {
            setLoading(true);
            const { data, error, isUsingMockData: usingMock } = 
                await fetchTripDataFromFirebase(userId, tripId);
            
            setTripData(data || mockData);
            setIsUsingMockData(usingMock);
            setLoading(false);
        };

        loadTripData();
    }, [userId, tripId]);

    const handleAddToTrips = () => {
        navigate('/trips');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
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
                            Add to My Trips
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