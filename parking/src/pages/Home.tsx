import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car, Users, MapPin, TrendingUp, ChevronRight, Home as HomeIcon } from 'lucide-react';

// Mock data for insights cards
const insightsData = [
  {
    id: 1,
    title: "Car Ownership Data",
    description: "View car ownership statistics and registration data",
    icon: <Car className="h-5 w-5 text-gray-700" />
  },
  {
    id: 2,
    title: "Population Insights",
    description: "Explore Melbourne CBD population growth trends",
    icon: <Users className="h-5 w-5 text-gray-700" />
  },
  {
    id: 3,
    title: "Parking Availability",
    description: "Find available parking spots in real-time",
    icon: <MapPin className="h-5 w-5 text-gray-700" />
  },
  {
    id: 4,
    title: "Historical Trends",
    description: "Analyze historical parking availability patterns",
    icon: <TrendingUp className="h-5 w-5 text-gray-700" />
  }
];

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl mr-3 flex items-center justify-center shadow-md">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Melbourne%20city%20logo%20simple%20icon%20white%20on%20blue%20background&sign=f8ef25ae813bfc3a69cac213244816a0" 
                alt="Melbourne Insights Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Melbourne Insights</span>
          </div>
           <button 
             className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300"
             onClick={() => setIsMenuOpen(true)}
           >
             <Menu className="h-5 w-5 text-gray-700" />
           </button>
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
                       className="flex items-center px-3 py-3 text-base font-medium rounded-lg bg-gray-900 text-white"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       <HomeIcon className="mr-3 h-5 w-5" />
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
                       to="#" 
                       className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100 cursor-not-allowed"
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

      {/* Header Introduction */}
      <div className="max-w-4xl mx-auto py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4"></div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative z-10 leading-tight">
          Melbourne Transport & Parking Insights
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto relative z-10">
          Comprehensive data insights for Melbourne's transportation, population growth, and parking patterns from 2020-2024.
        </p>
      </div>

      {/* Data Insights Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {insightsData.map((item) => {
              if (item.id === 1) {
                return (
                  <Link 
                    to="/car-ownership" 
                    key={item.id}
                    className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer group hover:border-blue-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                      <h2 className="font-bold text-xl text-gray-900">{item.title}</h2>
                    </div>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>View Details</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                );
              } else if (item.id === 3) {
                return (
                  <Link 
                    to="/parking-availability" 
                    key={item.id}
                    className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer group hover:border-blue-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                      <h2 className="font-bold text-xl text-gray-900">{item.title}</h2>
                    </div>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>View Details</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                );
              } else if (item.id === 4) {
                return (
                  <Link 
                    to="/historical-trends" 
                    key={item.id}
                    className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer group hover:border-blue-200"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                      <h2 className="font-bold text-xl text-gray-900">{item.title}</h2>
                    </div>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>View Details</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                );
              } else {
                return (
                   <Link 
                     to="/population-insights" 
                     key={item.id}
                     className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer group hover:border-blue-200"
                   >
                     <div className="flex items-center mb-4">
                       <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                         {item.icon}
                       </div>
                       <h2 className="font-bold text-xl text-gray-900">{item.title}</h2>
                     </div>
                     <p className="text-gray-600">
                       {item.description}
                     </p>
                     <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <span>View Details</span>
                       <ChevronRight className="ml-1 h-4 w-4" />
                     </div>
                   </Link>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default Home;