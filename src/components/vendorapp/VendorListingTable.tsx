import { BarChart2, CheckCircle2, Clock, Edit2, MoreVertical, ShoppingBag, Trash2, XCircle } from 'lucide-react';
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = activeFilter === 'All' ? listings : listings.filter((l: any) => l.status === activeFilter);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteListing(id);
      setListings((prev: any[]) => prev.filter((l) => l.$id !== id));
    } finally {
      setDeletingId(null);
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
            <Link to="/post-listing" className="text-brand-secondary underline">Post one now</Link>
          </div>
        ) : (
          <table className="w-full">
            <tbody className="divide-y divide-border">
              {filtered.map((listing: any) => {
                const cfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG['active'];
                return (
                  <tr key={listing.$id} className="hover:bg-bg transition-colors">
                    <td className="px-6 py-4">{listing.name}</td>
                    <td className="px-4 py-4">₦{listing.discountedPrice.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${cfg.textColor} ${cfg.bg}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-4 relative">
                      <button onClick={() => setOpenMenuId(openMenuId === listing.$id ? null : listing.$id)}>
                        <MoreVertical size={15} />
                      </button>
                      {openMenuId === listing.$id && (
                        <div className="absolute right-4 bg-white border border-border shadow-lg rounded-xl z-20">
                          <button onClick={() => navigate(`/post-listing?edit=${listing.$id}`)} className="flex p-2 gap-2"><Edit2 size={13} /> Edit</button>
                          <button onClick={() => handleDelete(listing.$id)} className="flex p-2 gap-2 text-red-500"><Trash2 size={13} /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}