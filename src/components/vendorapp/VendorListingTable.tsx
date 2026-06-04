import { BarChart2, CheckCircle2, Clock, Edit2, MoreVertical, ShoppingBag, Trash2, XCircle, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteListing } from '../../services/listings.service';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; textColor: string; bg: string }> = {
  active:   { label: 'Active',   icon: <CheckCircle2 size={12} />, textColor: 'text-[#22C55E]', bg: 'bg-[#22C55E12]' },
  pending:  { label: 'Pending',  icon: <Clock size={12} />,        textColor: 'text-[#F59E0B]', bg: 'bg-[#F59E0B12]' },
  expired:  { label: 'Expired',  icon: <XCircle size={12} />,      textColor: 'text-[#EF4444]', bg: 'bg-[#EF444412]' },
  sold_out: { label: 'Sold Out', icon: <CheckCircle2 size={12} />, textColor: 'text-text-muted', bg: 'bg-[#F0F4F1]' },
};

const FILTER_OPTS = ['All', 'active', 'pending', 'sold_out', 'expired'] as const;

export default function VendorListingTable({ listings, setListings, loading }: any) {
  const navigate = useNavigate();
  const [activeFilter, setFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = activeFilter === 'All' ? listings : listings.filter((l: any) => l.status === activeFilter);

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteListing(deleteConfirmId);
      setListings((prev: any[]) => prev.filter((l) => l.$id !== deleteConfirmId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
      setOpenMenuId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={18} className="text-brand-secondary" />
          <h2 className="font-questrial text-xl">Your Listings</h2>
        </div>
        <div className="flex gap-2">
          {FILTER_OPTS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1 rounded-full text-xs capitalize ${activeFilter === f ? 'bg-[#0F3934] text-white' : 'border border-border'}`}>
              {f === 'sold_out' ? 'Sold Out' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag size={40} className="mx-auto text-text-muted mb-4" />
            <p>No {activeFilter} listings.</p>
            <Link to="/vendor/post-listing" className="text-brand-secondary underline">Post one now</Link>
          </div>
        ) : (
          <table className="w-full">
            <tbody className="divide-y divide-border">
              {filtered.map((listing: any) => {
                const cfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG['active'];
                return (
                  <tr key={listing.$id} className="hover:bg-bg transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/vendor/listings/${listing.$id}`} className="hover:text-brand-primary font-medium hover:underline transition-all">
                        {listing.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">₦{listing.discountedPrice.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${cfg.textColor} ${cfg.bg}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-4 relative">
                      <button onClick={() => setOpenMenuId(openMenuId === listing.$id ? null : listing.$id)}>
                        <MoreVertical size={15} />
                      </button>
                      {openMenuId === listing.$id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-4 bg-white border border-border shadow-lg rounded-xl z-20 p-1 flex flex-col gap-1 min-w-[120px]">
                            <button onClick={() => { setOpenMenuId(null); navigate(`/vendor/listings/${listing.$id}`); }} className="flex w-full items-center p-2 text-sm text-left hover:bg-neutral-50 rounded-lg gap-2 text-text-primary"><BarChart2 size={13} /> Details</button>
                            <button onClick={() => { setOpenMenuId(null); navigate(`/vendor/post-listing?edit=${listing.$id}`); }} className="flex w-full items-center p-2 text-sm text-left hover:bg-neutral-50 rounded-lg gap-2 text-text-primary"><Edit2 size={13} /> Edit</button>
                            <button onClick={() => { setDeleteConfirmId(listing.$id); setOpenMenuId(null); }} className="flex w-full items-center p-2 text-sm text-left hover:bg-red-50 text-red-500 rounded-lg gap-2"><Trash2 size={13} /> Delete</button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Delete Confirmation Modal ─────────────────────── */}
      {deleteConfirmId && (
        <>
          <div className="fixed inset-0 bg-[#0A2623]/40 z-[100] backdrop-blur-[2px]" onClick={() => setDeleteConfirmId(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-[20px] p-6 border border-black/10 z-[110] flex flex-col gap-6 shadow-2xl animate-scale-in">
            <button 
              onClick={() => setDeleteConfirmId(null)} 
              className="absolute right-4 top-4 text-[#0A2623]/50 hover:text-[#0A2623] cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center gap-4 mt-2">
              <div className="w-[50px] h-[50px] rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
                <AlertCircle size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-questrial text-[20px] font-normal leading-[130%] text-[#0A2623]">
                  Delete Listing?
                </h3>
                <p className="font-questrial text-sm text-[#0A2623]/70 leading-relaxed">
                  Are you sure you want to delete this listing? This action cannot be undone and will remove the listing and active pickup claims.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 h-10 rounded-full border border-black/10 hover:bg-neutral-50 transition-colors font-questrial text-sm text-[#0A2623] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-full bg-[#EF4444] hover:bg-[#DC2626] transition-all text-white font-questrial text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}