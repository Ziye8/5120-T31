import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, X, Home as HomeIcon, Car, Users, ArrowLeft, Filter, MapPin, Clock, ChevronDown, TrendingUp, Search } from 'lucide-react';

// Parking location data interface
interface ParkingLocation {
    id: string; // zone id
    name: string;
}

// Hourly data interface (matches backend response format)
interface HourlyData {
    time: string; // time, e.g. "8:00"
    availability: number; // availability rate, percentage
}

// Time range type definition
interface TimeRange {
    label: string;
    startHour: number;
    endHour: number;
}

// Define all time range options (including start and end hours)
const timeRangeOptions: TimeRange[] = [
    { label: '8 AM - 10 AM', startHour: 8, endHour: 10 },
    { label: '10 AM - 12 PM', startHour: 10, endHour: 12 },
    { label: '12 PM - 2 PM', startHour: 12, endHour: 14 },
    { label: '2 PM - 4 PM', startHour: 14, endHour: 16 },
    { label: '4 PM - 6 PM', startHour: 16, endHour: 18 },
    { label: '6 PM - 8 PM', startHour: 18, endHour: 20 },
];

// Default hourly data (used when API is unavailable)
const defaultHourlyData: HourlyData[] = [
    { time: '6:00', availability: 85 },
    { time: '7:00', availability: 65 },
    { time: '8:00', availability: 40 },
    { time: '9:00', availability: 85 },
    { time: '10:00', availability: 75 },
    { time: '11:00', availability: 60 },
    { time: '12:00', availability: 45 },
    { time: '13:00', availability: 55 },
    { time: '14:00', availability: 45 },
    { time: '15:00', availability: 50 },
    { time: '16:00', availability: 35 },
    { time: '17:00', availability: 10 },
    { time: '18:00', availability: 20 },
    { time: '19:00', availability: 30 },
    { time: '20:00', availability: 60 },
    { time: '21:00', availability: 80 },
];

