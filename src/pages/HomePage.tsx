import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import { Link } from 'react-router-dom';
import { ChevronRight, Utensils, ShieldCheck, Clock, Leaf, TrendingDown, Zap } from 'lucide-react';
import { getListings } from '../services/listings.service';
import type { Listing } from '../services/listings.service';

const HOW_IT_WORKS = [
  {
    icon: <Utensils size={28} className="text-brand-secondary" />,
    step: '01',
    title: 'Browse Listings',
    desc: 'Discover surplus meals from verified local restaurants and food vendors near you in real time.',
    color: 'bg-[#7AD37115]',
  },
  {
    icon: <ShieldCheck size={28} className="text-brand-secondary" />,
    step: '02',
    title: 'Claim a Meal',
    desc: 'Select a listing, confirm your pickup time, and claim the meal at a fraction of the original price.',
    color: 'bg-[#0F393415]',
  },
  {
    icon: <Clock size={28} className="text-brand-secondary" />,
    step: '03',
    title: 'Pick Up & Enjoy',
    desc: 'Head to the vendor at the agreed pickup window, collect your food, and enjoy quality meals.',
    color: 'bg-[#7AD37115]',
  },
];

const WHY_ITEMS = [
  { icon: <TrendingDown size={22} className="text-brand-secondary" />, title: 'Up to 70% Off', desc: 'Save big on quality meals every day.' },
  { icon: <Leaf size={22} className="text-[#22C55E]" />, title: 'Reduce Waste', desc: 'Every claim saves food from landfill.' },
  { icon: <Zap size={22} className="text-[#F59E0B]" />, title: 'Instant Access', desc: 'Real-time listings from verified vendors.' },
  { icon: <ShieldCheck size={22} className="text-brand-secondary" />, title: 'Verified Vendors', desc: 'All vendors are identity-verified.' },
];

const HomePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getListings(6)
      .then((data) => setListings(data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const heroListing = listings[0] ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-20 px-6 border-b border-border">
        {/* Background decoration */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-secondary/5 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-16 relative">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/15 text-brand-secondary text-sm font-questrial mb-7 border border-brand-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" />
              </span>
              Live Listings Near You
            </div>

            <h1 className="font-questrial text-5xl lg:text-6xl text-text-primary leading-[1.1] mb-6">
              Rescue Food,<br />
              <span className="text-brand-primary">Save Money.</span>
            </h1>

            <p className="font-questrial text-lg text-text-secondary mb-10 leading-relaxed">
              Claim surplus meals from verified restaurants at up to{' '}
              <span className="text-brand-secondary font-semibold">70% off</span>. 
              Fresh food. Less waste. More community.
            </p>

            <div className="flex gap-3 flex-wrap mb-12">
              <Link to="/listings" className="btn-primary !h-12 !px-8 !text-base shadow-lg shadow-[#0F3934]/20">
                Browse Food
              </Link>
              <Link to="/get-started" className="btn-secondary !h-12 !px-8 !text-base">
                List Your Surplus
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {[
                { value: '500+', label: 'Meals Rescued' },
                { value: '50+',  label: 'Verified Vendors' },
                { value: '4.9★', label: 'Avg Rating' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <p className="font-questrial text-3xl text-brand-secondary">{stat.value}</p>
                  <p className="font-questrial text-sm text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div className="flex-1 relative w-full max-w-lg">
            <div className="relative w-full h-[440px] rounded-3xl overflow-hidden shadow-xl border border-border/50">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/122394f83d0cefce139fac00d3dbaf7e0a2932de?width=1200"
                alt="Delicious food"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2623]/30 via-transparent to-transparent" />
            </div>

            {/* Floating listing badge */}
            {heroListing && (
              <div className="absolute -bottom-5 -left-6 bg-white rounded-2xl px-5 py-4 border border-border animate-float"
                style={{ boxShadow: '0 8px 32px rgba(10,38,35,0.12)' }}>
                <p className="font-questrial text-xs text-text-muted mb-0.5">Latest Listing</p>
                <p className="font-questrial text-sm text-text-primary font-semibold line-clamp-1">{heroListing.name}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-questrial text-lg text-brand-secondary">
                    ₦{heroListing.discountedPrice.toLocaleString()}
                  </span>
                  <span className="font-questrial text-xs text-text-muted line-through">
                    ₦{heroListing.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Top-right verified badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-border"
              style={{ boxShadow: '0 4px 12px rgba(10,38,35,0.08)' }}>
              <ShieldCheck size={14} className="text-brand-primary" />
              <span className="font-questrial text-xs text-text-primary">Verified Vendors</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why FoodBridge ────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#EFF4F0]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-3.5 p-5 bg-white rounded-2xl border border-border transition-all hover:border-brand-primary hover:shadow-card-hover">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-bg flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-questrial text-sm text-text-primary mb-0.5">{item.title}</p>
                  <p className="font-questrial text-xs text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Listings ────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-questrial text-sm text-brand-secondary mb-2 uppercase tracking-wide">Fresh & Available</p>
              <h2 className="font-questrial text-3xl text-text-primary">Available Near You</h2>
            </div>
            <Link
              to="/listings"
              className="hidden sm:flex items-center gap-1.5 font-questrial text-sm text-brand-secondary hover:text-text-primary transition-colors"
            >
              View all listings <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-5 text-center border border-border rounded-3xl bg-bg">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-border">
                <Utensils size={32} className="text-text-muted" />
              </div>
              <div>
                <p className="font-questrial text-xl text-text-primary mb-1">No listings available right now</p>
                <p className="font-questrial text-sm text-text-secondary">Vendors are setting up — check back soon for fresh deals!</p>
              </div>
              <Link to="/get-started" className="btn-primary">List Your Food</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
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

          {!loading && listings.length > 0 && (
            <div className="flex justify-center mt-10">
              <Link to="/listings" className="btn-secondary !h-12 !px-10">
                View All Listings <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#EFF4F0]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <p className="font-questrial text-sm text-brand-secondary mb-2 uppercase tracking-wide">Simple process</p>
            <h2 className="font-questrial text-3xl text-text-primary">How FoodBridge Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-px bg-border z-0" />

            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} className="relative flex flex-col items-center text-center gap-5 p-8 rounded-3xl bg-white border border-border hover:border-brand-primary hover:shadow-card-hover transition-all duration-300 group z-10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-questrial text-5xl text-border font-bold select-none">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${item.color} group-hover:scale-110 transition-transform mt-4`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-questrial text-lg text-text-primary mb-2">{item.title}</h3>
                  <p className="font-questrial text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="relative overflow-hidden bg-[#0F3934] rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-brand-primary/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />

            <div className="relative">
              <p className="font-questrial text-brand-primary text-sm mb-2 uppercase tracking-wide">For Vendors</p>
              <h2 className="font-questrial text-4xl text-white mb-3">Have Surplus Food?</h2>
              <p className="font-questrial text-white/70 text-base max-w-md leading-relaxed">
                Join hundreds of verified vendors reducing food waste while earning extra income on surplus meals.
              </p>
            </div>
            <Link
              to="/get-started"
              className="relative flex-shrink-0 flex items-center gap-2 h-12 px-8 rounded-full bg-brand-primary text-text-primary font-questrial text-base hover:bg-[#69C161] hover:shadow-lg transition-all active:scale-[0.97]"
            >
              List Your Food <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
