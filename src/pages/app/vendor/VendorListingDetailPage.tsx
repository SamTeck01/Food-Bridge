import { ArrowLeft, MoreVertical, Star, Flame, Clock, CheckCheck, XCircle, Eye, Coins } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getListingById, getListingImage, deleteListing } from '../../../services/listings.service';
import type { Listing } from '../../../services/listings.service';
import { getListingOrders, updateOrderStatus } from '../../../services/orders.service';
import type { Order } from '../../../services/orders.service';

const getTimeLeft = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
};

export default function VendorListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([getListingById(id), getListingOrders(id)])
      .then(([l, os]) => { setListing(l); setOrders(os); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirmPickup = async (orderId: string) => {
    setConfirmingId(orderId);
    try {
      await updateOrderStatus(orderId, 'completed');
      setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, status: 'completed' } : o));
    } catch (err) {
      console.error('Failed to confirm pickup:', err);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleDelete = async () => {
    if (!listing) return;
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteListing(listing.$id);
      navigate('/vendor/listings');
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="p-8 max-w-[600px] mx-auto">
      <div className="animate-pulse space-y-5">
        <div className="h-10 w-48 bg-white rounded-full" />
        <div className="h-[200px] bg-white rounded-[20px]" />
        <div className="h-[160px] bg-white rounded-[20px]" />
      </div>
    </div>
  );

  if (!listing) return (
    <div className="p-8 text-center max-w-[600px] mx-auto">
      <p className="font-questrial text-[#0A2623]">Listing not found.</p>
      <Link to="/vendor/listings" className="mt-4 inline-block text-[#0F3934] underline font-questrial">Back to listings</Link>
    </div>
  );

  const claimsTotal = listing.quantity + listing.claimsUsed;
  const timeLeft = listing.expiresAt ? getTimeLeft(listing.expiresAt) : listing.pickupTime;
  const isFullyClaimed = listing.quantity === 0;
  const isLive = listing.status === 'active' && !isFullyClaimed;
  const revenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.totalPaid ?? 0), 0);

  return (
    <div className="p-8 max-w-[600px] mx-auto flex flex-col gap-6 bg-[#F9F9F9] min-h-screen">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/vendor/listings')}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 bg-white hover:bg-neutral-50 cursor-pointer transition-all"
        >
          <ArrowLeft size={18} className="text-[#0A2623]" />
        </button>
        <span className="font-questrial text-[24px] text-[#0A2623] text-center font-normal flex-1">Listing Details</span>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 bg-white hover:bg-neutral-50 cursor-pointer transition-all"
          >
            <MoreVertical size={18} className="text-[#0A2623]" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-[200px] bg-white rounded-[16px] border border-black/10 shadow-lg z-20 py-1.5 overflow-hidden">
                <button
                  onClick={() => { setMenuOpen(false); navigate(`/vendor/post-listing?edit=${id}`); }}
                  className="flex items-center gap-3 px-5 py-3.5 w-full hover:bg-[#F9F9F9] font-questrial text-[16px] text-[#0A2623] text-left transition-colors"
                >
                  ✏️ Edit
                </button>
                <div className="h-[1px] bg-black/10" />
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-3 px-5 py-3.5 w-full hover:bg-[#F9F9F9] font-questrial text-[16px] text-[#EF4444] text-left disabled:opacity-50 transition-colors"
                >
                  🗑️ {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hero Image Card */}
      <div className="relative rounded-[24px] overflow-hidden border border-black/10 bg-[#F0F9EF] h-[197px]">
        <img
          src={getListingImage(listing.name, listing.imageUrl, listing.description)}
          alt={listing.name}
          className="w-full h-full object-cover"
        />
        {/* Status badge */}
        <div className="absolute right-4 bottom-4 flex items-center gap-2 px-4 py-2 rounded-full border border-[#28A745]/10 bg-[#E5F2E8] text-[#28A745]">
          {isFullyClaimed ? (
            <>
              <CheckCheck size={16} />
              <span className="font-questrial text-[16px] font-semibold">Fully Claimed</span>
            </>
          ) : isLive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#28A745] animate-pulse" />
              <span className="font-questrial text-[16px] font-semibold">Listing is LIVE</span>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-red-500">
              <XCircle size={16} />
              <span className="font-questrial text-[16px] font-semibold">Listing Ended</span>
            </div>
          )}
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-[24px] border border-black/10 p-6 md:p-8 flex flex-col gap-6" style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="font-questrial text-[20px] text-[#0A2623] font-semibold truncate">{listing.name}</h2>
            <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.3)] line-through">₦{listing.originalPrice.toLocaleString()}</p>
          </div>
          <p className="font-questrial text-[24px] text-[#0A2623] font-semibold">₦{listing.discountedPrice.toLocaleString()}</p>
        </div>
        <div className="h-[1px] bg-black/10" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)] text-[16px]">
            <div className="flex items-center gap-3">
              <Flame size={20} className="text-[#0A2623]/70" />
              <span className="font-questrial">Claims</span>
            </div>
            <span className="font-questrial text-[#0A2623] font-semibold">{listing.claimsUsed}/{claimsTotal}</span>
          </div>
          <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)] text-[16px]">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-[#0A2623]/70" />
              <span className="font-questrial">Duration</span>
            </div>
            <span className="font-questrial text-[#0A2623] font-semibold">{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Performance Card */}
      <div className="bg-white rounded-[24px] border border-black/10 p-6 md:p-8 flex flex-col gap-6" style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
        <h3 className="font-questrial text-[18px] font-semibold text-[#0A2623]">Performance</h3>
        <div className="h-[1px] bg-black/10" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)] text-[16px]">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-[#0A2623]/70" />
              <span className="font-questrial">Total Views</span>
            </div>
            <span className="font-questrial text-[#0A2623] font-semibold">{listing.claimsUsed * 4 + 12}</span>
          </div>
          <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)] text-[16px]">
            <div className="flex items-center gap-3">
              <Flame size={20} className="text-[#0A2623]/70" />
              <span className="font-questrial">Total Claims</span>
            </div>
            <span className="font-questrial text-[#0A2623] font-semibold">{listing.claimsUsed}</span>
          </div>
          <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)] text-[16px]">
            <div className="flex items-center gap-3">
              <Coins size={20} className="text-[#0A2623]/70" />
              <span className="font-questrial">Revenue</span>
            </div>
            <span className="font-questrial text-[#0A2623] font-semibold">₦{revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Claimers & Reviews Card */}
      <div className="bg-white rounded-[24px] border border-black/10 p-6 md:p-8 flex flex-col gap-6 shadow-[0_1px_3px_rgba(10,38,35,0.06)]">
        <h3 className="font-questrial text-[18px] font-semibold text-[#0A2623]">Claimers</h3>
        <div className="h-[1px] bg-black/10" />
        {orders.length === 0 ? (
          <p className="font-questrial text-sm text-[rgba(10,38,35,0.5)] py-4 text-center">No portions claimed yet.</p>
        ) : (
          <div className="flex flex-col gap-6 divide-y divide-black/10">
            {orders.map((order, idx) => {
              const hasReview = order.status === 'completed' && order.rating;
              return (
                <div key={order.$id} className={`flex flex-col gap-4 ${idx > 0 ? 'pt-6' : ''}`}>
                  {/* Rating / Review block on top */}
                  {hasReview && (
                    <div className="flex items-start gap-4 justify-between">
                      <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.7)] leading-relaxed flex-1">
                        "{order.remark || 'Not a bad purchase, I love it.'}"
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0 text-amber-500">
                        <Star size={18} className="fill-amber-500 text-amber-500" />
                        <span className="font-questrial text-[20px] font-semibold text-[#0A2623]">
                          {(order.rating ?? 4.0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Profile info on bottom */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7AD371]/15 flex items-center justify-center font-questrial font-semibold text-sm text-[#0F3934]">
                        {(order.buyerName ?? 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-questrial text-[16px] text-[#0A2623] font-semibold">
                          {order.buyerName ?? 'Customer'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {order.status === 'completed' ? (
                            <div className="flex items-center gap-1 text-[#28A745]">
                              <CheckCheck size={14} />
                              <span className="font-questrial text-[12px] font-semibold">Picked Up</span>
                            </div>
                          ) : order.status === 'cancelled' || order.status === 'expired' ? (
                            <div className="flex items-center gap-1 text-[#EF4444]">
                              <XCircle size={14} />
                              <span className="font-questrial text-[12px] font-semibold">Cancelled</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-500">
                              <Clock size={14} />
                              <span className="font-questrial text-[12px] font-semibold">Pending Pickup</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action button or date */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="font-questrial text-[12px] text-[rgba(10,38,35,0.5)]">
                        {new Date(order.claimedAt).toLocaleDateString('en-NG', { day: '2-digit', month: '2-digit', year: 'numeric' })}{' '}
                        {new Date(order.claimedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleConfirmPickup(order.$id)}
                          disabled={confirmingId === order.$id}
                          className="px-4 py-1.5 rounded-full bg-[#0F3934] hover:bg-[#0A2623] text-white font-questrial text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {confirmingId === order.$id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Confirming...</span>
                            </>
                          ) : (
                            <span>Confirm Pickup</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
