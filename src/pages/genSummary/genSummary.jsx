import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from '../../utilities/firebase_helper';
import { getTrip } from '../../utilities/fetchProfileData';
import {updateTripInFirebase} from '../../utilities/firebaseSummaryHelper';

const SummaryCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
        {children}
    </div>
);

export const TripSummaryPage = ({ isRec }) => {
    const navigate = useNavigate();
    const params = useParams();
    const [user] = useAuthState();
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);

    const loadTripData = async () => {
        try {
            setLoading(true);
            let data;

            if (isRec) {
                // For recommended trips, use "recommended" as userId
                data = await getTrip("recommendations", params.tripId);
            } else {
                // For regular trips, determine the correct userId
                const effectiveUserId = params.id || user?.uid;
                const effectiveTripId = params.tripId || params.id;

                if (!effectiveUserId || !effectiveTripId) {
                    console.error('Missing required IDs');
                    setLoading(false);
                    return;
                }

                data = await getTrip(effectiveUserId, effectiveTripId);
            }

            setTripData(data);
            setEditedData(data);
        } catch (error) {
            console.error("Error loading trip data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTripData();
    }, [params, user, isRec]);

    const handleSave = async () => {
        try {
            const userId = params.id || user?.uid;
            const tripId = params.tripId || params.id;
            
            await updateTripInFirebase(userId, tripId, editedData);
            setIsEditing(false);
            await loadTripData();
        } catch (error) {
            console.error("Error saving changes:", error);
            alert('Failed to save changes');
        }
    };

    const handleCancel = () => {
        setEditedData(tripData);
        setIsEditing(false);
    };

    const handleLocationChange = (dayIndex, locationIndex, field, value) => {
        setEditedData(prev => {
            const newData = { ...prev };
            const locationKey = Object.keys(newData.locations).find(key => 
                newData.locations[key].day === dayIndex && 
                locationIndex === Object.values(newData.locations)
                    .filter(loc => loc.day === dayIndex)
                    .indexOf(newData.locations[key])
            );
            
            if (locationKey) {
                newData.locations[locationKey][field] = value;
            }
            return newData;
        });
    };

    const handleShare = () => {
        const baseUrl = window.location.origin;
        let shareUrl;

        if (isRec) {
            shareUrl = `${baseUrl}/summary/${params.tripId}`;
        } else {
            const effectiveUserId = params.id || user?.uid;
            const effectiveTripId = params.tripId || params.id;
            shareUrl = `${baseUrl}/summary/${effectiveUserId}/${effectiveTripId}`;
        }
        
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    };

    const groupLocationsByDay = (locations) => {
        const groupedByDay = {};
        Object.entries(locations || {}).forEach(([key, location]) => {
            const day = location.day;
            if (!groupedByDay[day]) {
                groupedByDay[day] = [];
            }
            groupedByDay[day].push(location);
        });
        return Object.entries(groupedByDay).sort(([a], [b]) => Number(a) - Number(b));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading trip details...</div>
            </div>
        );
    }

    if (!tripData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Trip not found</div>
            </div>
        );
    }
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <SummaryCard>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="border-b pb-4">
                        <h1 className="text-2xl font-bold text-center">{editedData?.tripName}</h1>
                    </div>

                    {/* Itinerary Summary */}
                    <div className="space-y-4">
                        {editedData && groupLocationsByDay(editedData.locations).map(([day, locations]) => (
                            <div key={day} className="border-b last:border-0 pb-4">
                                <h2 className="font-semibold text-lg mb-2">Day {day}</h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    {locations.map((location, locIndex) => (
                                        <li key={locIndex} className="space-y-1">
                                            {isEditing ? (
                                                <div className="ml-4 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={location.destination}
                                                        onChange={(e) => handleLocationChange(location.day, locIndex, 'destination', e.target.value)}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                    <textarea
                                                        value={location.description}
                                                        onChange={(e) => handleLocationChange(location.day, locIndex, 'description', e.target.value)}
                                                        className="w-full p-2 border rounded"
                                                        rows="2"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="font-medium text-gray-800">
                                                        {location.destination}
                                                    </span>
                                                    <p className="ml-6 text-gray-600">
                                                        {location.description}
                                                    </p>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg
                                             hover:bg-gray-200 transition-colors duration-200
                                             font-medium border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg
                                             hover:bg-green-600 transition-colors duration-200
                                             font-medium shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg
                                             hover:bg-gray-200 transition-colors duration-200
                                             font-medium border border-gray-300"
                                >
                                    Back to Home
                                </button>
                                {!isRec && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-lg
                                                 hover:bg-blue-600 transition-colors duration-200
                                                 font-medium shadow-sm"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg
                                             hover:bg-green-600 transition-colors duration-200
                                             font-medium shadow-sm"
                                >
                                    Share Summary
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </SummaryCard>
        </div>
    );
};

export default TripSummaryPage;