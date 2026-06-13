import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  Leaf,
  MapPin,
  ShieldCheck,
  Star,
  Utensils,
  Motorbike,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { Listing } from '../../services/listings.service';
import { getListingById, updateListing, getListingImage } from '../../services/listings.service';
import { createOrder, getVendorOrders } from '../../services/orders.service';
import type { Order } from '../../services/orders.service';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helper: Star row ────────────────────────────────────────────────────────
const StarRow = ({ value, size = 14 }: { value: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-black/15'}
      />
    ))}
  </div>
);

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, isSaved, toggleSave } = useApp();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [activeSection, setActiveSection] = useState<'pickup' | 'vendor' | 'about'>('pickup');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [claimQty, setClaimQty] = useState(1);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<Order[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getListingById(id)
      .then((data) => {
        setListing(data);
        // Fetch vendor reviews
        setReviewsLoading(true);
        return getVendorOrders(data.vendorId).then((orders) => {
          const rated = orders.filter((o) => o.rating != null && o.rating > 0);
          setReviews(rated);
        }).catch(() => {}).finally(() => setReviewsLoading(false));
      })
      .catch(() => setError('Listing not found or no longer available.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Derived review stats
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;
  const reviewCount = reviews.length;

  const handleClaim = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!listing) return;
    setClaimQty(1);
    setIsDrawerOpen(true);
  };

  const handleConfirmClaim = async () => {
    if (!listing || !user) return;
    setClaiming(true);
    try {
      // 1. Create the order document in Appwrite
      const order = await createOrder({
        listingId: listing.$id,
        listingName: listing.name,
        listingImageUrl: listing.imageUrl || '',
        buyerId: user.id,
        vendorId: listing.vendorId,
        vendorName: listing.vendorName,
        totalPaid: claimQty * listing.discountedPrice,
        originalTotal: claimQty * listing.originalPrice,
        pickupTime: listing.pickupTime,
        distance: listing.distance || '0.8 km away',
        buyerName: user.name || 'Anonymous Buyer',
        quantity: claimQty,
      });

      // 2. Decrement remaining quantity and update status in listings collection
      const newClaimsUsed = listing.claimsUsed + claimQty;
      const newQuantity = Math.max(0, listing.quantity - claimQty);
      const newStatus = newQuantity <= 0 ? 'sold_out' : 'active';

      await updateListing(listing.$id, {
        claimsUsed: newClaimsUsed,
        quantity: newQuantity,
        status: newStatus,
      });

      // 3. Mark locally as claimed and navigate to success screen
      setClaimed(true);
      setIsDrawerOpen(false);
      navigate(`/orders/${order.$id}/claim-success`);
    } catch (err) {
      console.error('Error confirming order:', err);
      setClaimError('Failed to process claim. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const discountPercent = listing
    ? Math.round((1 - listing.discountedPrice / listing.originalPrice) * 100)
    : 0;

  const claimsTotal = listing ? listing.quantity + listing.claimsUsed : 0;
  const soldOut = listing ? listing.claimsUsed >= claimsTotal : false;

  // Stable pseudo-random distance for mockups
  const distance = listing ? (listing.distance || '0.8 km away') : '0.8 km away';

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] py-10 px-6">
      <div className="max-w-[77.5rem] mx-auto flex gap-10 items-center justify-center flex-1 py-32">
        <div className="w-10 h-10 border-4 border-[#7AD371] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (error || !listing) return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <main className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-black/10">
          <span className="text-4xl">🍽️</span>
        </div>
        <div>
          <h1 className="font-questrial text-2xl text-text-primary mb-2">Listing Not Found</h1>
          <p className="font-questrial text-sm text-text-secondary">This listing may have expired or been removed.</p>
        </div>
        <Link to="/listings" className="btn-primary">Browse Other Listings</Link>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] pb-24 md:pb-12 select-none">
      <main className="flex-1 md:py-[40px] py-6 md:px-[6.25rem] px-4">
        <div className="max-w-[77.5rem] mx-auto flex flex-col lg:flex-row gap-[40px] items-start">
          
          {/* ── LEFT COLUMN: Summary & Claim ─────────────────── */}
          <aside className="w-full lg:w-[250px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-24">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 hover:border-brand-primary bg-white transition-all cursor-pointer"
            >
              <ArrowLeft size={18} className="text-[#0A2623]/70" />
            </button>

            <div className="hidden lg:flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="font-questrial text-[24px] font-normal leading-[130%] text-[#0A2623]">{listing.name}</h2>
                <div className="flex items-center gap-[12px]">
                  <span className="text-[#0A2623]/70 font-questrial text-[16px] font-normal leading-[130%] line-through">
                    ₦{listing.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[#0A2623] font-questrial text-[24px] font-normal leading-[130%]">
                    ₦{listing.discountedPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClaim}
                disabled={claimed || soldOut}
                className={`w-full h-10 rounded-full font-questrial text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  claimed
                    ? 'bg-[#28A745] text-white'
                    : soldOut
                    ? 'bg-black/10 text-[#0A2623]/30 cursor-not-allowed'
                    : 'bg-[#0F3934] text-white hover:bg-[#0A2623]'
                }`}
              >
                {claimed ? (
                  <><CheckCircle2 size={16} /> Claimed!</>
                ) : soldOut ? (
                  'Sold Out'
                ) : (
                  'Claim Now'
                )}
              </button>

              {/* Left Meta Widget Card */}
              <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl border border-black/10">
                <div className="flex items-center gap-3 text-[#0A2623]">
                  <Clock size={18} strokeWidth={1.5} className="flex-shrink-0" />
                  <span className="font-questrial text-[16px] leading-[130%]">{listing.pickupTime}</span>
                </div>
                <div className="flex items-center gap-3 text-[#0A2623]">
                  <Flame size={18} strokeWidth={1.5} className="text-[#28A745] flex-shrink-0" />
                  <span className="font-questrial text-[16px] leading-[130%]">{listing.claimsUsed}/{claimsTotal} claims</span>
                </div>
                <div className="flex items-center gap-3 text-[#0A2623]">
                  <MapPin size={18} strokeWidth={1.5} className="text-[#EF4444] flex-shrink-0" />
                  <span className="font-questrial text-[16px] leading-[130%]">{distance}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Vertical Divider 1 */}
          <div className="hidden lg:block w-[1px] min-h-[500px] self-stretch bg-black/10" />

          {/* ── MIDDLE COLUMN: Main Listing Details ───────────── */}
          <div className="flex-1 flex flex-col gap-9 min-w-0">
            {/* Image Box */}
            <div className="w-full h-64 md:h-80 rounded-[16px_16px_0_0] overflow-hidden bg-[#F9F9F9] relative border border-black/10 border-b-0">
              <img
                src={getListingImage(listing.name, listing.imageUrl, listing.description)}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#0F3934] text-white font-questrial text-sm font-medium">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Title & Pricing Card */}
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-3">
                <h1 className="font-questrial text-[32px] font-normal leading-[130%] text-[#0A2623]">
                  {listing.name}
                </h1>
                <div className="flex items-center gap-[12px]">
                  <span className="text-[#0A2623]/70 font-questrial text-[24px] font-normal leading-[130%] line-through">
                    ₦{listing.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[#0A2623] font-questrial text-[32px] font-normal leading-[130%] font-semibold">
                    ₦{listing.discountedPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-black/10 w-full" />

              {/* Claims / Time detail checklist */}
              <div className="flex flex-col gap-4">
                {/* Time row */}
                <div className="flex items-center gap-[23px]">
                  <div className="w-12 h-12 rounded-lg border border-black/10 bg-[#F9F9F9] flex items-center justify-center text-[#28A745] flex-shrink-0">
                    <Clock size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-questrial text-[16px] text-[#0A2623]/70">Time left</span>
                    <span className="font-questrial text-[16px] text-[#0A2623] font-medium">{listing.pickupTime}</span>
                  </div>
                </div>

                {/* Claims row */}
                <div className="flex items-center gap-[23px]">
                  <div className="w-12 h-12 rounded-lg border border-black/10 bg-[#F9F9F9] flex items-center justify-center text-[#28A745] flex-shrink-0">
                    <Flame size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-questrial text-[16px] text-[#0A2623]/70">Claims</span>
                    <span className="font-questrial text-[16px] text-[#0A2623] font-medium">{listing.claimsUsed}/{claimsTotal} claims</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-[24px] flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => listing && toggleSave(listing.$id)}
                  className={`flex h-10 px-8 justify-center items-center gap-[10px] flex-1 rounded-full border transition-all font-questrial text-[16px] cursor-pointer ${
                    listing && isSaved(listing.$id)
                      ? 'bg-red-50 border-red-200 text-red-500 font-medium'
                      : 'bg-[#7AD371] border-black/10 text-[#0A2623] hover:bg-[#7AD371]/90'
                  }`}
                >
                  <Heart size={16} className={listing && isSaved(listing.$id) ? 'fill-red-500 text-red-500' : ''} />
                  <span>{listing && isSaved(listing.$id) ? 'Saved' : 'Save'}</span>
                </button>
                
                <button
                  onClick={handleClaim}
                  disabled={claimed || soldOut}
                  className={`flex h-10 px-8 justify-center items-center gap-[10px] flex-1 rounded-full font-questrial text-[16px] cursor-pointer transition-all ${
                    claimed
                      ? 'bg-[#28A745] text-white'
                      : soldOut
                      ? 'bg-black/10 text-[#0A2623]/30 cursor-not-allowed'
                      : 'bg-[#0F3934] text-white hover:bg-[#0A2623]'
                  }`}
                >
                  {claimed ? 'Claimed!' : 'Claim Now'}
                </button>
              </div>

              <div className="h-[1px] bg-black/10 w-full" />

              {/* Pickup Location details */}
              <div className="flex flex-col gap-6">
                <h3 className="font-questrial text-[16px] text-[#0A2623] font-medium">Pickup details</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-[23px] self-stretch">
                    <div className="w-12 h-12 rounded-lg border border-black/10 bg-[#F9F9F9] flex items-center justify-center text-[#EF4444] flex-shrink-0">
                      <MapPin size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col flex-1 justify-center min-w-0">
                      <span className="font-questrial text-[16px] text-[#0A2623]/70 truncate">{listing.vendorName}</span>
                      <span className="font-questrial text-[16px] text-[#0A2623] font-medium">{distance}</span>
                    </div>
                    <div className="text-brand-primary p-1 cursor-pointer">
                      <ChevronRight size={24} className="rotate-[-45deg]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-[23px] self-stretch">
                    <div className="w-12 h-12 rounded-lg border border-black/10 bg-[#F9F9F9] flex items-center justify-center text-[#28A745] flex-shrink-0">
                      <Clock size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <span className="font-questrial text-[16px] text-[#0A2623]/70">Pickup Time</span>
                      <span className="font-questrial text-[16px] text-[#0A2623] font-medium">{listing.pickupTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-black/10 w-full" />

              {/* Posted by card details */}
              <div className="flex flex-col gap-6">
                <h3 className="font-questrial text-[16px] text-[#0A2623] font-medium">Posted by</h3>
                <div className="flex items-center gap-[24px]">
                  <div className="w-[60px] h-[60px] rounded-full border border-black/10 bg-white flex items-center justify-center text-[#0A2623] font-questrial font-bold text-xl flex-shrink-0">
                    {listing.vendorName.charAt(0)}
                  </div>
                  <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                    <div className="flex items-center gap-[10px]">
                      <span className="font-questrial text-[24px] text-[#0A2623] truncate leading-none">
                        {listing.vendorName}
                      </span>
                      <ShieldCheck size={20} className="text-[#7AD371] flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-questrial text-[#0A2623]/70">
                      <StarRow value={avgRating} size={13} />
                      <span>
                        {reviewCount > 0
                          ? `${avgRating.toFixed(1)} (${reviewCount} review${reviewCount !== 1 ? 's' : ''})`
                          : 'No reviews yet'}
                      </span>
                    </div>
                  </div>
                  {reviewCount > 0 && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="font-questrial text-[14px] text-[#7AD371] hover:underline whitespace-nowrap cursor-pointer flex-shrink-0"
                    >
                      See all
                    </button>
                  )}
                </div>
              </div>

              {/* Inline review cards (up to 2) */}
              {reviewsLoading ? (
                <div className="flex items-center gap-2 text-sm text-[#0A2623]/40 font-questrial">
                  <div className="w-4 h-4 border-2 border-[#7AD371] border-t-transparent rounded-full animate-spin" />
                  Loading reviews...
                </div>
              ) : reviews.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review.$id} className="bg-white border border-black/10 rounded-[12px] p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#7AD371]/20 flex items-center justify-center text-[#0F3934] font-questrial font-semibold text-sm">
                            {(review.buyerId || 'U').charAt(0).toUpperCase()}
                          </div>
                          <StarRow value={review.rating || 0} size={12} />
                        </div>
                        <span className="text-[11px] text-[#0A2623]/40 font-questrial">
                          {new Date(review.$createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {review.remark && (
                        <p className="font-questrial text-[14px] text-[#0A2623]/80 leading-snug">{review.remark}</p>
                      )}
                      <span className="text-[11px] text-[#0A2623]/40 font-questrial">{review.listingName}</span>
                    </div>
                  ))}
                  {reviews.length > 2 && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="text-[14px] font-questrial text-[#7AD371] hover:underline text-left cursor-pointer"
                    >
                      View all {reviews.length} reviews →
                    </button>
                  )}
                </div>
              ) : null}

              {listing.description && (
                <>
                  <div className="h-[1px] bg-black/10 w-full" />
                  <div className="flex flex-col gap-[16px]">
                    <h3 className="font-questrial text-[16px] text-[#0A2623]/70 font-medium">About this food</h3>
                    <p className="font-questrial text-[16px] leading-[130%] text-[#0A2623] whitespace-pre-line">
                      {listing.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Vertical Divider 2 */}
          <div className="hidden lg:block w-[1px] min-h-[500px] self-stretch bg-black/10" />

          {/* ── RIGHT COLUMN: Interactive Details Card ───────── */}
          <aside className="hidden lg:flex w-full lg:w-[320px] flex-shrink-0 flex-col gap-6 lg:sticky lg:top-24">
            <div className="flex flex-col border border-black/10 bg-[#F9F9F9] rounded-[10px] overflow-hidden">
              <div className="bg-[#F5F5F5] py-[20px] px-[24px] border-b border-black/10">
                <h3 className="font-questrial text-[16px] font-normal leading-[130%] text-[#0A2623]">
                  Details
                </h3>
              </div>

              {/* Items / Tabs list */}
              <div className="flex flex-col">
                {[
                  { key: 'pickup', label: 'Pickup details', icon: Motorbike },
                  { key: 'vendor', label: 'Vendor details', icon: Utensils },
                  { key: 'about', label: 'About this food', icon: Leaf },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key as typeof activeSection)}
                      className={`flex items-center gap-[12px] py-[20px] px-[24px] border-b border-black/10 last:border-0 text-left font-questrial text-[16px] leading-[130%] transition-colors cursor-pointer ${
                        isActive ? 'bg-[#7AD371]/10 text-brand-secondary font-medium' : 'text-[#0A2623] bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.5} className="flex-shrink-0 text-[#0A2623]/70" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Card Info box */}
            <div className="p-5 bg-white border border-black/10 rounded-2xl flex flex-col gap-4 animate-scale-in">
              {activeSection === 'pickup' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-[#0A2623]/50 font-questrial uppercase tracking-wider">Vendor</span>
                    <span className="text-sm text-[#0A2623] font-questrial font-medium">{listing.vendorName}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-[#0A2623]/50 font-questrial uppercase tracking-wider">Distance</span>
                    <span className="text-sm text-[#0A2623] font-questrial font-medium">{distance}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-[#0A2623]/50 font-questrial uppercase tracking-wider">Window</span>
                    <span className="text-sm text-[#0A2623] font-questrial font-medium">{listing.pickupTime}</span>
                  </div>
                </div>
              )}
              {activeSection === 'vendor' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-[#0A2623]/50 font-questrial uppercase tracking-wider">Name</span>
                    <span className="text-sm text-[#0A2623] font-questrial font-medium">{listing.vendorName}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-[#0A2623]/50 font-questrial uppercase tracking-wider">Rating</span>
                    <div className="flex items-center gap-2">
                      <StarRow value={avgRating} size={13} />
                      <span className="text-sm text-[#0A2623] font-questrial font-medium">
                        {reviewCount > 0 ? `${avgRating.toFixed(1)} (${reviewCount})` : 'No reviews yet'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-questrial text-[#7AD371] font-semibold mt-1">
                    <ShieldCheck size={16} /> Verified Vendor
                  </div>
                  {reviewCount > 0 && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="text-xs font-questrial text-[#7AD371] hover:underline text-left cursor-pointer mt-1"
                    >
                      See all reviews →
                    </button>
                  )}
                </div>
              )}
              {activeSection === 'about' && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[#0A2623]/50 font-questrial uppercase tracking-wider">Description</span>
                  <p className="text-sm text-[#0A2623]/70 font-questrial leading-relaxed whitespace-pre-line">
                    {listing.description || 'No description provided.'}
                  </p>
                </div>
              )}
            </div>
          </aside>

        </div>
      </main>

      {/* Confirm Pickup Drawer (Figma: node-id=112-1692) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-[#0A2623]/40 z-50 backdrop-blur-sm"
            />
            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[450px] bg-[#FFFDF2] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-black/10 bg-white">
                <h2 className="font-questrial text-[24px] font-normal text-[#0A2623]">Confirm Pickup</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-neutral-50 cursor-pointer"
                >
                  <X size={18} className="text-[#0A2623]" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {/* Order detail card block */}
                <div className="bg-white border border-black/10 rounded-[20px] p-[5px] flex items-center gap-4">
                  <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden bg-[#F9F9F9] flex-shrink-0">
                    <img
                      src={getListingImage(listing.name, listing.imageUrl, listing.description)}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <h3 className="font-questrial text-[16px] text-[#0A2623] truncate w-full font-medium">{listing.name}</h3>
                    <span className="font-questrial text-[14px] text-[#0A2623]/70">{listing.vendorName}</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-questrial text-[18px] text-[#0A2623] font-semibold">₦{listing.discountedPrice.toLocaleString()}</span>
                      <span className="font-questrial text-[14px] text-[#0A2623]/30 line-through">₦{listing.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex flex-col gap-3">
                  <span className="font-questrial text-[14px] text-[#0A2623]/70 font-medium">Quantity to Claim</span>
                  <div className="flex items-center gap-4 bg-white border border-black/10 rounded-full p-2 w-fit">
                    <button
                      onClick={() => setClaimQty(q => Math.max(1, q - 1))}
                      disabled={claimQty <= 1}
                      className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 cursor-pointer font-questrial"
                    >
                      -
                    </button>
                    <span className="font-questrial text-[18px] text-[#0A2623] w-6 text-center font-medium">{claimQty}</span>
                    <button
                      onClick={() => setClaimQty(q => Math.min(listing.quantity, q + 1))}
                      disabled={claimQty >= listing.quantity}
                      className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 cursor-pointer font-questrial"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[12px] font-questrial text-[#0A2623]/40">
                    {listing.quantity} portions available
                  </span>
                </div>

                <div className="h-[1px] bg-black/10 w-full" />

                {/* Bill calculations */}
                <div className="flex flex-col gap-4">
                  <span className="font-questrial text-[14px] text-[#0A2623]/70 font-medium">Checkout Summary</span>
                  <div className="flex flex-col gap-3 bg-white border border-black/10 rounded-[15px] p-5">
                    <div className="flex items-center justify-between text-sm font-questrial text-[#0A2623]/70">
                      <span>Original Price Total ({claimQty}x)</span>
                      <span className="line-through">₦{(claimQty * listing.originalPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-questrial text-[#0A2623]/70">
                      <span>Discounted Total</span>
                      <span>₦{(claimQty * listing.discountedPrice).toLocaleString()}</span>
                    </div>
                    <div className="h-[1px] bg-black/5 w-full" />
                    <div className="flex items-center justify-between text-sm font-questrial text-[#28A745] font-semibold">
                      <span>You Save</span>
                      <span>₦{(claimQty * (listing.originalPrice - listing.discountedPrice)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Payment CTA */}
              <div className="p-6 border-t border-black/10 bg-white flex flex-col gap-4">
                <button
                  onClick={handleConfirmClaim}
                  disabled={claiming}
                  className="w-full h-12 rounded-full bg-[#0F3934] text-white hover:bg-[#0A2623] font-questrial text-[16px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Claim...</span>
                    </>
                  ) : (
                    <span>Pay ₦{(claimQty * listing.discountedPrice).toLocaleString()} & Claim</span>
                  )}
                </button>
                {claimError && (
                  <p className="text-center font-questrial text-xs text-[#EF4444]">{claimError}</p>
                )}
                <span className="text-center font-questrial text-[12px] text-[#0A2623]/40">
                  By claiming, you agree to pick up within the scheduled window.
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* See All Reviews Modal */}
      <AnimatePresence>
        {showAllReviews && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllReviews(false)}
              className="fixed inset-0 bg-[#0A2623]/40 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFDF2] rounded-t-[24px] shadow-2xl max-h-[85vh] flex flex-col md:max-w-[520px] md:mx-auto md:left-1/2 md:-translate-x-1/2 md:rounded-[20px] md:bottom-auto md:top-1/2 md:-translate-y-1/2"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-black/10">
                <div className="flex flex-col gap-1">
                  <h2 className="font-questrial text-[20px] text-[#0A2623] font-medium">All Reviews</h2>
                  <div className="flex items-center gap-2">
                    <StarRow value={avgRating} size={14} />
                    <span className="font-questrial text-[14px] text-[#0A2623]/60">
                      {avgRating.toFixed(1)} · {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllReviews(false)}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-neutral-100 cursor-pointer flex-shrink-0"
                >
                  <X size={18} className="text-[#0A2623]" />
                </button>
              </div>

              {/* Scrollable review list */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <span className="text-4xl">⭐</span>
                    <p className="font-questrial text-[#0A2623]/50">No reviews yet for this vendor.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.$id} className="bg-white border border-black/10 rounded-[14px] p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7AD371]/20 flex items-center justify-center text-[#0F3934] font-questrial font-semibold">
                            {(review.buyerId || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <StarRow value={review.rating || 0} size={14} />
                            <span className="text-[11px] text-[#0A2623]/40 font-questrial">
                              {new Date(review.$createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#0A2623]/30 font-questrial text-right shrink-0">{review.listingName}</span>
                      </div>
                      {review.remark ? (
                        <p className="font-questrial text-[15px] text-[#0A2623]/80 leading-relaxed">{review.remark}</p>
                      ) : (
                        <p className="font-questrial text-[13px] text-[#0A2623]/30 italic">No written review</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListingDetailPage;
