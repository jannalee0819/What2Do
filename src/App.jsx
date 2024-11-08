import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AddTrip } from "./components/AddTrip";
import { EditTrip } from "./components/EditTrip";
import { TripSummaryPage } from "./pages/genSummary/genSummary";
import LoginPage from "./pages/LoginPage/userLogin";
import { Profile } from './pages/Profile/Profile';
import { UrlUpload } from './pages/UrlUpload/UrlUpload'; // Add this import

const App = () => {
  const [trips, setTrips] = useState([]);

  const addTrip = (newTrip) => {
    setTrips((prev) => [...prev, newTrip]);
  };

  const updateTrip = (index, updatedTrip) => {
    setTrips((prev) =>
      prev.map((trip, i) => (i === index ? updatedTrip : trip))
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/add" element={<AddTrip onAddTrip={addTrip} />} />
          <Route
            path="/edit/:id"
            element={<EditTrip trips={trips} onUpdateTrip={updateTrip} />}
          />
          {/* <Route path="/itinerary" element={<TripItinerary />} /> */}
          <Route path="/summary/:id/:tripId" element={<TripSummaryPage />} />
          <Route path="/summary/:tripId" element={<TripSummaryPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<UrlUpload />} /> {/* Add this route */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;