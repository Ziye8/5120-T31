import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, X, Home as HomeIcon, Car, Users, MapPin, TrendingUp } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

// New API data interface (adapted to backend return format)
interface ApiCarData {
  state: string;
  yearRange: string;
  value: number;
}

// Default data (same structure, used when API is unavailable)
const defaultCarData: ApiCarData[] = [
  {"state":"NSW","yearRange":"2016-2017","value":262872},
  {"state":"Vic.","yearRange":"2016-2017","value":209495},
  {"state":"Qld","yearRange":"2016-2017","value":139062},
  {"state":"SA","yearRange":"2016-2017","value":50434},
  {"state":"WA","yearRange":"2016-2017","value":89755},
  {"state":"Tas.","yearRange":"2016-2017","value":7927},
  {"state":"NT","yearRange":"2016-2017","value":13091},
  {"state":"ACT","yearRange":"2016-2017","value":11500},
  {"state":"Aust.","yearRange":"2016-2017","value":784136},
  {"state":"NSW","yearRange":"2017-2018","value":287998},
  {"state":"Vic.","yearRange":"2017-2018","value":214408},
  {"state":"Qld","yearRange":"2017-2018","value":135935},
  {"state":"SA","yearRange":"2017-2018","value":49470},
  {"state":"WA","yearRange":"2017-2018","value":85500},
  {"state":"Tas.","yearRange":"2017-2018","value":8433},
  {"state":"NT","yearRange":"2017-2018","value":3621},
  {"state":"ACT","yearRange":"2017-2018","value":11605},
  {"state":"Aust.","yearRange":"2017-2018","value":796970}
];

// Chart data format
interface ChartData {
  year: string;
  value: number;
}

