import { ArrowUpRight, CheckCheck, CircleX, Clock, Flame, Plus, Utensils, Coins, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import type { Listing } from '../../../services/listings.service';
import { getVendorListings, getListingImage } from '../../../services/listings.service';
import type { Order } from '../../../services/orders.service';
import { getVendorOrders } from '../../../services/orders.service';

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
  const [weeklyKg, setWeeklyKg] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([getVendorListings(user.id), getVendorOrders(user.id)])
      .then(([ls, os]) => {
        setListings(ls);
        setOrders(os);
        // Rough estimate: ~0.5kg of food per portion claimed in the last 7 days
        const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
        const portions = os
          .filter(o => o.status !== 'cancelled' && new Date(o.claimedAt).getTime() >= weekAgo)
          .reduce((n, o) => n + (o.quantity ?? 1), 0);
        setWeeklyKg(Math.round(portions * 0.5 * 10) / 10);
      })
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
    <div className="p-8 max-w-[1104px] mx-auto flex flex-col gap-8">
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


      {/* Weekly impact */}
      <div className="relative bg-white rounded-[20px] border border-black/[0.06] px-8 md:px-16 py-9 overflow-hidden min-h-[240px] flex items-center shadow-[0_1px_4px_rgba(10,38,35,0.06)]">
        <div className="relative z-10 flex flex-col gap-6 max-w-[331px]">
          <div className="flex flex-col gap-2">
            <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.7)]">Your Impact 🌱</p>
            <p className="font-questrial text-[24px] text-[#0A2623] leading-snug">
              You've prevented <span className="text-[#7AD371]">{weeklyKg}kg</span> of food waste this week
            </p>
          </div>
          <Link to="/vendor/impact" className="self-start flex items-center gap-2 h-10 px-6 rounded-full bg-[#0F3934] text-white font-questrial text-[16px] hover:bg-[#0A2623] transition-all">
            View Full <ArrowUpRight size={16} />
          </Link>
        </div>
        <img src="/images/vendor/impact-veg.png" alt="" className="hidden md:block absolute right-10 bottom-0 w-[396px] max-w-[45%]" />
      </div>

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
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[0, 1, 2, 3].map(i => <div key={i} className="bg-white rounded-[20px] w-[320px] h-[280px] flex-shrink-0 animate-pulse" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-black/10 p-12 text-center">
            <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.5)]">No active listings yet.</p>
            <Link to="/vendor/post-listing" className="mt-4 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#0F3934] text-white font-questrial text-sm">
              <Plus size={15} /> Post your first listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.slice(0, 6).map(listing => {
              const claimsTotal = listing.quantity + listing.claimsUsed;
              const timeLeft = listing.expiresAt ? getTimeLeft(listing.expiresAt) : listing.pickupTime;
              return (
                <Link
                  key={listing.$id}
                  to={`/vendor/listings/${listing.$id}`}
                  className="bg-white rounded-[20px] border border-black/10 overflow-hidden hover:-translate-y-0.5 transition-all p-1.5 flex flex-col"
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
                      <ListingStatus status={listing.status} timeLeft={timeLeft} />
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

    </div>
  );
}

const ListingStatus = ({ status, timeLeft }: { status: Listing['status']; timeLeft: string }) => {
  if (status === 'sold_out') {
    return (
      <div className="flex items-center gap-1.5 text-[#28A745]">
        <CheckCheck size={16} />
        <span className="font-questrial text-[14px]">Claimed</span>
      </div>
    );
  }
  if (status === 'expired' || timeLeft === 'Expired') {
    return (
      <div className="flex items-center gap-1.5 text-[#EF4444]">
        <CircleX size={16} />
        <span className="font-questrial text-[14px]">Expired</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <Clock size={16} className="text-[rgba(10,38,35,0.7)]" />
      <span className="font-questrial text-[14px]">{timeLeft}</span>
    </div>
  );
};
