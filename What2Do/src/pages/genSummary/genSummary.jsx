import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SummaryCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
        {children}
    </div>
);

export const TripSummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tripData = location.state?.tripData || {
        // Sample data structure - replace with your actual data
        title: "Weekend in Paris",
        days: [
            {
                day: 1,
                locations: ["Eiffel Tower", "Louvre Museum"]
            },
            {
                day: 2,
                locations: ["Notre-Dame", "Seine River Cruise"]
            }
        ]
    };

    const handleAddToTrips = () => {
        // Add to user's trips logic here
        navigate('/my-trips');
    };

    const handleShare = () => {
        // Share functionality - could open a modal or copy link
        // For now, just copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    const handleBackHome = () => {
        navigate('/');
    };

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
                                        <li key={locIndex}>{location}</li>
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