const CarOwnershipData: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [carData, setCarData] = useState<ApiCarData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [keyInsights, setKeyInsights] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalGrowth: 0,
    totalGrowthPercent: 0,
    peakYear: '',
    peakValue: 0,
    avgGrowth: 0
  });
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateData, setStateData] = useState<Record<string, ApiCarData[]>>({});

  // Utility function to sort by year range
  const sortByYearRange = (data: ApiCarData[]) => {
    return [...data].sort((a, b) => {
      const yearA = parseInt(a.yearRange.split('-')[0]);
      const yearB = parseInt(b.yearRange.split('-')[0]);
      return yearA - yearB;
    });
  };

  // Load data from API or fallback to default data
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const apiResponse = await fetch('http://127.0.0.1:8000/api/car');

        let carDataFromAPI: ApiCarData[] = [];
        if (apiResponse.ok) {
          const rawData: any[][] = await apiResponse.json();
          // Convert backend 2D array into defined interface format
          carDataFromAPI = rawData.map(item => ({
            state: item[0],
            yearRange: item[1],
            value: item[2]
          }));
        }

        const apiData = carDataFromAPI.length ? carDataFromAPI : defaultCarData;

        // Group data by state
        const groupedByState = apiData.reduce((acc, item) => {
          if (!acc[item.state]) {
            acc[item.state] = [];
          }
          acc[item.state].push(item);
          return acc;
        }, {} as Record<string, ApiCarData[]>);

        // Get all states and sort
        const allStates = Object.keys(groupedByState).sort();

        setStateData(groupedByState);
        setStates(allStates);

        // Set default selected state
        const defaultState = allStates.length > 0 ? allStates[0] : '';
        setSelectedState(defaultState);

      } catch (err) {
        setError("API unavailable. Showing default data.");
        console.error("Error fetching car data:", err);

        // Use default data when API fails
        const groupedByState = defaultCarData.reduce((acc, item) => {
          if (!acc[item.state]) {
            acc[item.state] = [];
          }
          acc[item.state].push(item);
          return acc;
        }, {} as Record<string, ApiCarData[]>);

        const allStates = Object.keys(groupedByState).sort();
        setStateData(groupedByState);
        setStates(allStates);
        const defaultState = allStates.length > 0 ? allStates[0] : '';
        setSelectedState(defaultState);

      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  // Update chart and statistics when selected state changes
  useEffect(() => {
    if (!selectedState || !stateData[selectedState] || loading) return;

    const filteredData = sortByYearRange(stateData[selectedState]);
    setCarData(filteredData);

    // Transform data for chart
    const transformedData: ChartData[] = filteredData.map(item => ({
      year: item.yearRange,
      value: item.value
    }));
    setChartData(transformedData);

    // Calculate statistics
    if (filteredData.length > 0) {
      const firstItem = filteredData[0];
      const lastItem = filteredData[filteredData.length - 1];
      const totalGrowth = lastItem.value - firstItem.value;
      const totalGrowthPercent = firstItem.value !== 0
          ? ((totalGrowth / firstItem.value) * 100).toFixed(1)
          : '0';

      const peakItem = filteredData.reduce((prev, current) =>
          prev.value > current.value ? prev : current
      );

      const periodCount = filteredData.length - 1;
      const avgGrowth = periodCount > 0
          ? Math.round(totalGrowth / periodCount)
          : 0;

      setStats({
        totalGrowth,
        totalGrowthPercent: parseFloat(totalGrowthPercent),
        peakYear: peakItem.yearRange,
        peakValue: peakItem.value,
        avgGrowth
      });

      // Generate key insights
      const insights: string[] = [];

      if (totalGrowth > 0) {
        insights.push(`Overall growth of ${totalGrowth.toLocaleString()} vehicles between ${firstItem.yearRange} and ${lastItem.yearRange}, representing a ${totalGrowthPercent}% increase.`);
      } else if (totalGrowth < 0) {
        insights.push(`Overall decline of ${Math.abs(totalGrowth).toLocaleString()} vehicles between ${firstItem.yearRange} and ${lastItem.yearRange}, representing a ${Math.abs(parseFloat(totalGrowthPercent))}% decrease.`);
      }

      if (filteredData.some(item => item.yearRange === "2019-2020" &&
          item.value < (filteredData.find(d => d.yearRange === "2018-2019")?.value || 0))) {
        insights.push("Noticeable decline in 2019-2020 period likely due to pandemic impacts and reduced mobility.");
      }

      insights.push(`Strongest period for vehicle ownership was ${peakItem.yearRange} with ${peakItem.value.toLocaleString()} registered vehicles.`);

      setKeyInsights(insights);
    }
  }, [selectedState, stateData, loading]);

  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Navbar */}
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-100 py-4 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl mr-3 flex items-center justify-center shadow-md">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 tracking-tight">Car Ownership Data</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors mr-6">Home</Link>
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
                            className="flex items-center px-3 py-3 text-base font-medium rounded-lg bg-gray-900 text-white"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          <Car className="mr-3 h-5 w-5" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Car Ownership Data</h1>
            <p className="text-gray-600">Number of cars registered by state from 2016-2021</p>

            {/* State Selector */}
            {states.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
                  <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full max-w-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
            )}
          </div>

          {/* Chart Section */}
          <section className="mb-12">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Car Registration Statistics</h2>
              <p className="text-sm text-gray-600 mb-6">Data showing the number of registered vehicles by financial year</p>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                  ) : error ? (
                      <div className="flex items-center justify-center h-full text-red-600">
                        <p>{error}</p>
                      </div>
                  ) : (
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="year"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickFormatter={(value) => value >= 1000000
                                ? `${(value / 1000000).toFixed(1)}M`
                                : value >= 1000
                                    ? `${(value / 1000).toFixed(0)}K`
                                    : value.toString()
                            }
                        />
                        <Tooltip
                            formatter={(value) => [`${value.toLocaleString()} vehicles`, 'Registered Vehicles']}
                            contentStyle={{
                              borderRadius: '12px',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Statistics Cards */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Growth */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Growth</h3>
                <p className="text-sm text-gray-600 mb-4">Across all periods</p>
                <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${stats.totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalGrowth >= 0 ? '+' : ''}{stats.totalGrowth.toLocaleString()}
                </span>
                  <span className="text-sm text-gray-500 ml-2">
                  {stats.totalGrowthPercent >= 0 ? '+' : ''}{stats.totalGrowthPercent}%
                </span>
                </div>
              </div>

              {/* Peak Period */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Peak Period</h3>
                <p className="text-sm text-gray-600 mb-4">Highest registration</p>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-600">{stats.peakYear}</span>
                  <span className="text-sm text-gray-500 mt-1">{stats.peakValue.toLocaleString()} vehicles</span>
                </div>
              </div>

              {/* Average Growth */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Average Growth</h3>
                <p className="text-sm text-gray-600 mb-4">Per period</p>
                <div className="flex items-baseline">
                <span className={`text-3xl font-bold ${stats.avgGrowth >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                  {stats.avgGrowth >= 0 ? '+' : ''}{stats.avgGrowth.toLocaleString()}
                </span>
                  <span className="text-sm text-gray-500 ml-2">vehicles</span>
                </div>
              </div>
            </div>
          </section>

          {/* Key Insights */}
          <section>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
              {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
              ) : error ? (
                  <p className="text-red-600 text-center py-8">Unable to load insights due to data error</p>
              ) : keyInsights.length > 0 ? (
                  <ul className="space-y-3">
                    {keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{insight}</p>
                        </li>
                    ))}
                  </ul>
              ) : (
                  <p className="text-gray-500 text-center py-8">No insights available</p>
              )}
            </div>
          </section>
        </main>
      </div>
  );
};

export default CarOwnershipData;