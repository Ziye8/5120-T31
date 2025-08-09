import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Menu, X, Home as HomeIcon, Car, Users, MapPin, TrendingUp, ArrowLeft, Info } from 'lucide-react';

// Mock data for population growth (2020-2024)
const populationData = [
  { year: '2020', population: 178000 },
  { year: '2021', population: 165000 },
  { year: '2022', population: 182000 },
  { year: '2023', population: 195000 },
  { year: '2024', population: 208000 },
];

// Key statistics data
const keyStats = [
  { 
    title: "2020 Population", 
    value: "178,000", 
    trend: "-2.5% decline", 
    trendColor: "text-red-500" 
  },
  { 
    title: "Lowest Point", 
    value: "165,000", 
    trend: "2021 pandemic low", 
    trendColor: "text-gray-500" 
  },
  { 
    title: "2024 Population", 
    value: "208,000", 
    trend: "+6.7% growth", 
    trendColor: "text-green-500" 
  },
  { 
    title: "Net Growth", 
    value: "+30,000", 
    trend: "2020-2024 total", 
    trendColor: "text-blue-500" 
  }
];

// Growth analysis data
const growthTrends = [
  {
    period: "2020-2021: Pandemic Impact",
    details: "7.3% decline due to remote work and restrictions"
  },
  {
    period: "2022: Recovery Phase",
    details: "12.1% growth as offices reopened"
  },
  {
    period: "2023-2024: Stabilized Growth",
    details: "Consistent 5-7% annual increases"
  }
];

// Congestion correlation data
const congestionData = [
  { metric: "Peak hour delays", value: "+15% since 2022" },
  { metric: "Parking demand", value: "+23% increase" },
  { metric: "Public transport usage", value: "+18% growth" }
];

const PopulationInsights: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
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
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">Population Insights</span>
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
                      className="flex items-center px-3 py-3 text-base font-medium rounded-lg bg-gray-900 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="mr-3 h-5 w-5" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Population Insights</h1>
          <p className="text-gray-600">Melbourne CBD population growth from 2020-2024 with congestion impact analysis</p>
        </div>

        {/* Chart Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Melbourne CBD Population Growth</h2>
                <p className="text-sm text-gray-500">Data sourced from ABS Regional Population statistics</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    chartType === 'line' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setChartType('line')}
                >
                  Line Chart
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    chartType === 'bar' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setChartType('bar')}
                >
                  Bar Chart
                </button>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={populationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} people`, 'Population']}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="population" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 6, strokeWidth: 2 }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={populationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} people`, 'Population']}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                      }}
                    />
                    <Bar 
                      dataKey="population" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {keyStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={`text-sm ${stat.trendColor}`}>{stat.trend}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Growth Analysis & Congestion Impact */}
        <section>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Growth Analysis & Congestion Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Population Trends */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Population Trends</h3>
                <ul className="space-y-4">
                  {growthTrends.map((trend, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full mt-0.5 mr-3">
                        {index === 0 && <div className="h-full w-full bg-red-500 rounded-full"></div>}
                        {index === 1 && <div className="h-full w-full bg-green-500 rounded-full"></div>}
                        {index === 2 && <div className="h-full w-full bg-blue-500 rounded-full"></div>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{trend.period}</p>
                        <p className="text-sm text-gray-600">{trend.details}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Congestion Correlation */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Congestion Correlation</h3>
                <ul className="space-y-3">
                  {congestionData.map((item, index) => (
                    <li key={index} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <span className="text-gray-700">{item.metric}</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
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

export default PopulationInsights;