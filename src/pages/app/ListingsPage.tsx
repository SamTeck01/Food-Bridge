import {
  ChevronDown,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  Utensils,
  X,
  Tag,
  Sparkles,
  Star,
  RotateCcw,
  ShoppingBasket,
  Leaf,
  Coffee,
  Cookie,
  ShoppingBag,
  Apple,
  Bone,
  Plus
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import FoodCard from '../../components/FoodCard';
import type { Listing } from '../../services/listings.service';
import { getListings } from '../../services/listings.service';
import { getUserOrders, type Order } from '../../services/orders.service';
import { useApp } from '../../context/AppContext';

// Pseudo-random distance generator to align visual cards with Figma specs
const getListingDistance = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const distances = ['0.5 km away', '0.8 km away', '1.2 km away', '1.5 km away', '2.0 km away'];
  return distances[hash % distances.length];
};

const CATEGORIES = [
  { name: 'Browse All', icon: Utensils },
  { name: 'Restaurant', icon: Leaf },
  { name: 'Cafe', icon: Coffee },
  { name: 'Pastry shop', icon: Cookie },
  { name: 'Beverage shop', icon: ShoppingBag },
  { name: 'Fruit & veg. store', icon: Apple },
  { name: 'Pet store', icon: Bone },
  { name: 'Natural food', icon: Sparkles },
  { name: 'Swallow', icon: Utensils },
  { name: 'Other', icon: Plus }
];

const matchCategory = (listingCat: string, activeCat: string) => {
  if (activeCat === 'Browse All') return true;
  const l = (listingCat || '').toLowerCase();
  const a = activeCat.toLowerCase();
  if (a.includes('swallow')) return l.includes('swallow') || l.includes('eba') || l.includes('amala') || l.includes('yam') || l.includes('semo') || l.includes('fufu');
  if (a.includes('restaurant')) return l.includes('rice') || l.includes('stew') || l.includes('soup') || l.includes('swallow');
  if (a.includes('cafe') || a.includes('beverage')) return l.includes('drink') || l.includes('beverage') || l.includes('coffee');
  if (a.includes('pastry') || a.includes('bakery')) return l.includes('pastries') || l.includes('snacks') || l.includes('cake');
  return l.includes(a);
};

