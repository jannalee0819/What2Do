import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TripList } from "./components/TripList";
import { AddTrip } from "./components/AddTrip";
import { EditTrip } from "./components/EditTrip";
import { MapView } from "./components/MapView";

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
          <Route path="/" element={<TripList trips={trips} />} />
          <Route path="/add" element={<AddTrip onAddTrip={addTrip} />} />
          <Route
            path="/edit/:id"
            element={<EditTrip trips={trips} onUpdateTrip={updateTrip} />}
          />
          <Route path="/map/:id" element={<MapView trips={trips} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
