import { CheckCircle2, Clock, MapPin, Package, ShoppingBag, X, Star, ThumbsUp, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import FoodCard from '../../components/FoodCard';
import { useApp } from '../../context/AppContext';
import type { Listing } from '../../services/listings.service';
import { getListings, getListingById } from '../../services/listings.service';
import type { Order } from '../../services/orders.service';
import { getUserOrders, updateOrderStatus, rateOrder } from '../../services/orders.service';

type TabKey = 'Active' | 'Completed' | 'Expired';

const STATUS_BADGE: Record<Order['status'], { label: string; textColor: string; bg: string }> = {
  pending:   { label: 'Awaiting Pickup',  textColor: 'text-[#F59E0B]', bg: 'bg-[#F59E0B12]' },
  confirmed: { label: 'Confirmed',        textColor: 'text-[#22C55E]', bg: 'bg-[#22C55E12]' },
  completed: { label: 'Picked Up ✓',     textColor: 'text-[#22C55E]', bg: 'bg-[#22C55E12]' },
  expired:   { label: 'Expired',          textColor: 'text-[#EF4444]', bg: 'bg-[#EF444412]' },
  cancelled: { label: 'Cancelled',        textColor: 'text-[#EF4444]', bg: 'bg-[#EF444412]' },
};

const OrdersPage = () => {
  const { user, toggleSave, isSaved } = useApp();
  const [orders, setOrders]             = useState<Order[]>([]);
  const [nearbyListings, setNearby]     = useState<Listing[]>([]);
  const [loading, setLoading]           = useState(true);
  const [nearbyLoading, setNearbyLoad]  = useState(true);
  const [selectedOrder, setSelected]    = useState<Order | null>(null);
  const [activeTab, setActiveTab]       = useState<TabKey>('Active');
  const [confirmingId, setConfirmingId]   = useState('');
  const [showRateModal, setShowRateModal] = useState(false);
  const [rating, setRating]               = useState(3);
  const [remark, setRemark]               = useState('');
  const [isRatingSubmit, setIsRatingSubmit] = useState(false);
  const [fetchedListing, setListingDetails] = useState<Listing | null>(null);
  const [ratingSuccess, setRatingSuccess]   = useState(false);

  // Ignore a listing fetched for a previously selected order
  const listingDetails = fetchedListing && selectedOrder && fetchedListing.$id === selectedOrder.listingId ? fetchedListing : null;

  useEffect(() => {
    if (!selectedOrder) return;
    getListingById(selectedOrder.listingId)
      .then(setListingDetails)
      .catch(() => setListingDetails(null));
  }, [selectedOrder]);

  useEffect(() => {
    if (!user?.id) return;
    getUserOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    getListings(6)
      .then(setNearby)
      .catch(() => setNearby([]))
      .finally(() => setNearbyLoad(false));
  }, []);

  const filtered = orders.filter((o) => {
    if (activeTab === 'Active')    return ['pending', 'confirmed'].includes(o.status);
    if (activeTab === 'Completed') return o.status === 'completed';
    return ['expired', 'cancelled'].includes(o.status);
  });

  const handleConfirmPickup = async () => {
    if (!selectedOrder) return;
    setConfirmingId(selectedOrder.$id);
    try {
      await updateOrderStatus(selectedOrder.$id, 'completed');
      setOrders((prev) => prev.map((o) =>
        o.$id === selectedOrder.$id ? { ...o, status: 'completed' } : o
      ));
      setSelected(null);
    } catch { setSelected(null); }
    finally { setConfirmingId(''); }
  };

  const handleRateSubmit = async () => {
    if (!selectedOrder) return;
    setIsRatingSubmit(true);
    try {
      await rateOrder(selectedOrder.$id, rating, remark);
      setOrders((prev) => prev.map((o) =>
        o.$id === selectedOrder.$id ? { ...o, rating, remark } : o
      ));
      setSelected((prev) => prev ? { ...prev, rating, remark } : null);
    } catch (err) {
      console.warn('Appwrite rating failed, updating locally:', err);
      setOrders((prev) => prev.map((o) =>
        o.$id === selectedOrder.$id ? { ...o, rating, remark } : o
      ));
      setSelected((prev) => prev ? { ...prev, rating, remark } : null);
    } finally {
      setIsRatingSubmit(false);
      setRatingSuccess(true);
      // Auto-close after 1.5 s
      setTimeout(() => {
        setShowRateModal(false);
        setRatingSuccess(false);
        setRemark('');
      }, 1500);
    }
  };

  const tabCount = (tab: TabKey) => orders.filter((o) => {
    if (tab === 'Active')    return ['pending', 'confirmed'].includes(o.status);
    if (tab === 'Completed') return o.status === 'completed';
    return ['expired', 'cancelled'].includes(o.status);
  }).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF2] pb-24 md:pb-0">
      <main className="flex-1 py-10 px-4 md:px-6">
        {selectedOrder ? (
          <div className="max-w-[400px] w-full mx-auto flex flex-col gap-6">
            
            {/* Header Row */}
            <div className="flex items-center gap-[16px] w-full mb-[12px]">
              <button
                onClick={() => setSelected(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 bg-white hover:bg-neutral-50 cursor-pointer"
              >
                <ArrowLeft size={18} className="text-[#0A2623]" />
              </button>
              <span className="font-questrial text-[16px] text-[#0A2623]/50">
                Order #{selectedOrder.$id.substring(0, 6).toUpperCase()}
              </span>
            </div>

            {/* Card 1: Summary Card */}
            <div className="bg-white border border-black/10 rounded-[20px] p-[20px] flex flex-col gap-[20px] w-full shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <h3 className="font-questrial text-[20px] text-[#0A2623] font-medium truncate w-full" title={selectedOrder.listingName}>
                    {selectedOrder.listingName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-questrial text-[16px] text-[#0A2623]/30 line-through">
                      ₦{selectedOrder.originalTotal.toLocaleString()}
                    </span>
                    <span className="font-questrial text-[20px] text-[#0A2623] font-semibold">
                      ₦{selectedOrder.totalPaid.toLocaleString()}
                    </span>
                    <span className="font-questrial text-[14px] text-[#0A2623]/50 ml-1">
                      x{listingDetails ? Math.round(selectedOrder.totalPaid / listingDetails.discountedPrice) : 1}
                    </span>
                  </div>
                </div>
                
                {/* Status Tag */}
                {selectedOrder.status === 'completed' ? (
                  <div className="px-3 py-1.5 rounded-full bg-[#28A745]/10 text-[#28A745] text-[12px] font-questrial font-medium whitespace-nowrap">
                    Pickup Completed
                  </div>
                ) : ['expired', 'cancelled'].includes(selectedOrder.status) ? (
                  <div className="px-3 py-1.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-[12px] font-questrial font-medium whitespace-nowrap">
                    Pickup Window Missed
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-full bg-[#0A2623]/5 text-[#0A2623] text-[12px] font-questrial font-medium whitespace-nowrap">
                    Pickup In Progress
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-black/10 w-full" />

              {/* Bottom Meta in Card 1 */}
              <div className="flex items-center gap-2.5 text-[#0A2623]/70 font-questrial text-[14px]">
                {selectedOrder.status === 'completed' ? (
                  <>
                    <CheckCircle2 size={16} className="text-[#28A745] flex-shrink-0" />
                    <span>Completed on {new Date(selectedOrder.claimedAt).toLocaleDateString()}</span>
                  </>
                ) : ['expired', 'cancelled'].includes(selectedOrder.status) ? (
                  <>
                    <span className="text-[#EF4444] font-semibold">Expired</span>
                    <span>window closed</span>
                  </>
                ) : (
                  <>
                    <Clock size={16} strokeWidth={1.5} className="text-[#0A2623]/70 flex-shrink-0" />
                    <span>Pickup: {selectedOrder.pickupTime}</span>
                  </>
                )}
              </div>
            </div>

            {/* Card 2: Pickup details */}
            <div className="bg-white border border-black/10 rounded-[20px] p-[20px] flex flex-col gap-4 w-full shadow-sm">
              <h4 className="font-questrial text-[14px] text-[#0A2623]/50 uppercase tracking-wide">Pickup Location</h4>
              
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F9F9F9] border border-black/10 flex items-center justify-center text-[#EF4444] flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-questrial text-sm text-[#0A2623] font-medium truncate">{selectedOrder.vendorName}</p>
                  <p className="font-questrial text-xs text-[#0A2623]/70">{selectedOrder.distance}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F9F9F9] border border-black/10 flex items-center justify-center text-[#28A745] flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="font-questrial text-xs text-[#0A2623]/50">Pickup Window</p>
                  <p className="font-questrial text-sm text-[#0A2623] font-medium">{selectedOrder.pickupTime}</p>
                </div>
              </div>
            </div>

            {/* Card 3: Progress Tracker */}
            <div className="bg-white border border-black/10 rounded-[20px] p-[20px] flex flex-col gap-6 w-full shadow-sm">
              <h4 className="font-questrial text-[14px] text-[#0A2623]/50 uppercase tracking-wide">Timeline Tracker</h4>

              <div className="flex flex-col relative pl-8 gap-8 ml-[10px]">
                
                {/* Vertical line connector */}
                <div className="absolute left-[7px] top-[10px] bottom-[10px] w-[2px]">
                  {selectedOrder.status === 'completed' ? (
                    <div className="h-full bg-[#28A745]" />
                  ) : ['expired', 'cancelled'].includes(selectedOrder.status) ? (
                    <div className="h-full bg-[#EF4444]/40" />
                  ) : (
                    <div className="h-full border-l-2 border-dashed border-[#0A2623]/20" />
                  )}
                </div>

                {/* Step 1: Order Claimed */}
                <div className="relative">
                  <div className="absolute left-[-32px] top-[3px] w-4.5 h-4.5 rounded-full bg-[#28A745] border-4 border-white flex items-center justify-center shadow-sm z-10" />
                  <div className="flex flex-col">
                    <span className="font-questrial text-sm text-[#0A2623] font-medium">Order Claimed</span>
                    <span className="font-questrial text-xs text-[#0A2623]/50">Meal successfully reserved</span>
                  </div>
                </div>

                {/* Step 2: Order Picked Up */}
                <div className="relative">
                  <div className={`absolute left-[-32px] top-[3px] w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 ${
                    selectedOrder.status === 'completed' 
                      ? 'bg-[#28A745]' 
                      : ['expired', 'cancelled'].includes(selectedOrder.status)
                      ? 'bg-[#EF4444]' 
                      : 'bg-neutral-200'
                  }`} />
                  <div className="flex flex-col">
                    <span className={`font-questrial text-sm ${
                      selectedOrder.status === 'completed' 
                        ? 'text-[#28A745] font-medium' 
                        : ['expired', 'cancelled'].includes(selectedOrder.status)
                        ? 'text-[#EF4444] font-medium'
                        : 'text-[#0A2623]/40'
                    }`}>
                      {['expired', 'cancelled'].includes(selectedOrder.status) ? 'Pickup Window Missed' : 'Order Picked Up'}
                    </span>
                    <span className="font-questrial text-xs text-[#0A2623]/50">
                      {selectedOrder.status === 'completed' 
                        ? 'Collected rescued surplus food' 
                        : ['expired', 'cancelled'].includes(selectedOrder.status)
                        ? 'Did not pick up in time' 
                        : 'Confirm collection at vendor location'
                      }
                    </span>
                  </div>
                </div>

                {/* Step 3: Order Completed */}
                <div className="relative">
                  <div className={`absolute left-[-32px] top-[3px] w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 ${
                    selectedOrder.status === 'completed' 
                      ? 'bg-[#28A745]' 
                      : ['expired', 'cancelled'].includes(selectedOrder.status)
                      ? 'bg-[#EF4444]/40' 
                      : 'bg-neutral-200'
                  }`} />
                  <div className="flex flex-col">
                    <span className={`font-questrial text-sm ${
                      selectedOrder.status === 'completed' 
                        ? 'text-[#28A745] font-medium' 
                        : 'text-[#0A2623]/40'
                    }`}>
                      Order Completed
                    </span>
                    <span className="font-questrial text-xs text-[#0A2623]/50">
                      {selectedOrder.status === 'completed' ? 'Rescued surplus complete!' : 'Transaction details closed'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Savings callout */}
            {selectedOrder.originalTotal - selectedOrder.totalPaid > 0 && (
              <div className="p-4 rounded-xl bg-[#7AD371]/10 border border-[#7AD371]/20 w-full text-center">
                <p className="font-questrial text-xs text-brand-secondary">
                  🌱 You saved <strong>₦{(selectedOrder.originalTotal - selectedOrder.totalPaid).toLocaleString()}</strong> on this order, helping reduce food waste!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full mt-2">
              {selectedOrder.status === 'completed' ? (
                selectedOrder.rating !== undefined && selectedOrder.rating !== null ? (
                  <div className="w-full text-center p-4 rounded-2xl bg-neutral-100/80 font-questrial text-sm text-[#0A2623] border border-black/5 flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-text-primary text-[14px]">Your Rating:</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={star <= selectedOrder.rating! ? 'text-[#7AD371] fill-[#7AD371]' : 'text-black/10'} />
                        ))}
                      </div>
                    </div>
                    {selectedOrder.remark && (
                      <p className="text-xs text-[#0A2623]/70 italic font-light px-2 mt-0.5">
                        "{selectedOrder.remark}"
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRateModal(true)}
                    className="w-full h-12 rounded-full bg-[#0F3934] text-white hover:bg-[#0A2623] transition-all font-questrial text-[16px] font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ThumbsUp size={16} />
                    <span>Rate your experience</span>
                  </button>
                )
              ) : ['expired', 'cancelled'].includes(selectedOrder.status) ? (
                <div className="w-full text-center p-3 rounded-full bg-neutral-100 font-questrial text-sm text-[#0A2623]/40 border border-black/5">
                  Pickup Window Closed
                </div>
              ) : (
                <button
                  onClick={handleConfirmPickup}
                  disabled={!!confirmingId}
                  className="w-full h-12 rounded-full bg-[#0F3934] text-white hover:bg-[#0A2623] font-questrial text-[16px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {confirmingId ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Pickup...</span>
                    </>
                  ) : (
                    <span>Confirm Pickup</span>
                  )}
                </button>
              )}
            </div>

          </div>
        ) : (
          <div className="max-w-[1280px] mx-auto flex flex-col gap-12">

            {/* ── Orders ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="font-questrial text-3xl text-text-primary">Your Orders</h1>
                <p className="font-questrial text-base text-text-secondary mt-1">Track and manage all your claimed meals</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-0 border-b border-border overflow-x-auto scrollbar-none select-none" style={{ scrollbarWidth: 'none' }}>
                {(['Active', 'Completed', 'Expired'] as const).map((tab) => {
                  const count = tabCount(tab);
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-5 py-3.5 font-questrial text-sm transition-all border-b-2 -mb-px ${
                        activeTab === tab
                          ? 'border-[#0F3934] text-[#0F3934]'
                          : 'border-transparent text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {tab}
                      {count > 0 && (
                        <span className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-[11px] font-questrial px-1.5 ${
                          activeTab === tab ? 'bg-[#0F3934] text-white' : 'bg-[#F0F4F1] text-text-muted'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Order list */}
              {loading ? (
                <div className="flex flex-col divide-y divide-border">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-5 py-5">
                      <div className="w-[100px] h-[70px] rounded-xl skeleton flex-shrink-0" />
                      <div className="flex-1 flex flex-col gap-2.5">
                        <div className="h-4 w-1/2 skeleton rounded-full" />
                        <div className="h-3 w-1/3 skeleton rounded-full" />
                        <div className="h-3 w-1/4 skeleton rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-5 text-center border border-border rounded-3xl bg-white">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-border">
                    {activeTab === 'Active'
                      ? <Package size={24} className="text-text-muted" />
                      : <CheckCircle2 size={24} className="text-text-muted" />
                    }
                  </div>
                  <div>
                    <p className="font-questrial text-lg text-text-primary mb-1">
                      No {activeTab.toLowerCase()} orders
                    </p>
                    <p className="font-questrial text-sm text-text-secondary">
                      {activeTab === 'Active'
                        ? 'Browse listings and claim a meal to get started'
                        : activeTab === 'Completed'
                        ? 'Your completed pickups will appear here'
                        : 'Expired orders will show up here'
                      }
                    </p>
                  </div>
                  {activeTab === 'Active' && (
                    <Link to="/listings" className="btn-primary !h-10 !px-7 !text-sm">
                      Browse Food
                    </Link>
                  )}
                </div>
              ) : (
                <div className="section-card !p-0 overflow-hidden divide-y divide-border">
                  {filtered.map((order) => {
                    const badge = STATUS_BADGE[order.status];
                    return (
                      <button
                        key={order.$id}
                        onClick={() => setSelected(order)}
                        className="w-full flex items-center gap-5 px-6 py-4 text-left hover:bg-bg transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-[100px] h-[68px] rounded-xl overflow-hidden flex-shrink-0 bg-[#F0F4F1]">
                          {order.listingImageUrl
                            ? <img src={order.listingImageUrl} alt={order.listingName} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                          }
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <p className="font-questrial text-sm text-text-primary truncate">{order.listingName}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-questrial text-base text-text-primary">₦{order.totalPaid.toLocaleString()}</span>
                            <span className="font-questrial text-sm text-text-muted line-through">₦{order.originalTotal.toLocaleString()}</span>
                          </div>
                          <span className={`inline-flex items-center gap-1 font-questrial text-xs ${badge.textColor}`}>
                            {badge.label}
                          </span>
                        </div>

                        {/* Right meta */}
                        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="flex items-center gap-1 font-questrial text-xs text-text-muted">
                            <MapPin size={11} /> {order.distance}
                          </span>
                          <span className="flex items-center gap-1 font-questrial text-xs text-text-muted">
                            <Clock size={11} /> {order.pickupTime}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Available Near You ─────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-questrial text-2xl text-text-primary">Available Near You</h2>
                  <p className="font-questrial text-sm text-text-secondary mt-0.5">Fresh surplus meals ready to claim</p>
                </div>
                <Link to="/listings" className="font-questrial text-sm text-brand-secondary hover:underline hidden sm:inline">
                  View all →
                </Link>
              </div>

              {nearbyLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-2xl bg-white border border-border overflow-hidden">
                      <div className="h-44 skeleton" />
                      <div className="p-4 flex flex-col gap-3">
                        <div className="h-3 w-24 skeleton rounded-full" />
                        <div className="h-4 w-3/4 skeleton rounded-full" />
                        <div className="h-10 skeleton rounded-full mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : nearbyListings.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 border border-border rounded-3xl bg-white text-center">
                  <ShoppingBag size={28} className="text-text-muted" />
                  <p className="font-questrial text-sm text-text-secondary">No listings available right now — check back soon!</p>
                  <Link to="/listings" className="font-questrial text-sm text-brand-secondary hover:underline">Browse all</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nearbyListings.map((item) => (
                    <FoodCard
                      key={item.$id}
                      id={item.$id}
                      name={item.name}
                      originalPrice={item.originalPrice}
                      discountedPrice={item.discountedPrice}
                      timeLeft={item.pickupTime}
                      claimsUsed={item.claimsUsed}
                      claimsTotal={item.quantity + item.claimsUsed}
                      distance={item.distance ?? ''}
                      vendorName={item.vendorName}
                      imageUrl={item.imageUrl}
                      isSaved={isSaved(item.$id)}
                      onSave={(e) => { e.preventDefault(); toggleSave(item.$id); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Rate Experience Modal (Figma 179-825) ────────────────── */}
      <AnimatePresence>
        {showRateModal && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-[#0A2623]/40 z-[100] backdrop-blur-[2px]" onClick={() => setShowRateModal(false)} />
            
            {/* Modal Container */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-white rounded-[20px] p-6 sm:p-[40px] border border-black/10 z-[110] flex flex-col gap-6 shadow-2xl animate-scale-in">

              {ratingSuccess ? (
                /* ── Success state ─────────────────────────────── */
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#7AD37120] flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-[#7AD371]" />
                  </div>
                  <h2 className="font-questrial text-[22px] text-[#0A2623]">Thank you! 🎉</h2>
                  <p className="font-questrial text-sm text-[#0A2623]/60">Your feedback has been submitted.</p>
                </div>
              ) : (
                <>
              {/* Cancel Button */}
              <button 
                onClick={() => setShowRateModal(false)} 
                className="absolute right-4 top-4 sm:right-6 sm:top-6 text-[#0A2623]/50 hover:text-[#0A2623] cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Title Block */}
              <div className="flex flex-col items-center text-center gap-4">
                {/* Thumbs Up Icon Block (83x100) */}
                <div className="w-[60px] h-[72px] sm:w-[84px] sm:h-[100px] flex items-center justify-center text-[#7AD371]">
                  <ThumbsUp className="text-[#7AD371] w-12 h-12 sm:w-16 sm:h-16" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-questrial text-[22px] sm:text-[32px] font-normal leading-[130%] text-[#0A2623]">
                    Rate your experience
                  </h2>
                  <p className="font-questrial text-[14px] sm:text-[16px] text-[#0A2623]/70">
                    Let us know how we did so we can keep improving!
                  </p>
                </div>
              </div>

              {/* Rating Block */}
              <div className="flex flex-col gap-2">
                <span className="font-questrial text-sm sm:text-[16px] text-[#0A2623] font-medium">
                  Rating ({rating}/5)
                </span>
                {/* 5 Stars Row */}
                <div className="flex justify-between items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= rating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-[3px] flex items-center justify-center transition-all cursor-pointer hover:bg-neutral-50"
                      >
                        <Star 
                          className={`w-7 h-7 sm:w-9 sm:h-9 ${isFilled ? 'text-[#7AD371] fill-[#7AD371]' : 'text-black/10'}`} 
                          strokeWidth={1.5}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Input Block */}
              <div className="flex flex-col gap-3">
                <label className="font-questrial text-sm sm:text-[16px] text-[#0A2623] font-medium">
                  Review
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remark"
                  className="w-full h-[100px] sm:h-[150px] p-3 sm:p-[18px_20px] border border-black/10 rounded-[10px] bg-white outline-none resize-none font-questrial text-sm sm:text-[16px] text-[#0A2623] placeholder:text-[#0A2623]/30 focus:border-[#7AD371] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRateSubmit}
                disabled={isRatingSubmit}
                className="w-full h-10 rounded-full bg-[#0F3934] hover:bg-[#0A2623] transition-all text-white font-questrial text-[16px] flex items-center justify-center font-medium cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isRatingSubmit ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
                </>
              )}
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OrdersPage;
