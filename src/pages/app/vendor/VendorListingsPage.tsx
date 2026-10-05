import { Clock, Flame, Plus, Search, SlidersHorizontal, AlertCircle, Trash2, Edit2, X, CheckCheck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import type { Listing } from '../../../services/listings.service';
import { getVendorListings, deleteListing, getListingImage } from '../../../services/listings.service';

type FilterTab = 'Active' | 'Completed' | 'Expired';

const getTimeLeft = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
};

export default function VendorListingsPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('Active');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getVendorListings(user.id)
      .then(setListings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = listings.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === 'Active') return ['active', 'pending'].includes(l.status);
    if (activeTab === 'Completed') return l.status === 'sold_out';
    return l.status === 'expired';
  });

  const tabCount = (tab: FilterTab) => listings.filter(l => {
    if (tab === 'Active') return ['active', 'pending'].includes(l.status);
    if (tab === 'Completed') return l.status === 'sold_out';
    return l.status === 'expired';
  }).length;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteListing(deleteId);
      setListings(prev => prev.filter(l => l.$id !== deleteId));
    } catch (e) { console.error(e); }
    finally { setIsDeleting(false); setDeleteId(null); }
  };

  return (
    <div className="p-8 max-w-[1104px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-questrial text-[32px] text-[#0A2623]">Your Listings</h1>
          <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.6)] mt-1">Manage and track all your surplus posts</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['Active', 'Completed', 'Expired'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-questrial text-[16px] border transition-all ${
                activeTab === tab
                  ? 'bg-white border-black/10 text-[#0A2623]'
                  : 'bg-[#F9F9F9] border-transparent text-[rgba(10,38,35,0.5)] hover:bg-[#F9F9F9]'
              }`}
            >
              {tab}
              {tabCount(tab) > 0 && (
                <span className={`text-[12px] px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === tab ? 'bg-[#7AD371] text-white' : 'bg-[#7AD371]/15 text-[#0F3934]'
                }`}>{tabCount(tab)}</span>
              )}
            </button>
          ))}
        </div>
        {/* Search + Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 h-10 px-4 rounded-full border border-black/10 bg-white">
            <Search size={16} className="text-[rgba(10,38,35,0.4)]" />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none font-questrial text-[16px] text-[#0A2623] placeholder:text-[rgba(10,38,35,0.3)] w-[180px]"
            />
          </div>
          <button className="flex items-center gap-2 h-10 px-4 rounded-full border border-black/10 bg-white font-questrial text-[16px] text-[rgba(10,38,35,0.7)] hover:border-[#7AD371] transition-all">
            <SlidersHorizontal size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Listing Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map(i => <div key={i} className="bg-white rounded-[20px] h-[280px] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-black/10 p-16 text-center">
          <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.5)]">No {activeTab.toLowerCase()} listings{search ? ` matching "${search}"` : ''}.</p>
          {activeTab === 'Active' && (
            <Link to="/vendor/post-listing" className="mt-4 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#0F3934] text-white font-questrial text-sm">
              <Plus size={15} /> Post one now
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(listing => {
            const claimsTotal = listing.quantity + listing.claimsUsed;
            const timeLeft = listing.expiresAt ? getTimeLeft(listing.expiresAt) : listing.pickupTime;
            const isFullyClaimed = listing.quantity === 0;

            return (
              <div
                key={listing.$id}
                className="bg-white rounded-[20px] border border-black/10 overflow-hidden hover:-translate-y-0.5 transition-all p-1.5 flex flex-col justify-between"
                style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}
              >
                <div>
                  {/* Image */}
                  <div
                    className="relative h-[120px] w-full overflow-hidden bg-[#F0F9EF] cursor-pointer rounded-t-[16px]"
                    onClick={() => navigate(`/vendor/listings/${listing.$id}`)}
                  >
                    <img
                      src={getListingImage(listing.name, listing.imageUrl, listing.description)}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Action buttons overlay */}
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/vendor/post-listing?edit=${listing.$id}`); }}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
                      >
                        <Edit2 size={13} className="text-[#0A2623]" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteId(listing.$id); }}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-all shadow-sm"
                      >
                        <Trash2 size={13} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  {/* Body */}
                  <div
                    className="p-5 flex flex-col gap-4 cursor-pointer"
                    onClick={() => navigate(`/vendor/listings/${listing.$id}`)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="font-questrial text-[16px] text-[#0A2623] font-semibold truncate">{listing.name}</p>
                        <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.3)] line-through">₦{listing.originalPrice.toLocaleString()}</p>
                      </div>
                      <p className="font-questrial text-[24px] text-[#0A2623] font-semibold">₦{listing.discountedPrice.toLocaleString()}</p>
                    </div>
                    <div className="h-[1px] bg-black/10" />
                    <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)]">
                      {/* Left status badge */}
                      {listing.status === 'expired' ? (
                        <div className="flex items-center gap-1.5 text-[#EF4444] font-questrial text-[14px] font-semibold">
                          <XCircle size={16} />
                          <span>Expired</span>
                        </div>
                      ) : listing.status === 'sold_out' ? (
                        <div className="flex items-center gap-1.5 text-[#28A745] font-questrial text-[14px] font-semibold">
                          <CheckCheck size={16} />
                          <span>Claimed</span>
                        </div>
                      ) : isFullyClaimed ? (
                        <div className="flex items-center gap-1.5 text-[#28A745] font-questrial text-[14px] font-semibold">
                          <CheckCheck size={16} />
                          <span>Awaiting pickup</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-[rgba(10,38,35,0.7)]" />
                          <span className="font-questrial text-[14px]">{timeLeft}</span>
                        </div>
                      )}

                      {/* Right claims badge */}
                      <div className="flex items-center gap-1.5">
                        <Flame size={16} className={listing.status === 'expired' ? 'text-red-500/50' : 'text-[#28A745]'} />
                        <span className="font-questrial text-[16px] font-semibold text-[#0A2623]">
                          {listing.claimsUsed}/{claimsTotal} claims
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <>
          <div className="fixed inset-0 bg-[#0A2623]/40 z-[100] backdrop-blur-[2px]" onClick={() => setDeleteId(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-[20px] p-6 border border-black/10 z-[110] flex flex-col gap-6 shadow-2xl">
            <button onClick={() => setDeleteId(null)} className="absolute right-4 top-4 text-[rgba(10,38,35,0.5)] hover:text-[#0A2623] p-1 rounded-full hover:bg-neutral-100 transition-colors">
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center gap-4 mt-2">
              <div className="w-[50px] h-[50px] rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-questrial text-[20px] text-[#0A2623]">Delete Listing?</h3>
                <p className="font-questrial text-sm text-[rgba(10,38,35,0.7)] leading-relaxed mt-1">
                  This will remove the listing and any active claims. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-10 rounded-full border border-black/10 font-questrial text-sm text-[#0A2623] hover:bg-neutral-50">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-full bg-[#EF4444] text-white font-questrial text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Deleting...</span></> : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
