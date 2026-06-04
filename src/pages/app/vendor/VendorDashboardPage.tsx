import { Package, Plus, BadgeCheck, Clock, Flame, ChevronRight, Utensils, Coins, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import type { Listing } from '../../../services/listings.service';
import { getVendorListings, getListingImage } from '../../../services/listings.service';
import type { Order } from '../../../services/orders.service';
import { getVendorOrders } from '../../../services/orders.service';

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const getTimeLeft = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
};

export default function VendorDashboardPage() {
  const { user } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([getVendorListings(user.id), getVendorOrders(user.id)])
      .then(([ls, os]) => { setListings(ls); setOrders(os); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const activeListings = listings.filter(l => l.status === 'active');
  const totalClaims = listings.reduce((s, l) => s + (l.claimsUsed ?? 0), 0);
  const totalEarnings = orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.totalPaid ?? 0), 0);
  const ratedOrders = orders.filter(o => o.rating != null);
  const avgRating = ratedOrders.length > 0
    ? (ratedOrders.reduce((s, o) => s + (o.rating ?? 0), 0) / ratedOrders.length).toFixed(1)
    : '—';

  return (
    <div className="p-8 max-w-[1200px] mx-auto flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-questrial text-[32px] text-[#0A2623]">Home</h1>
          <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.6)] mt-1">
            Welcome back, <span className="text-[#0F3934] font-semibold">{user?.name?.split(' ')[0]}</span> 👋
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/verify-business"
            className="flex items-center gap-2 h-10 px-5 rounded-full border border-black/10 bg-white font-questrial text-sm font-semibold text-[rgba(10,38,35,0.7)] hover:border-[#7AD371] hover:text-[#0F3934] transition-all"
          >
            <BadgeCheck size={15} className="text-[#0F3934]" /> Verify Business
          </Link>
          <Link to="/vendor/post-listing" className="flex items-center gap-2 h-10 px-5 rounded-full bg-[#0F3934] text-white font-questrial text-sm font-semibold hover:bg-[#0A2623] transition-all">
            <Plus size={15} /> Post Listing
          </Link>
        </div>
      </div>

      {/* Stats (Figma home2.html matching styling) */}
      {loading ? (
        <div className="grid grid-cols-3 gap-5">
          {[0, 1, 2].map(i => <div key={i} className="bg-white rounded-[20px] h-[160px] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Meals Saved Stat */}
          <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 md:p-8 flex items-end justify-between shadow-[0_1px_4px_rgba(10,38,35,0.06)]">
            <div className="flex flex-col gap-6 flex-1">
              <div className="w-[60px] h-[60px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
                <Utensils size={24} className="text-[#0A2623]" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.7)]">Meal saved</p>
                <p className="font-questrial text-[32px] text-[#0A2623] font-semibold leading-none">{totalClaims}</p>
              </div>
            </div>
            <div className="px-3 py-2 rounded-[10px] border border-[#28A745]/10 bg-[#28A745]/10 text-[#28A745] font-questrial text-[14px] font-semibold">
              +{Math.min(totalClaims, 99)} total
            </div>
          </div>

          {/* Earnings Stat */}
          <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 md:p-8 flex items-end justify-between shadow-[0_1px_4px_rgba(10,38,35,0.06)]">
            <div className="flex flex-col gap-6 flex-1">
              <div className="w-[60px] h-[60px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
                <Coins size={24} className="text-[#0A2623]" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.7)]">Earnings</p>
                <p className="font-questrial text-[32px] text-[#0A2623] font-semibold leading-none">
                  {totalEarnings >= 1000 ? `₦${(totalEarnings / 1000).toFixed(1)}K+` : `₦${totalEarnings}`}
                </p>
              </div>
            </div>
            <div className="px-3 py-2 rounded-[10px] border border-[#28A745]/10 bg-[#28A745]/10 text-[#28A745] font-questrial text-[14px] font-semibold">
              +₦{totalEarnings >= 1000 ? `${(totalEarnings / 1000).toFixed(0)}K` : totalEarnings}
            </div>
          </div>

          {/* Ratings Stat */}
          <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 md:p-8 flex items-end justify-between shadow-[0_1px_4px_rgba(10,38,35,0.06)]">
            <div className="flex flex-col gap-6 flex-1">
              <div className="w-[60px] h-[60px] rounded-full bg-[#F9F9F9] flex items-center justify-center">
                <Star size={24} className="text-[#0A2623]" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.7)]">Ratings</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="font-questrial text-[32px] text-[#0A2623] font-semibold leading-none">{avgRating}</p>
                  <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.5)]">({ratedOrders.length})</p>
                </div>
              </div>
            </div>
            <div className="px-3 py-2 rounded-[10px] border border-[#28A745]/10 bg-[#28A745]/10 text-[#28A745] font-questrial text-[14px] font-semibold">
              {ratedOrders.length} reviews
            </div>
          </div>
        </div>
      )}

      {/* Active Listings (Figma home2.html matching styling) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-questrial text-[24px] text-[rgba(10,38,35,0.7)] font-normal">Your Active Listings</h2>
            <span className="w-6 h-6 rounded-full bg-[#7AD371] text-white font-questrial text-sm flex items-center justify-center font-semibold">
              {activeListings.length}
            </span>
          </div>
          <Link to="/vendor/listings" className="font-questrial text-[16px] text-[#7AD371] font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[0, 1, 2, 3].map(i => <div key={i} className="bg-white rounded-[20px] w-[320px] h-[280px] flex-shrink-0 animate-pulse" />)}
          </div>
        ) : activeListings.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-black/10 p-12 text-center">
            <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.5)]">No active listings yet.</p>
            <Link to="/vendor/post-listing" className="mt-4 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#0F3934] text-white font-questrial text-sm">
              <Plus size={15} /> Post your first listing
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {activeListings.slice(0, 8).map(listing => {
              const claimsTotal = listing.quantity + listing.claimsUsed;
              const timeLeft = listing.expiresAt ? getTimeLeft(listing.expiresAt) : listing.pickupTime;
              return (
                <Link
                  key={listing.$id}
                  to={`/vendor/listings/${listing.$id}`}
                  className="flex-shrink-0 w-[320px] bg-white rounded-[20px] border border-black/10 overflow-hidden hover:-translate-y-0.5 transition-all p-1.5 flex flex-col"
                  style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}
                >
                  {/* Image */}
                  <div className="h-[120px] w-full bg-[#F0F9EF] overflow-hidden rounded-t-[16px]">
                    <img
                      src={getListingImage(listing.name, listing.imageUrl, listing.description)}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Body */}
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="font-questrial text-[16px] text-[#0A2623] font-semibold truncate">{listing.name}</p>
                        <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.3)] line-through">₦{listing.originalPrice.toLocaleString()}</p>
                      </div>
                      <p className="font-questrial text-[24px] text-[#0A2623] font-semibold">₦{listing.discountedPrice.toLocaleString()}</p>
                    </div>
                    <div className="h-[1px] bg-black/10" />
                    <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)] mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-[rgba(10,38,35,0.7)]" />
                        <span className="font-questrial text-[14px]">{timeLeft}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flame size={16} className="text-[#28A745]" />
                        <span className="font-questrial text-[16px] font-semibold text-[#0A2623]">
                          {listing.claimsUsed}/{claimsTotal} claims
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 flex flex-col gap-4 shadow-[0_1px_4px_rgba(10,38,35,0.06)]">
        <h2 className="font-questrial text-[20px] text-[#0A2623] font-semibold">Recent Claims</h2>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => <div key={i} className="h-12 bg-[#F9F9F9] rounded-xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center">
            <Package className="mx-auto text-[rgba(10,38,35,0.3)] mb-2" size={32} />
            <p className="font-questrial text-[14px] text-[rgba(10,38,35,0.5)]">No claims yet</p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.06]">
            {orders.slice(0, 5).map(order => (
              <div key={order.$id} className="flex items-center gap-3 py-3 hover:bg-neutral-50/50 px-2 rounded-xl transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#7AD371]/15 flex items-center justify-center text-[#0F3934] font-questrial text-sm font-semibold flex-shrink-0">
                  {(order.buyerName ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-questrial text-[14px] text-[#0A2623] truncate">
                    <span className="font-semibold">{order.buyerName ?? 'Customer'}</span> claimed {order.listingName}
                  </p>
                  <p className="font-questrial text-[12px] text-[rgba(10,38,35,0.5)]">{timeAgo(order.claimedAt)}</p>
                </div>
                <span className="font-questrial text-[14px] text-[#28A745] font-semibold flex-shrink-0">
                  +₦{order.totalPaid.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
