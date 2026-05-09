import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import FoodCard from '../components/FoodCard';
import {
  SlidersHorizontal, ChevronDown, Search, MapPin,
  X, RefreshCw, Utensils
} from 'lucide-react';
import { getListings } from '../services/listings.service';
import type { Listing } from '../services/listings.service';

const CATEGORIES = ['All', 'Rice Dishes', 'Soups & Stews', 'Snacks', 'Pastries', 'Drinks', 'Protein', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest first' },
  { value: 'price_lo', label: 'Price: Low → High' },
  { value: 'price_hi', label: 'Price: High → Low' },
  { value: 'discount', label: 'Biggest discount' },
];

const ListingsPage = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy]       = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice]   = useState(5000);
  const [listings, setListings]   = useState<Listing[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getListings(50);
      setListings(data);
    } catch (e) {
      setError('Could not load listings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  // Client-side filter + sort
  const filtered = listings
    .filter((l) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.vendorName.toLowerCase().includes(q);
      const matchPrice  = l.discountedPrice <= maxPrice;
      return matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price_lo')  return a.discountedPrice - b.discountedPrice;
      if (sortBy === 'price_hi')  return b.discountedPrice - a.discountedPrice;
      if (sortBy === 'discount')  return (b.originalPrice - b.discountedPrice) - (a.originalPrice - a.discountedPrice);
      return 0; // newest — API already orders by $createdAt desc
    });

  return (
    <div className="min-h-screen flex flex-col bg-bg pb-24 md:pb-0">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1280px] mx-auto flex gap-8 items-start">

          {/* ── Sidebar Filters ──────────────────────────────── */}
          <aside className={`w-[240px] flex-shrink-0 flex-col gap-5 ${showFilters ? 'flex' : 'hidden lg:flex'}`}>
            <div className="section-card flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="font-questrial text-base text-text-primary">Filters</h3>
                <button
                  onClick={() => { setMaxPrice(5000); }}
                  className="font-questrial text-xs text-text-muted hover:text-brand-secondary transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="input-label">Location</label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-bg">
                  <MapPin size={14} className="text-brand-primary" />
                  <span className="font-questrial text-sm text-text-primary">Ilorin, Kwara</span>
                </div>
              </div>

              {/* Max Price */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="input-label">Max price</label>
                  <span className="font-questrial text-sm text-text-primary">₦{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range" min={100} max={5000} step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0F3934] cursor-pointer"
                />
                <div className="flex justify-between">
                  <span className="font-questrial text-xs text-text-muted">₦100</span>
                  <span className="font-questrial text-xs text-text-muted">₦5,000</span>
                </div>
              </div>

              {/* Availability */}
              <div className="flex flex-col gap-2">
                <label className="input-label">Availability</label>
                {['Available now', 'Expiring soon', 'All'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="availability" defaultChecked={opt === 'All'}
                      className="accent-[#0F3934] w-4 h-4" />
                    <span className="font-questrial text-sm text-text-primary">{opt}</span>
                  </label>
                ))}
              </div>

              <button className="btn-primary w-full !h-10 !text-sm">Apply Filters</button>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">

            {/* Top bar */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-48 h-10 px-4 rounded-full border border-border bg-white focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-[#7AD37125] transition-all">
                <Search size={15} className="text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search meals or vendors…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none font-questrial text-sm text-text-primary placeholder:text-text-muted"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X size={14} className="text-text-muted hover:text-text-primary" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none h-10 pl-4 pr-9 rounded-full border border-border bg-white font-questrial text-sm text-text-primary cursor-pointer outline-none focus:border-brand-primary hover:border-[#B8D0B8] transition-all"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center gap-2 h-10 px-4 rounded-full border font-questrial text-sm transition-all ${
                  showFilters ? 'border-brand-primary bg-brand-primary/10 text-brand-secondary' : 'border-border bg-white text-text-primary'
                }`}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 h-9 px-5 rounded-full font-questrial text-sm transition-all ${
                    activeCategory === cat
                      ? 'bg-[#0F3934] text-white shadow-sm'
                      : 'bg-white border border-border text-text-secondary hover:border-brand-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Result count */}
            {!loading && (
              <p className="font-questrial text-sm text-text-muted">
                {filtered.length === 0
                  ? 'No listings found'
                  : <><span className="text-text-primary font-semibold">{filtered.length}</span> listing{filtered.length !== 1 ? 's' : ''} available</>
                }
              </p>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-border overflow-hidden">
                    <div className="h-44 skeleton" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="h-3 w-24 skeleton rounded-full" />
                      <div className="h-4 w-3/4 skeleton rounded-full" />
                      <div className="h-4 w-1/2 skeleton rounded-full" />
                      <div className="h-10 skeleton rounded-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#EF444415] border border-[#EF444430]">
                  <RefreshCw size={24} className="text-[#EF4444]" />
                </div>
                <div>
                  <p className="font-questrial text-lg text-text-primary mb-1">Couldn't load listings</p>
                  <p className="font-questrial text-sm text-text-secondary">{error}</p>
                </div>
                <button onClick={fetchListings} className="btn-outline flex items-center gap-2">
                  <RefreshCw size={15} /> Try Again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-5 text-center border border-border rounded-3xl bg-white">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-border">
                  <Utensils size={24} className="text-text-muted" />
                </div>
                <div>
                  <p className="font-questrial text-lg text-text-primary mb-1">No listings found</p>
                  <p className="font-questrial text-sm text-text-secondary">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters or price range'}
                  </p>
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="btn-secondary !h-9 !px-6 !text-sm">
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((listing) => (
                  <FoodCard
                    key={listing.$id}
                    id={listing.$id}
                    name={listing.name}
                    originalPrice={listing.originalPrice}
                    discountedPrice={listing.discountedPrice}
                    timeLeft={listing.pickupTime}
                    claimsUsed={listing.claimsUsed}
                    claimsTotal={listing.quantity + listing.claimsUsed}
                    distance={listing.distance ?? ''}
                    vendorName={listing.vendorName}
                    imageUrl={listing.imageUrl}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ListingsPage;
