import React from 'react';
import { 
  Search01Icon, 
  Location01Icon, 
  ShoppingCart01Icon, 
  ArrowDown01Icon,
  FilterIcon,
  Store01Icon,
  Coffee01Icon,
  AppleIcon,
  Clock01Icon,
  FireIcon
} from 'hugeicons-react';

// --- Dummy Data ---
const dummyListings = [
  { id: 1, title: 'Jollof Rice + Chicken', originalPrice: 2000, price: 500, time: '-45 mins', claims: '2/6 claims', distance: '0.8 km away', status: 'active', img: '/assets/food-1.jpg' },
  { id: 2, title: 'Burger & Fries Combo', originalPrice: 3500, price: 1500, time: '-30 mins', claims: '1/4 claims', distance: '1.2 km away', status: 'active', img: '/assets/food-2.jpg' },
  { id: 3, title: 'Spicy Pasta', originalPrice: 2500, price: 800, time: '-15 mins', claims: 'Claimed (1)', distance: '0.5 km away', status: 'claimed', img: '/assets/food-3.jpg' },
  { id: 4, title: 'Assorted Meat Pepper Soup', originalPrice: 4000, price: 1000, time: 'Expired', claims: 'Claimed (1)', distance: '2.0 km away', status: 'expired', img: '/assets/food-4.jpg' },
];

const categories = [
  { name: 'Browse All', icon: null, active: true },
  { name: 'Restaurant', icon: <Store01Icon size={16} /> },
  { name: 'Cafe', icon: <Coffee01Icon size={16} /> },
  { name: 'Pastry shop', icon: null },
  { name: 'Beverage shop', icon: null },
  { name: 'Fruit & veg. store', icon: <AppleIcon size={16} /> },
  { name: 'Pet store', icon: null },
  { name: 'Other', icon: null },
];

const IndividualDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans">
      
      {/* TEMPORARY APP NAVBAR 
        Extract this into an IndividualLayout later! 
      */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          {/* Logo & Location */}
          <div className="flex items-center gap-8">
            <img src="/images/homepage/logo.svg" alt="FoodBridge" className="h-8" />
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Location01Icon size={20} />
              <span className="text-sm font-medium">Ilorin, Kwara</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center w-full h-12 rounded-full bg-gray-50 border border-gray-100 px-4 focus-within:ring-2 focus-within:ring-green-500 focus-within:bg-white transition-all">
              <Search01Icon size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search food..." 
                className="w-full bg-transparent border-none focus:outline-none px-3 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Profile & Cart */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-700 hover:text-green-600 transition-colors">
              <ShoppingCart01Icon size={24} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button className="flex items-center gap-2 bg-[#0A2521] text-white pl-1 pr-4 py-1 rounded-full hover:bg-black transition-colors">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {/* User Avatar Image Placeholder */}
                <span className="text-xs text-gray-600">A</span>
              </div>
              <span className="text-sm font-medium">Hi Abdul 👋</span>
              <ArrowDown01Icon size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        
        {/* Top Filters & Categories */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10">
          {/* Primary Categories (Scrollable horizontally on smaller screens) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-4 border-b border-gray-50 scrollbar-hide">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  cat.active 
                    ? 'bg-[#EAF3EC] text-[#3CB371] border border-[#3CB371]' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50">
                <FilterIcon size={16} /> Filter
              </button>
              {['Price', 'Distance', 'Food Type', 'Ratings'].map((filter) => (
                <button key={filter} className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50">
                  {filter} <ArrowDown01Icon size={16} />
                </button>
              ))}
            </div>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Reset
            </button>
          </div>
        </div>

        {/* Almost Gone Section (Horizontal Scroll) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FireIcon className="text-orange-500 fill-orange-500" size={24} />
            <h2 className="text-2xl font-semibold text-gray-900">Almost gone</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {dummyListings.map((item) => (
              <div key={`almost-${item.id}`} className="min-w-[300px] md:min-w-[340px] snap-start">
                <FoodCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Available Near You Section (Grid) */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Near You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {dummyListings.map((item) => (
              <FoodCard key={`near-${item.id}`} item={item} />
            ))}
            {dummyListings.map((item) => (
              <FoodCard key={`near-2-${item.id}`} item={item} />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

/* Reusable Food Card Component 
  Moves to src/components/cards/FoodCard.tsx later 
*/
const FoodCard = ({ item }: { item: (typeof dummyListings)[number] }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {/* Make sure to add actual images to your assets folder */}
        <img 
          src={item.img} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Food+Image' }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h3>
            <p className="text-gray-400 line-through text-sm">₦{item.originalPrice}</p>
          </div>
          <span className="font-bold text-xl text-gray-900">₦{item.price}</span>
        </div>

        {/* Metrics/Badges at the bottom */}
        <div className="mt-auto flex items-center justify-between text-xs font-medium border-t border-gray-50 pt-4">
          {/* Time Badge */}
          <div className="flex items-center gap-1 text-gray-500">
            <Clock01Icon size={14} className={item.status === 'expired' ? 'text-red-500' : ''} />
            <span className={item.status === 'expired' ? 'text-red-500' : ''}>{item.time}</span>
          </div>
          
          {/* Claims Badge */}
          <div className={`flex items-center gap-1 ${item.status === 'active' ? 'text-[#3CB371]' : 'text-gray-500'}`}>
            <span className={item.status === 'active' ? 'bg-green-100 p-0.5 rounded-full' : ''}>
              {/* Optional tiny leaf/user icon could go here */}
            </span>
            <span>{item.claims}</span>
          </div>

          {/* Distance Badge */}
          <div className="flex items-center gap-1 text-gray-500">
            <Location01Icon size={14} />
            <span>{item.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualDashboardPage;