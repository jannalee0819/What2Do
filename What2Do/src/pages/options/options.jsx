import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/Card';
import { OptionCard } from '../../components/OptionCard';

const mockData = [
    {
        activity: "eat breakfast",
        options: [
            { id: 1, text: "option 1", selected: false },
            { id: 2, text: "option 2", selected: false },
            { id: 3, text: "option 3", selected: false }
        ]
    },
    {
        activity: "touch grass",
        options: [
            { id: 1, text: "option 1", selected: false },
            { id: 2, text: "option 2", selected: false },
            { id: 3, text: "option 3", selected: false }
        ]
    },
    {
        activity: "touch grass",
        options: [
            { id: 1, text: "option 1", selected: false },
            { id: 2, text: "option 2", selected: false },
            { id: 3, text: "option 3", selected: false },
            { id: 4, text: "option 4", selected: false }
        ]
    }
];






export const OptionsPage = () => {
    const [activities, setActivities] = useState(mockData);

    const toggleOption = (activityIndex, optionIndex) => {
        const newActivities = [...activities];
        newActivities[activityIndex].options[optionIndex].selected = 
            !newActivities[activityIndex].options[optionIndex].selected;
        setActivities(newActivities);
    };

    const handleConfirm = () => {

        const selectedOptions = activities.map(activity => ({

            activity: activity.activity,

            selectedOptions: activity.options

                .filter(option => option.selected)

                .map(option => option.text)

        }));



        // Remove activities with no selections

        const validSelections = selectedOptions.filter(

            activity => activity.selectedOptions.length > 0

        );



        // Navigate to the next page with the selected options

        navigate('/map', { 

            state: { selectedOptions: validSelections }

        });

    };

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {activities.map((activity, activityIndex) => (
                <Card key={activityIndex}>
                    <div className="bg-gray-100 p-4 text-center font-medium border-b">
                        {activity.activity}
                    </div>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activity.options.map((option, optionIndex) => (
                                <OptionCard
                                    key={option.id}
                                    text={option.text}
                                    selected={option.selected}
                                    onClick={() => toggleOption(activityIndex, optionIndex)}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-center gap-4">
                <button 
                    onClick={handleCancel}
                    className="w-full md:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-lg
                             hover:bg-gray-200 transition-colors duration-200
                             font-medium border border-gray-300"
                >
                    CANCEL
                </button>
                <button 
                    onClick={handleConfirm}
                    className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg
                             hover:bg-blue-600 transition-colors duration-200
                             font-medium shadow-sm"
                >
                    GENERATE MAP
                </button>
            </div>
        </div>
    );
};