const HistoricalTrends: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedTimeRangeLabel, setSelectedTimeRangeLabel] = useState(timeRangeOptions[0].label);
    const [locationId, setLocationId] = useState<string>('');
    const [locationName, setLocationName] = useState<string>('');
    const [parkingLocations, setParkingLocations] = useState<ParkingLocation[]>([]);
    const [chartData, setChartData] = useState<HourlyData[]>(defaultHourlyData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [activeTab, setActiveTab] = useState('hourly');

    // Fetch parking locations data
    useEffect(() => {
        const fetchParkingLocations = async () => {
            setLoadingLocations(true);
            try {
                // Call backend to get parking locations list
                const response = await fetch('http://54.227.183.166:8000/api/park');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ParkingLocation[] = await response.json();
                setParkingLocations(data);

                // Set default selected location
                if (data.length > 0) {
                    setLocationId(data[0].id);
                    setLocationName(data[0].name);
                }
            } catch (err) {
                console.error('Failed to fetch parking locations:', err);
                setError('Failed to load parking locations, using default data');
                // Default location data
                const defaultLocations: ParkingLocation[] = [
                    { id: '7028', name: 'Cardigan Street' },
                    { id: '7047', name: 'Grattan Street' },
                    { id: '7104', name: 'Queensberry Street' },
                ];
                setParkingLocations(defaultLocations);
                setLocationId(defaultLocations[0].id);
                setLocationName(defaultLocations[0].name);
            } finally {
                setLoadingLocations(false);
            }
        };

        fetchParkingLocations();
    }, []);

    // Convert time range to timestamps (for the current day)
    const getTimeRangeTimestamps = (): { start: number, end: number } => {
        // Find the selected time range configuration
        const selectedRange = timeRangeOptions.find(
            range => range.label === selectedTimeRangeLabel
        );

        if (!selectedRange) {
            // Default to 8-10 AM if not found
            return { start: 8 * 3600 * 1000, end: 10 * 3600 * 1000 };
        }

        // Create date object for today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to midnight

        // Calculate start and end timestamps (in milliseconds)
        const startTimestamp = today.getTime() + selectedRange.startHour * 3600 * 1000;
        const endTimestamp = today.getTime() + selectedRange.endHour * 3600 * 1000;

        return { start: startTimestamp, end: endTimestamp };
    };

    // Fetch historical data
    const fetchHistoricalData = async () => {
        if (!locationId) {
            setError('Please select a parking location');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Get time range timestamps
            const { start: startTimestamp, end: endTimestamp } = getTimeRangeTimestamps();

            // Build request parameters
            const params = new URLSearchParams();
            params.append('startTimestamp', startTimestamp.toString()); // Start timestamp
            params.append('endTimestamp', endTimestamp.toString());     // End timestamp
            params.append('locationId', locationId);                     // Parking zone id

            // Call backend historical data API
            const response = await fetch(`http://54.227.183.166:8000/api/history?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch historical data, status code: ${response.status}`);
            }

            // Parse hourly data from backend response
            const data: HourlyData[] = await response.json();

            // Validate data format
            if (Array.isArray(data) && data.every(item =>
                typeof item.time === 'string' && typeof item.availability === 'number'
            )) {
                setChartData(data);
            } else {
                throw new Error('Backend returned data in incorrect format');
            }
        } catch (err) {
            console.error('Failed to fetch historical data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch historical data');
            // Keep default data
            setChartData(defaultHourlyData);
        } finally {
            setLoading(false);
        }
    };

    // Parking recommendations data
    const recommendations = {
        optimalTimes: [
            { time: 'Early Morning (7-9 AM)', availability: 'High Availability', color: 'bg-green-100 text-green-800' },
            { time: 'Late Morning (10-12 PM)', availability: 'Moderate Availability', color: 'bg-yellow-100 text-yellow-800' },
            { time: 'Rush Hours (5-7 PM)', availability: 'Low Availability', color: 'bg-red-100 text-red-800' },
        ],
        alternativeStrategies: [
            'Consider weekend travel for better availability (75% vs 45% average)',
            'Southern Cross Station offers consistent availability throughout the day',
            'Book in advance during peak hours or consider public transport alternatives'
        ]
    };

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
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-lg text-gray-900 tracking-tight">Historical Parking Trends</span>
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
                    <div
                        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>

                    <div className="absolute top-0 right-0 w-full max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">Navigation Menu</h2>
                                <button
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

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
                                            className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                                            Parking Availability
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/historical-trends"
                                            className="flex items-center px-3 py-3 text-base font-medium rounded-lg bg-gray-900 text-white"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <TrendingUp className="mr-3 h-5 w-5" />
                                            Historical Trends
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto py-10 px-6">
                {/* Page Title and Description */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Historical Parking Trends</h1>
                    <p className="text-gray-600">Analyze historical parking availability patterns to plan your optimal arrival time</p>
                </div>

                {/* Filter Section */}
                <section className="mb-10">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center mb-4">
                            <Filter className="h-5 w-5 text-blue-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-900">Trend Analysis Filters</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">Select time period and parking location to view historical trend data</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Time Range Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <select
                                        className="w-full appearance-none pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                                        value={selectedTimeRangeLabel}
                                        onChange={(e) => setSelectedTimeRangeLabel(e.target.value)}
                                    >
                                        {timeRangeOptions.map(range => (
                                            <option key={range.label} value={range.label}>
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Parking Location Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Parking Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <select
                                        className="w-full appearance-none pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                                        value={locationName}
                                        onChange={(e) => {
                                            const selectedName = e.target.value;
                                            const selectedLoc = parkingLocations.find(loc => loc.name === selectedName);
                                            if (selectedLoc) {
                                                setLocationId(selectedLoc.id);
                                                setLocationName(selectedLoc.name);
                                            }
                                        }}
                                        disabled={loadingLocations}
                                    >
                                        {loadingLocations ? (
                                            <option>Loading locations...</option>
                                        ) : (
                                            parkingLocations.map(loc => (
                                                <option key={loc.id} value={loc.name}>
                                                    {loc.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fetch Data Button */}
                    <div className="mt-6">
                        <button
                            id="fetch-data-btn"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                            onClick={fetchHistoricalData}
                            disabled={loading || loadingLocations}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4 mr-2" />
                                    Fetch Historical Data
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* Trend Chart Area */}
                <section className="mb-10">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            <button
                                className={`px-6 py-4 font-medium text-sm focus:outline-none transition-colors ${
                                    activeTab === 'hourly'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                                }`}
                                onClick={() => setActiveTab('hourly')}
                            >
                                Hourly Trends
                            </button>
                        </div>

                        {/* Hourly Trend Chart */}
                        {activeTab === 'hourly' && (
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hourly Availability Patterns</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Average parking availability percentage for {locationName} - {selectedTimeRangeLabel}
                                </p>

                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {loading ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                            </div>
                                        ) : error ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center p-6">
                                                    <p className="text-red-600 mb-2">{error}</p>
                                                    <p className="text-gray-500 text-sm">Displaying default data</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <defs>
                                                    <linearGradient id="colorAvailability" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="time"
                                                    tick={{ fontSize: 12 }}
                                                    tickLine={false}
                                                    axisLine={{ stroke: '#e0e0e0' }}
                                                    label={{ value: 'Time', position: 'bottom', offset: 10 }}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 12 }}
                                                    tickLine={false}
                                                    axisLine={{ stroke: '#e0e0e0' }}
                                                    domain={[0, 100]}
                                                    tickFormatter={(value) => `${value}%`}
                                                    label={{ value: 'Availability', angle: -90, position: 'left', offset: -10 }}
                                                />
                                                <Tooltip
                                                    formatter={(value) => [`${value}%`, 'Availability']}
                                                    contentStyle={{
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    labelStyle={{ fontWeight: 'bold' }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="availability"
                                                    stroke="#3b82f6"
                                                    fillOpacity={1}
                                                    fill="url(#colorAvailability)"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Key Metrics Cards */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Best Time (Weekday)</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-green-600">9 AM</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">85% availability</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Worst Time (Weekday)</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-red-600">5 PM</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">10% availability</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Weekend Peak</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-blue-600">2 PM</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">45% availability</p>
                        </div>
                    </div>
                </section>

                {/* Parking Recommendations */}
                <section>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Smart Parking Recommendations</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-base font-medium text-gray-900 mb-4">Optimal Arrival Times</h3>
                                <div className="space-y-3">
                                    {recommendations.optimalTimes.map((time, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                                            <span className="font-medium text-gray-900">{time.time}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${time.color}`}>
                                                {time.availability}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-medium text-gray-900 mb-4">Alternative Strategies</h3>
                                <ul className="space-y-3">
                                    {recommendations.alternativeStrategies.map((strategy, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-xs font-medium text-blue-600">•</span>
                                            </div>
                                            <p className="text-gray-700">{strategy}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HistoricalTrends;
