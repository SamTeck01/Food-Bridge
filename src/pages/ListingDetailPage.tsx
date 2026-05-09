import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { getListingById } from '../services/listings.service';
import type { Listing } from '../services/listings.service';
import {
  ArrowLeft, MapPin, Clock, Flame, Star,
  Heart, CheckCircle2, ShieldCheck, Leaf,
  ChevronRight, Share2
} from 'lucide-react';

/* Figma diagonal arrow icon (directions) */
const DirectionsArrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 6.65C9 6.65 15.94 6.11 16.92 7.08C17.89 8.06 17.35 15 17.35 15M16.5 7.5L6.5 17.5"
      stroke="#7AD371" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoggedIn } = useApp();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState('');
  const [claimed, setClaimed]  = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<'pickup' | 'vendor' | 'about'>('pickup');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getListingById(id)
      .then((data) => setListing(data))
      .catch(() => setError('Listing not found or no longer available.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClaim = () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!listing) return;
    addToCart({
      id: listing.$id,
      name: listing.name,
      vendorName: listing.vendorName,
      vendorId: listing.vendorId,
      originalPrice: listing.originalPrice,
      discountedPrice: listing.discountedPrice,
      imageUrl: listing.imageUrl || '',
      pickupTime: listing.pickupTime,
      distance: listing.distance || '',
    });
    setClaimed(true);
    setTimeout(() => navigate('/cart'), 900);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: listing?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const discountPercent = listing
    ? Math.round((1 - listing.discountedPrice / listing.originalPrice) * 100)
    : 0;

  const soldOut = listing ? listing.claimsUsed >= (listing.quantity + listing.claimsUsed) : false;

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1280px] mx-auto flex gap-10">
          <div className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="h-10 w-10 skeleton rounded-full mb-6" />
            <div className="h-7 w-48 skeleton rounded-lg mb-3" />
            <div className="h-5 w-32 skeleton rounded-lg mb-6" />
            <div className="h-11 w-full skeleton rounded-full" />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <div className="h-72 w-full skeleton rounded-2xl" />
            <div className="h-8 w-2/3 skeleton rounded-lg" />
            <div className="h-5 w-1/3 skeleton rounded-lg" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  /* ── Error ── */
  if (error || !listing) return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-border">
          <span className="text-4xl">🍽️</span>
        </div>
        <div>
          <h1 className="font-questrial text-2xl text-text-primary mb-2">Listing Not Found</h1>
          <p className="font-questrial text-base text-text-secondary">{error || 'This listing may have expired or been removed.'}</p>
        </div>
        <Link to="/listings" className="btn-primary">Browse Other Listings</Link>
      </main>
      <Footer />
    </div>
  );

  const claimsTotal = listing.quantity + listing.claimsUsed;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1280px] mx-auto flex gap-10 items-start">

          {/* ── LEFT SIDEBAR: Summary + Claim ─────────────────── */}
          <aside className="hidden lg:flex w-[240px] flex-shrink-0 flex-col gap-6 sticky top-28">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-brand-primary bg-white transition-all"
            >
              <ArrowLeft size={18} className="text-text-secondary" />
            </button>

            <div className="flex flex-col gap-2">
              <h2 className="font-questrial text-xl text-text-primary leading-snug">{listing.name}</h2>
              <div className="flex items-baseline gap-2">
                <span className="font-questrial text-2xl text-text-primary">
                  ₦{listing.discountedPrice.toLocaleString()}
                </span>
                <span className="font-questrial text-sm text-text-muted line-through">
                  ₦{listing.originalPrice.toLocaleString()}
                </span>
              </div>
              {discountPercent > 0 && (
                <span className="discount-badge self-start">{discountPercent}% OFF</span>
              )}
            </div>

            <button
              onClick={handleClaim}
              disabled={claimed || soldOut}
              className={`w-full btn-primary disabled:opacity-60 ${claimed ? 'bg-[#22C55E] hover:bg-[#22C55E]' : ''}`}
            >
              {claimed ? (
                <><CheckCircle2 size={16} /> Claimed!</>
              ) : soldOut ? 'Sold Out' : 'Claim Now'}
            </button>

            <div className="flex flex-col gap-3.5 p-4 bg-white rounded-2xl border border-border">
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-text-muted flex-shrink-0" />
                <span className="font-questrial text-sm text-text-primary">{listing.pickupTime}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Flame size={16} className={listing.claimsUsed / claimsTotal > 0.7 ? 'text-[#EF4444]' : 'text-[#22C55E]'} />
                <span className="font-questrial text-sm text-text-primary">
                  {listing.claimsUsed}/{claimsTotal} claimed
                </span>
              </div>
              {listing.distance && (
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-text-muted flex-shrink-0" />
                  <span className="font-questrial text-sm text-text-primary">{listing.distance}</span>
                </div>
              )}
            </div>
          </aside>

          {/* Divider */}
          <div className="hidden lg:block w-px self-stretch bg-border" />

          {/* ── CENTER: Main content ───────────────────────────── */}
          <div className="flex-1 flex flex-col gap-7 min-w-0">
            {/* Mobile back */}
            <button
              onClick={() => navigate(-1)}
              className="flex lg:hidden items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-questrial text-sm">Back</span>
            </button>

            {/* Image */}
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-[#F0F4F1] relative">
              {listing.imageUrl ? (
                <img src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
              )}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#0F3934] text-white font-questrial text-sm">
                  {discountPercent}% OFF
                </div>
              )}
              {soldOut && (
                <div className="absolute inset-0 bg-[#0A2623]/60 flex items-center justify-center">
                  <span className="font-questrial text-white text-lg bg-[#0A2623]/80 px-6 py-2 rounded-full">Sold Out</span>
                </div>
              )}
            </div>

            {/* Title & price */}
            <div className="flex flex-col gap-2.5">
              <h1 className="font-questrial text-3xl text-text-primary leading-tight">{listing.name}</h1>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-questrial text-3xl text-text-primary">
                  ₦{listing.discountedPrice.toLocaleString()}
                </span>
                <span className="font-questrial text-lg text-text-muted line-through">
                  ₦{listing.originalPrice.toLocaleString()}
                </span>
                {discountPercent > 0 && (
                  <span className="discount-badge text-sm px-3 py-1">{discountPercent}% OFF</span>
                )}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Meta row */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Clock size={18} className="text-text-secondary" />, label: 'Pickup window', value: listing.pickupTime },
                { icon: <Flame size={18} className="text-[#22C55E]" />, label: 'Claims', value: `${listing.claimsUsed}/${claimsTotal}` },
                ...(listing.distance ? [{ icon: <MapPin size={18} className="text-text-secondary" />, label: 'Distance', value: listing.distance }] : []),
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white min-w-[140px]">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-bg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-questrial text-xs text-text-muted">{item.label}</p>
                    <p className="font-questrial text-sm text-text-primary">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFavorited(!favorited)}
                className={`flex items-center gap-2 h-11 px-6 rounded-full border font-questrial text-sm transition-all ${
                  favorited
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-border text-text-primary hover:border-brand-primary'
                }`}
              >
                <Heart size={16} className={favorited ? 'fill-red-500' : ''} />
                {favorited ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 h-11 px-6 rounded-full border border-border bg-white text-text-primary font-questrial text-sm hover:border-brand-primary transition-all"
              >
                <Share2 size={16} /> Share
              </button>
              <button
                onClick={handleClaim}
                disabled={claimed || soldOut}
                className={`flex-1 min-w-[140px] btn-primary disabled:opacity-60 ${claimed ? '!bg-[#22C55E]' : ''}`}
              >
                {claimed ? (<><CheckCircle2 size={16} /> Claimed!</>) : soldOut ? 'Sold Out' : 'Claim Now'}
              </button>
            </div>

            <div className="h-px bg-border" />

            {/* Pickup details */}
            <div className="flex flex-col gap-4">
              <h3 className="font-questrial text-base text-text-primary">Pickup Details</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-bg border border-border flex-shrink-0">
                    <MapPin size={20} className="text-[#EF4444]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-questrial text-xs text-text-muted">Vendor location</p>
                    <p className="font-questrial text-sm text-text-primary">{listing.vendorName}</p>
                    {listing.distance && (
                      <p className="font-questrial text-xs text-text-secondary">{listing.distance}</p>
                    )}
                  </div>
                  <DirectionsArrow />
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-bg border border-border flex-shrink-0">
                    <Clock size={20} className="text-[#22C55E]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-questrial text-xs text-text-muted">Pickup window</p>
                    <p className="font-questrial text-sm text-text-primary">{listing.pickupTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Vendor info */}
            <div className="flex flex-col gap-4">
              <h3 className="font-questrial text-base text-text-primary">Posted by</h3>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
                <div className="w-14 h-14 rounded-full bg-[#EFF4F0] flex items-center justify-center flex-shrink-0 border border-border">
                  <span className="font-questrial text-xl text-brand-secondary">
                    {listing.vendorName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-questrial text-base text-text-primary">{listing.vendorName}</p>
                    <ShieldCheck size={16} className="text-brand-primary" />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-questrial text-xs text-text-secondary">4.8 rating</span>
                  </div>
                </div>
                <Link to="/listings" className="flex items-center gap-1 font-questrial text-xs text-brand-secondary hover:underline">
                  More <ChevronRight size={13} />
                </Link>
              </div>
            </div>

            {/* About */}
            {listing.description && (
              <>
                <div className="h-px bg-border" />
                <div className="flex flex-col gap-3">
                  <h3 className="font-questrial text-base text-text-primary">About this food</h3>
                  <p className="font-questrial text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              </>
            )}

            {/* Allergens */}
            {listing.allergens && listing.allergens.length > 0 && (
              <>
                <div className="h-px bg-border" />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Leaf size={16} className="text-text-muted" />
                    <h3 className="font-questrial text-base text-text-primary">Allergen Information</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.allergens.map((a) => (
                      <span key={a} className="px-3 py-1 rounded-full bg-[#F59E0B15] border border-[#F59E0B30] font-questrial text-xs text-[#92400E]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Mobile claim button */}
            <div className="lg:hidden pt-2 pb-4">
              <button
                onClick={handleClaim}
                disabled={claimed || soldOut}
                className={`w-full btn-primary !h-12 disabled:opacity-60 ${claimed ? '!bg-[#22C55E]' : ''}`}
              >
                {claimed ? (<><CheckCircle2 size={18} /> Claimed!</>) : soldOut ? 'Sold Out' : 'Claim Now — ₦' + listing.discountedPrice.toLocaleString()}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px self-stretch bg-border" />

          {/* ── RIGHT SIDEBAR: Detail tabs ─────────────────────── */}
          <aside className="hidden lg:flex w-[220px] flex-shrink-0 flex-col rounded-2xl border border-border bg-white overflow-hidden sticky top-28"
            style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
            {/* Tab buttons */}
            <div className="flex flex-col border-b border-border">
              {[
                { key: 'pickup', label: 'Pickup details', icon: <MapPin size={14} /> },
                { key: 'vendor', label: 'Vendor details', icon: <Star size={14} /> },
                { key: 'about',  label: 'About this food', icon: <Leaf size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex items-center gap-2.5 px-5 py-3.5 text-left font-questrial text-sm transition-all border-b border-border last:border-0 ${
                    activeTab === tab.key
                      ? 'bg-brand-primary/10 text-brand-secondary'
                      : 'text-text-secondary hover:bg-bg'
                  }`}
                >
                  <span className={activeTab === tab.key ? 'text-brand-secondary' : 'text-text-muted'}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-5 flex flex-col gap-4 flex-1">
              {activeTab === 'pickup' && (
                <>
                  <InfoRow label="Vendor" value={listing.vendorName} />
                  {listing.distance && <InfoRow label="Distance" value={listing.distance} />}
                  <InfoRow label="Pickup window" value={listing.pickupTime} />
                  <InfoRow label="Claims" value={`${listing.claimsUsed}/${claimsTotal}`} />
                </>
              )}
              {activeTab === 'vendor' && (
                <>
                  <InfoRow label="Name" value={listing.vendorName} />
                  <div className="flex flex-col gap-1">
                    <p className="font-questrial text-xs text-text-muted uppercase tracking-wide">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-questrial text-sm text-text-primary">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-brand-primary" />
                    <span className="font-questrial text-xs text-brand-secondary">Verified Vendor</span>
                  </div>
                </>
              )}
              {activeTab === 'about' && (
                <p className="font-questrial text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {listing.description || 'No description provided.'}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <p className="font-questrial text-xs text-text-muted uppercase tracking-wide">{label}</p>
    <p className="font-questrial text-sm text-text-primary">{value}</p>
  </div>
);

export default ListingDetailPage;
