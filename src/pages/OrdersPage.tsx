import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import FoodCard from '../components/FoodCard';
import { X, MapPin, Clock, CheckCircle2, Package, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUserOrders, updateOrderStatus } from '../services/orders.service';
import { getListings } from '../services/listings.service';
import type { Order } from '../services/orders.service';
import type { Listing } from '../services/listings.service';

type TabKey = 'Active' | 'Completed' | 'Expired';

const STATUS_BADGE: Record<Order['status'], { label: string; textColor: string; bg: string }> = {
  pending:   { label: 'Awaiting Pickup',  textColor: 'text-[#F59E0B]', bg: 'bg-[#F59E0B12]' },
  confirmed: { label: 'Confirmed',        textColor: 'text-[#22C55E]', bg: 'bg-[#22C55E12]' },
  completed: { label: 'Picked Up ✓',     textColor: 'text-[#22C55E]', bg: 'bg-[#22C55E12]' },
  expired:   { label: 'Expired',          textColor: 'text-[#EF4444]', bg: 'bg-[#EF444412]' },
  cancelled: { label: 'Cancelled',        textColor: 'text-[#EF4444]', bg: 'bg-[#EF444412]' },
};

const OrdersPage = () => {
  const { user } = useApp();
  const [orders, setOrders]             = useState<Order[]>([]);
  const [nearbyListings, setNearby]     = useState<Listing[]>([]);
  const [loading, setLoading]           = useState(true);
  const [nearbyLoading, setNearbyLoad]  = useState(true);
  const [selectedOrder, setSelected]    = useState<Order | null>(null);
  const [activeTab, setActiveTab]       = useState<TabKey>('Active');
  const [confirmingId, setConfirmingId] = useState('');

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

  const tabCount = (tab: TabKey) => orders.filter((o) => {
    if (tab === 'Active')    return ['pending', 'confirmed'].includes(o.status);
    if (tab === 'Completed') return o.status === 'completed';
    return ['expired', 'cancelled'].includes(o.status);
  }).length;

  return (
    <div className="min-h-screen flex flex-col bg-bg pb-24 md:pb-0">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-12">

          {/* ── Orders ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-questrial text-3xl text-text-primary">Your Orders</h1>
              <p className="font-questrial text-base text-text-secondary mt-1">Track and manage all your claimed meals</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-border">
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Order Detail Slide Panel ──────────────────────────── */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-[#0A2623]/20 z-40 backdrop-blur-[2px]" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white border-l border-border z-50 flex flex-col overflow-y-auto animate-slide-in"
            style={{ boxShadow: '-8px 0 32px rgba(10,38,35,0.12)' }}>

            {/* Panel header */}
            <div className="flex items-center gap-4 px-8 py-6 border-b border-border">
              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-brand-primary bg-white transition-all"
              >
                <X size={16} className="text-text-secondary" />
              </button>
              <h2 className="font-questrial text-xl text-text-primary">Order Details</h2>
            </div>

            <div className="flex flex-col gap-6 px-8 py-6 flex-1">
              {/* Item summary */}
              <div className="flex items-center gap-4 p-4 bg-bg rounded-2xl border border-border">
                <div className="w-[90px] h-[64px] rounded-xl overflow-hidden flex-shrink-0 bg-[#F0F4F1]">
                  {selectedOrder.listingImageUrl
                    ? <img src={selectedOrder.listingImageUrl} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                  }
                </div>
                <div className="flex-1">
                  <p className="font-questrial text-sm text-text-primary mb-1">{selectedOrder.listingName}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-questrial text-base text-text-primary">₦{selectedOrder.totalPaid.toLocaleString()}</span>
                    <span className="font-questrial text-sm text-text-muted line-through">₦{selectedOrder.originalTotal.toLocaleString()}</span>
                  </div>
                  <span className={`font-questrial text-xs ${STATUS_BADGE[selectedOrder.status]?.textColor}`}>
                    {STATUS_BADGE[selectedOrder.status]?.label}
                  </span>
                </div>
              </div>

              {/* Pickup details */}
              <div className="flex flex-col gap-3">
                <h3 className="font-questrial text-sm text-text-muted uppercase tracking-wide">Pickup Details</h3>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg border border-border flex-shrink-0">
                    <MapPin size={18} className="text-[#EF4444]" />
                  </div>
                  <div>
                    <p className="font-questrial text-xs text-text-muted">Vendor</p>
                    <p className="font-questrial text-sm text-text-primary">{selectedOrder.vendorName}</p>
                    <p className="font-questrial text-xs text-text-secondary">{selectedOrder.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg border border-border flex-shrink-0">
                    <Clock size={18} className="text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="font-questrial text-xs text-text-muted">Pickup window</p>
                    <p className="font-questrial text-sm text-text-primary">{selectedOrder.pickupTime}</p>
                  </div>
                </div>
              </div>

              {/* Savings callout */}
              <div className="p-4 rounded-xl bg-[#7AD37112] border border-brand-primary/20">
                <p className="font-questrial text-xs text-brand-secondary">
                  🌱 You saved <strong>₦{(selectedOrder.originalTotal - selectedOrder.totalPaid).toLocaleString()}</strong> on this order, helping reduce food waste!
                </p>
              </div>
            </div>

            {/* Action footer */}
            <div className="px-8 py-6 border-t border-border">
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') ? (
                <button
                  onClick={handleConfirmPickup}
                  disabled={!!confirmingId}
                  className="btn-primary w-full !h-12 disabled:opacity-70"
                >
                  {confirmingId
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Confirming…</>
                    : <><CheckCircle2 size={16} /> Confirm Pickup</>
                  }
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 h-12 rounded-full bg-[#F0F4F1] font-questrial text-sm text-text-secondary">
                  <CheckCircle2 size={16} />
                  {STATUS_BADGE[selectedOrder.status]?.label}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
};

export default OrdersPage;
