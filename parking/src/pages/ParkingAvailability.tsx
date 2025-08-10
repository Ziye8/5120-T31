import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home as HomeIcon, Car, Users, TrendingUp, ArrowLeft, MapPin, Search, Filter, RefreshCw, Clock, DollarSign, AlertCircle } from 'lucide-react';

// Initial parking locations data (constant)
const initialParkingLocations = [
  {
    id: 1,
    name: 'Collins Street Car Park',
    address: '125 Collins Street',
    distance: '0.2 km',
    totalSpots: 120,
    price: '$8/hour',
    maxDuration: '4 hours max',
  },
  {
    id: 2,
    name: 'Bourke Street Mall Parking',
    address: '200 Bourke Street',
    distance: '0.5 km',
    totalSpots: 85,
    price: '$9/hour',
    maxDuration: '2 hours max',
  },
  {
    id: 3,
    name: 'Flinders Lane Parking Station',
    address: '150 Flinders Lane',
    distance: '0.8 km',
    totalSpots: 210,
    price: '$7/hour',
    maxDuration: 'Unlimited',
  },
  {
    id: 4,
    name: 'Queen Victoria Market Car Park',
    address: '55 Victoria Street',
    distance: '1.2 km',
    totalSpots: 500,
    price: '$5/hour',
    maxDuration: '8 hours max',
  }
];

// Function to generate random parking data
const generateRandomParkingData = () => {
  // Generate random available spots for each location (0 to totalSpots)
  const parkingLocations = initialParkingLocations.map(location => {
    const availableSpots = Math.floor(Math.random() * (location.totalSpots + 1));
    
    // Determine status and color based on availability percentage
    const availabilityPercentage = (availableSpots / location.totalSpots) * 100;
    let status, statusColor;
    
    if (availabilityPercentage > 50) {
      status = 'Available';
      statusColor = 'bg-green-100 text-green-800';
    } else if (availabilityPercentage > 10) {
      status = 'Limited';
      statusColor = 'bg-yellow-100 text-yellow-800';
    } else {
      status = 'Full';
      statusColor = 'bg-red-100 text-red-800';
    }
    
    return {
      ...location,
      availableSpots,
      status,
      statusColor,
      updated: 'Just now'
    };
  });
  
  // Calculate total available spots and occupancy rate
  const availableSpots = parkingLocations.reduce((sum, location) => sum + location.availableSpots, 0);
  const totalSpots = parkingLocations.reduce((sum, location) => sum + location.totalSpots, 0);
  const occupancyRate = Math.round(((totalSpots - availableSpots) / totalSpots) * 100);
  
  // Get current time for last updated
  const now = new Date();
  const lastUpdated = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  return {
    availableSpots,
    totalSpots,
    occupancyRate,
    lastUpdated,
    updateFrequency: 'Live updates every 30s',
    parkingLocations
  };
};

const ParkingAvailability: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [parkingData, setParkingData] = useState(generateRandomParkingData());
  
  // Function to update parking data with random values
  const updateParkingData = () => {
    setParkingData(generateRandomParkingData());
  };
  
  // Set up interval to update data every 30 seconds
  useEffect(() => {
    // Update immediately on component mount
    updateParkingData();
    
    // Set up interval for subsequent updates
    const intervalId = setInterval(updateParkingData, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl mr-3 flex items-center justify-center shadow-md">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">Parking Availability</span>
            </div>
          </div>
            <div className="flex items-center">
              <button 
                className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
          </div>
        </div>
      </header>
      
      {/* Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          {/* Sidebar Menu */}
          <div className="absolute top-0 right-0 w-full max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Navigation Menu</h2>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              {/* Menu Items */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-1">
                  <li>
                    <Link 
                      to="/" 
                      className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <HomeIcon className="mr-3 h-5 w-5 text-gray-500" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/car-ownership" 
                      className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Car className="mr-3 h-5 w-5 text-gray-500" />
                      Car Ownership Data
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/population-insights" 
                      className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="mr-3 h-5 w-5 text-gray-500" />
                      Population Insights
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/parking-availability" 
                      className="flex items-center px-3 py-3 text-base font-medium rounded-lg bg-gray-900 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MapPin className="mr-3 h-5 w-5" />
                      Parking Availability
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/historical-trends" 
                      className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <TrendingUp className="mr-3 h-5 w-5 text-gray-500" />
                      Historical Trends
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-10 px-6">
        {/* Page Title and Description */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parking Availability</h1>
          <p className="text-gray-600">Real-time parking information for Melbourne CBD</p>
        </div>

        {/* Key Metrics Cards */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available Spots */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Available Spots</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-green-600">{parkingData.availableSpots}</span>
                <span className="text-sm text-gray-500 ml-2">of {parkingData.totalSpots} total spots</span>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Occupancy Rate</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-orange-600">{parkingData.occupancyRate}%</span>
                <span className="text-sm text-gray-500 ml-2">Currently occupied</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-600">{parkingData.lastUpdated}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mb-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input
                    type="text"
                    placeholder="Search by location or address..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
            </div>
            
            <div className="flex items-center w-full md:w-auto gap-3">
              <div className="relative w-full md:w-32">
                <select className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white">
                  <option>Distance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Availability</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <button className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <Filter className="h-4 w-4 text-gray-700" />
              </button>
              
               <button 
                 className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                 onClick={updateParkingData}
               >
                 <RefreshCw className="h-4 w-4 text-gray-700" />
               </button>
            </div>
          </div>
        </section>

        {/* Parking Locations List */}
        <section>
          <div className="space-y-6">
            {(() => {
              const filteredLocations = parkingData.parkingLocations.filter(location => 
                location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                location.address.toLowerCase().includes(searchQuery.toLowerCase())
              );
              
              if (filteredLocations.length === 0 && searchQuery) {
                return (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">We couldn't find any parking locations matching "{searchQuery}"</p>
                    <button 
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </button>
                  </div>
                );
              }
              
              return filteredLocations.map((location) => (
                <div 
                  key={location.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-4 md:mb-0">
                        <h3 className="font-bold text-lg text-gray-900 mr-3">{location.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${location.statusColor}`}>
                          {location.status}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {location.address} · {location.distance}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="h-4 w-4 mr-2 text-green-500">●</span>
                        {location.availableSpots}/{location.totalSpots} spots
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        {location.price}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {location.maxDuration}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Updated {location.updated}</span>
                      <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Report issue <AlertCircle className="inline h-3 w-3 ml-1" /></span>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ParkingAvailability;