const ListingsPage = () => {
  const { user, isLoggedIn, toggleSave, isSaved } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Browse All');
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Drawer Claim states
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const isDrawerOpen = searchParams.get('drawer') === 'orders';
  const searchQuery = searchParams.get('q') ?? '';

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getListings(50);
      setListings(data);
    } catch {
      setError('Could not load listings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Fetch claimed user orders for the right-side drawer
  useEffect(() => {
    if (isDrawerOpen && isLoggedIn && user) {
      setOrdersLoading(true);
      getUserOrders(user.id)
        .then((data) => setUserOrders(data))
        .catch((e) => console.error('Error fetching user claims:', e))
        .finally(() => setOrdersLoading(false));
    }
  }, [isDrawerOpen, isLoggedIn, user]);

  const closeDrawer = () => {
    setSearchParams((prev) => {
      prev.delete('drawer');
      return prev;
    }, { replace: true });
  };

  const handleReset = () => {
    setActiveCategory('Browse All');
    setMaxPrice(5000);
    setSearchParams((prev) => {
      prev.delete('q');
      prev.delete('drawer');
      return prev;
    }, { replace: true });
  };

  // Client-side filtering
  const filtered = listings.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.vendorName.toLowerCase().includes(q);
    const matchPrice = l.discountedPrice <= maxPrice;
    const matchCat = matchCategory(l.status === 'active' ? (l.pickupTime || '') : '', activeCategory) || matchCategory(l.name, activeCategory) || matchCategory(l.description, activeCategory);
    return matchSearch && matchPrice && matchCat;
  });

  // Section 1: Almost Gone (more than 50% claimed, not sold out)
  const almostGoneListings = filtered.filter((l) => {
    const total = l.quantity + l.claimsUsed;
    return l.claimsUsed / total > 0.4 && l.claimsUsed < total;
  });

  // Fallback to regular items if no strict almost-gone matches
  const almostGone = almostGoneListings.length > 0 ? almostGoneListings : filtered.slice(0, 3);
  // Remaining active items
  const availableNearYou = filtered.filter(l => !almostGone.some(ag => ag.$id === l.$id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] pb-24 md:pb-12 relative overflow-x-hidden">
      {/* Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black z-[90] cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-[532px] bg-[#F9F9F9] border-l border-black/10 shadow-2xl z-[100] flex flex-col p-8 overflow-y-auto select-none"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-black/10">
                <div className="flex items-center gap-[16px]">
                  <div className="w-[40px] h-[48px] bg-[#7AD371] rounded-xl flex items-center justify-center text-[#0F3934]">
                    <ShoppingBasket size={24} />
                  </div>
                  <h2 className="font-questrial text-[24px] font-normal leading-[130%] text-[#0A2623]">
                    Your Orders
                  </h2>
                </div>
                <button onClick={closeDrawer} className="text-[#0A2623]/70 hover:text-[#0A2623] p-1.5 cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Content */}
              {ordersLoading ? (
                <div className="flex flex-col gap-6 py-12 items-center justify-center flex-1">
                  <div className="w-10 h-10 border-4 border-[#7AD371] border-t-transparent rounded-full animate-spin" />
                  <p className="font-questrial text-sm text-[#0A2623]/70">Loading orders...</p>
                </div>
              ) : !isLoggedIn ? (
                <div className="flex flex-col gap-4 py-20 items-center justify-center text-center flex-1">
                  <span className="text-4xl">🔐</span>
                  <p className="font-questrial text-lg text-[#0A2623] font-medium">Please sign in</p>
                  <p className="font-questrial text-sm text-[#0A2623]/70 max-w-[300px]">
                    You must be logged in to view your claims drawer.
                  </p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="flex flex-col gap-4 py-20 items-center justify-center text-center flex-1">
                  <span className="text-4xl">🍽️</span>
                  <p className="font-questrial text-lg text-[#0A2623] font-medium">No claims yet</p>
                  <p className="font-questrial text-sm text-[#0A2623]/70 max-w-[300px]">
                    Explore available surplus foods near you and claim one to prevent waste!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 py-6 overflow-y-auto flex-1">
                  {userOrders.map((order, i) => {
                    const isCompleted = order.status === 'completed';
                    const isExpired = order.status === 'expired' || order.status === 'cancelled';

                    return (
                      <div 
                        key={order.$id} 
                        onClick={() => { closeDrawer(); navigate(`/orders/${order.$id}`); }}
                        className="flex flex-col gap-4 group cursor-pointer hover:bg-black/5 p-2.5 rounded-2xl transition-all"
                      >
                        {i > 0 && <div className="h-[1px] bg-black/10 w-full mb-2 group-hover:bg-transparent" />}
                        <div className="flex items-center gap-[24px]">
                          <div className="w-[118px] h-[78px] rounded-lg overflow-hidden bg-[#F9F9F9] flex-shrink-0 flex items-center justify-center">
                            {order.listingImageUrl ? (
                              <img
                                src={order.listingImageUrl}
                                alt={order.listingName}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-3xl">🍽️</span>
                            )}
                          </div>
                          <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                            <h4 className="font-questrial text-[16px] font-normal leading-[130%] text-[#0A2623] truncate group-hover:underline">
                              {order.listingName}
                            </h4>
                            <div className="flex items-center gap-[12px]">
                              <span className="font-questrial text-[16px] leading-[130%] text-[#0A2623]/30 line-through">
                                ₦{order.originalTotal.toLocaleString()}
                              </span>
                              <span className="font-questrial text-[16px] leading-[130%] text-[#0A2623] font-semibold">
                                ₦{order.totalPaid.toLocaleString()}
                              </span>
                            </div>
                            <span className={`font-questrial text-[14px] leading-[130%] font-medium ${
                              isCompleted ? 'text-[#28A745]' : isExpired ? 'text-[#EF4444]' : 'text-amber-600'
                            }`}>
                              {isCompleted ? 'Picked up' : isExpired ? 'Missed Order' : 'In progress'}
                            </span>
                          </div>
                        </div>

                        {/* Mini timeline progress tracker matching node 183-1566 */}
                        {!isExpired && (
                          <div className="pl-[142px] flex flex-col gap-2 relative">
                            {/* Left timeline bar */}
                            <div className="absolute left-[145px] top-[6px] bottom-[6px] w-[1px] bg-black/10" />

                            <div className="flex items-center gap-2.5 relative">
                              <div className="w-[7px] h-[7px] rounded-full bg-[#0A2623] z-10" />
                              <span className="font-questrial text-xs text-[#0A2623] font-normal">Claimed</span>
                            </div>
                            <div className="flex items-center gap-2.5 relative">
                              <div className={`w-[7px] h-[7px] rounded-full z-10 ${order.status === 'confirmed' || isCompleted ? 'bg-[#0A2623]' : 'bg-neutral-300'}`} />
                              <span className={`font-questrial text-xs ${order.status === 'confirmed' || isCompleted ? 'text-[#0A2623] font-medium' : 'text-[#0A2623]/40'}`}>
                                Confirmed
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 relative">
                              <div className={`w-[7px] h-[7px] rounded-full z-10 ${isCompleted ? 'bg-[#28A745]' : 'bg-neutral-300'}`} />
                              <span className={`font-questrial text-xs ${isCompleted ? 'text-[#28A745] font-medium' : 'text-[#0A2623]/40'}`}>
                                Completed
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 md:py-[40px] py-6 md:px-[6.25rem] px-4">
        <div className="max-w-[77.5rem] mx-auto flex flex-col gap-8">

          {/* ── Filter & Categories Container ──────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Category Pills (Row 1) */}
            <div className="flex gap-[12px] overflow-x-auto pb-[5px] scrollbar-none select-none" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-[12px] h-[40px] px-[18px] rounded-full border border-black/10 transition-all font-questrial text-[16px] font-normal cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#7AD371] text-[#0A2623] font-medium border-[#7AD371]'
                        : 'bg-white text-[#0A2623] hover:border-[#7AD371]'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Horizontal Filters Bar (Row 2) */}
            <div className="flex items-center justify-between gap-[12px] w-full overflow-hidden">
              <div className="flex items-center gap-[12px] overflow-x-auto pb-[5px] scrollbar-none select-none flex-1" style={{ scrollbarWidth: 'none' }}>
                {/* Sliders Filter Pill */}
                <button className="flex h-[40px] px-[18px] justify-center items-center gap-[12px] rounded-full border border-black/10 bg-white font-questrial text-[14px] text-[#0A2623] cursor-pointer hover:border-[#7AD371] flex-shrink-0">
                  <SlidersHorizontal size={16} strokeWidth={1.5} />
                  <span>Filter</span>
                  <X size={16} strokeWidth={1.5} className="text-[#0A2623]/30" />
                </button>

                {/* Price range selector Pill */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                    className={`flex h-[40px] px-[18px] justify-center items-center gap-[12px] rounded-full border border-black/10 bg-white font-questrial text-[14px] text-[#0A2623] cursor-pointer hover:border-[#7AD371] ${
                      maxPrice < 5000 ? 'border-brand-primary bg-[#7AD371]/10' : ''
                    }`}
                  >
                    <Tag size={16} strokeWidth={1.5} />
                    <span>Price {maxPrice < 5000 ? `(≤ ₦${maxPrice})` : ''}</span>
                    <ChevronDown size={16} strokeWidth={1.5} />
                  </button>
                  {showPriceDropdown && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowPriceDropdown(false)} />
                      <div
                        className="absolute left-0 mt-2 p-4 bg-white border border-border shadow-xl rounded-2xl z-30 w-[260px] flex flex-col gap-2 animate-scale-in"
                        style={{ boxShadow: '0 10px 30px rgba(10,38,35,0.08)' }}
                      >
                        <div className="flex justify-between items-center text-sm font-questrial mb-1">
                          <span className="text-[#0A2623]/70">Max Price:</span>
                          <span className="font-semibold text-brand-secondary">₦{maxPrice.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={5000}
                          step={100}
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full accent-[#0A2623] cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-text-muted font-questrial">
                          <span>₦100</span>
                          <span>₦5,000</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Distance Filter Pill */}
                <button className="flex h-[40px] px-[18px] justify-center items-center gap-[12px] rounded-full border border-black/10 bg-white font-questrial text-[14px] text-[#0A2623] cursor-pointer hover:border-[#7AD371] flex-shrink-0">
                  <MapPin size={16} strokeWidth={1.5} className="text-[#EF4444]" />
                  <span>Distance</span>
                  <ChevronDown size={16} strokeWidth={1.5} />
                </button>

                {/* Food Type Pill */}
                <button className="flex h-[40px] px-[18px] justify-center items-center gap-[12px] rounded-full border border-black/10 bg-white font-questrial text-[14px] text-[#0A2623] cursor-pointer hover:border-[#7AD371] flex-shrink-0">
                  <Sparkles size={16} strokeWidth={1.5} className="text-brand-secondary" />
                  <span>Food Type</span>
                  <ChevronDown size={16} strokeWidth={1.5} />
                </button>

                {/* Ratings Pill */}
                <button className="flex h-[40px] px-[18px] justify-center items-center gap-[12px] rounded-full border border-black/10 bg-white font-questrial text-[14px] text-[#0A2623] cursor-pointer hover:border-[#7AD371] flex-shrink-0">
                  <Star size={16} strokeWidth={1.5} className="text-yellow-500 fill-yellow-500" />
                  <span>Ratings</span>
                  <ChevronDown size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Reset button */}
              <button
                onClick={handleReset}
                className="flex-shrink-0 flex h-[40px] px-[16px] sm:px-[24px] justify-center items-center gap-[12px] rounded-full bg-white border border-black/10 hover:border-[#EF4444]/30 hover:text-[#EF4444] transition-colors font-questrial text-[14px] text-[#0A2623] cursor-pointer"
              >
                <RotateCcw size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* ── LOADING STATE ──────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-[20px] bg-white border border-black/10 p-[5px] overflow-hidden">
                  <div className="h-[120px] skeleton rounded-[16px]" />
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-4 w-3/4 skeleton rounded-full" />
                    <div className="h-3 w-1/3 skeleton rounded-full" />
                    <div className="h-10 skeleton rounded-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center bg-white border border-black/10 rounded-[20px] p-6 shadow-sm">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30">
                <RefreshCw size={24} className="text-[#EF4444]" />
              </div>
              <div>
                <p className="font-questrial text-lg text-text-primary mb-1 font-medium">Couldn't load food listings</p>
                <p className="font-questrial text-sm text-text-secondary">{error}</p>
              </div>
              <button onClick={fetchListings} className="btn-outline flex items-center gap-2 hover:bg-brand-primary/10">
                <RefreshCw size={15} /> Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center border border-black/10 rounded-[20px] bg-white p-6 shadow-sm">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-black/10">
                <Utensils size={24} className="text-text-muted" />
              </div>
              <div>
                <p className="font-questrial text-lg text-text-primary mb-1 font-medium font-questrial">No meals available</p>
                <p className="font-questrial text-sm text-text-secondary">
                  {searchQuery ? `No results match "${searchQuery}"` : 'Check back later or adjust filters!'}
                </p>
              </div>
              {searchQuery && (
                <button onClick={() => setSearchParams({})} className="btn-secondary !h-9 !px-6 !text-sm">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* ── SECTION 1: Fire Almost Gone ────────────────── */}
              {almostGone.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <h2 className="font-questrial text-[24px] font-normal leading-[130%] text-[#0A2623]">
                      Almost gone
                    </h2>
                  </div>
                  {/* Horizontal Scroll wrapper */}
                  <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none select-none" style={{ scrollbarWidth: 'none' }}>
                    {almostGone.map((listing) => (
                      <div key={listing.$id} className="w-[340px] flex-shrink-0">
                        <FoodCard
                          id={listing.$id}
                          name={listing.name}
                          originalPrice={listing.originalPrice}
                          discountedPrice={listing.discountedPrice}
                          timeLeft={listing.pickupTime}
                          claimsUsed={listing.claimsUsed}
                          claimsTotal={listing.quantity + listing.claimsUsed}
                          distance={getListingDistance(listing.$id)}
                          vendorName={listing.vendorName}
                          imageUrl={listing.imageUrl}
                          isSaved={isSaved(listing.$id)}
                          onSave={(e) => { e.preventDefault(); toggleSave(listing.$id); }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SECTION 2: Available Near You ──────────────── */}
              {availableNearYou.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="font-questrial text-[24px] font-normal leading-[130%] text-[#0A2623]">
                    Available Near You
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {availableNearYou.map((listing) => (
                      <FoodCard
                        key={listing.$id}
                        id={listing.$id}
                        name={listing.name}
                        originalPrice={listing.originalPrice}
                        discountedPrice={listing.discountedPrice}
                        timeLeft={listing.pickupTime}
                        claimsUsed={listing.claimsUsed}
                        claimsTotal={listing.quantity + listing.claimsUsed}
                        distance={getListingDistance(listing.$id)}
                        vendorName={listing.vendorName}
                        imageUrl={listing.imageUrl}
                        isSaved={isSaved(listing.$id)}
                        onSave={(e) => { e.preventDefault(); toggleSave(listing.$id); }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListingsPage;
