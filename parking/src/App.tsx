import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import CarOwnershipData from "@/pages/CarOwnershipData";
import HistoricalTrends from "@/pages/HistoricalTrends";
import PopulationInsights from "@/pages/PopulationInsights";
import ParkingAvailability from "@/pages/ParkingAvailability";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-ownership" element={<CarOwnershipData />} />
        <Route path="/parking-availability" element={<ParkingAvailability />} />
        <Route path="/population-insights" element={<PopulationInsights />} />
        <Route path="/historical-trends" element={<HistoricalTrends />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </AuthContext.Provider>
  );
}