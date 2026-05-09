import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import {
  TrendingUp, ShoppingBag, Plus, MoreVertical,
  CheckCircle2, Clock, XCircle, Edit2, Trash2, BarChart2,
  BadgeCheck, Package, AlertCircle, Eye
} from 'lucide-react';
import { getVendorListings, deleteListing } from '../services/listings.service';
import { getVendorOrders } from '../services/orders.service';
import type { Listing } from '../services/listings.service';
import type { Order } from '../services/orders.service';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; textColor: string; bg: string }> = {
  active:   { label: 'Active',   icon: <CheckCircle2 size={12} />, textColor: 'text-[#22C55E]', bg: 'bg-[#22C55E12]' },
  pending:  { label: 'Pending',  icon: <Clock size={12} />,        textColor: 'text-[#F59E0B]', bg: 'bg-[#F59E0B12]' },
  expired:  { label: 'Expired',  icon: <XCircle size={12} />,      textColor: 'text-[#EF4444]', bg: 'bg-[#EF444412]' },
  sold_out: { label: 'Sold Out', icon: <CheckCircle2 size={12} />, textColor: 'text-text-muted', bg: 'bg-[#F0F4F1]' },
};

const FILTER_OPTS = ['All', 'active', 'pending', 'sold_out', 'expired'] as const;
type FilterOpt = typeof FILTER_OPTS[number];

const VendorDashboardPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const [listings, setListings]   = useState<Listing[]>([]);
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState<FilterOpt>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([getVendorListings(user.id), getVendorOrders(user.id)])
      .then(([ls, os]) => { setListings(ls); setOrders(os); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = activeFilter === 'All' ? listings : listings.filter((l) => l.status === activeFilter);

  const totalClaims   = listings.reduce((s, l) => s + (l.claimsUsed ?? 0), 0);
  const activeCount   = listings.filter((l) => l.status === 'active').length;
  const recentOrders  = orders.slice(0, 5);

  const STATS = [
    { label: 'Total Listings', value: listings.length, icon: ShoppingBag, color: 'text-brand-secondary', bg: 'bg-[#0F39340F]' },
    { label: 'Active Now',     value: activeCount,     icon: Eye,          color: 'text-[#22C55E]',      bg: 'bg-[#22C55E0F]' },
    { label: 'Total Claims',   value: totalClaims,     icon: TrendingUp,   color: 'text-[#3B82F6]',      bg: 'bg-[#3B82F60F]' },
    { label: 'Recent Orders',  value: orders.length,   icon: Package,      color: 'text-[#F59E0B]',      bg: 'bg-[#F59E0B0F]' },
  ];

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.$id !== id));
    } catch { /* show toast ideally */ }
    finally { setDeletingId(null); setOpenMenuId(null); }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-10">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="font-questrial text-3xl text-text-primary">Vendor Dashboard</h1>
              <p className="font-questrial text-base text-text-secondary mt-1">
                Welcome back, <span className="text-brand-secondary">{user?.name?.split(' ')[0]}</span> 👋
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/verify-business"
                className="flex items-center gap-2 h-10 px-5 rounded-full border border-border bg-white font-questrial text-sm text-text-secondary hover:border-brand-primary transition-all"
              >
                <BadgeCheck size={15} className="text-brand-primary" /> Verify Business
              </Link>
              <Link to="/post-listing" className="btn-primary !h-10 !px-5 !text-sm gap-1.5">
                <Plus size={15} /> Post Listing
              </Link>
            </div>
          </div>

          {/* ── Stats Grid ─────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="section-card flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-xl skeleton" />
                  <div className="h-7 w-16 skeleton rounded-lg" />
                  <div className="h-3 w-24 skeleton rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="section-card flex flex-col gap-4 hover:border-brand-primary transition-all">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <p className="font-questrial text-2xl text-text-primary">{value}</p>
                    <p className="font-questrial text-sm text-text-muted">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Two-column layout ──────────────────────────────── */}
          <div className="flex flex-col xl:flex-row gap-8 items-start">

            {/* LEFT: Listings table */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <BarChart2 size={18} className="text-brand-secondary" />
                  <h2 className="font-questrial text-xl text-text-primary">Your Listings</h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {FILTER_OPTS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`h-8 px-4 rounded-full font-questrial text-xs border transition-all capitalize ${
                        activeFilter === f
                          ? 'bg-[#0F3934] text-white border-[#0F3934]'
                          : 'border-border text-text-secondary hover:border-brand-primary bg-white'
                      }`}
                    >
                      {f === 'sold_out' ? 'Sold Out' : f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="section-card !p-0 overflow-hidden">
                {loading ? (
                  <div className="flex flex-col divide-y divide-border">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 px-6 py-4">
                        <div className="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-4 w-1/2 skeleton rounded-full" />
                          <div className="h-3 w-1/4 skeleton rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-border">
                      <ShoppingBag size={24} className="text-text-muted" />
                    </div>
                    <div>
                      <p className="font-questrial text-base text-text-primary mb-1">
                        {activeFilter === 'All' ? 'No listings yet' : `No ${activeFilter} listings`}
                      </p>
                      <p className="font-questrial text-sm text-text-secondary">
                        {activeFilter === 'All' ? 'Start posting surplus food to reach hungry customers.' : 'Change the filter to see other listings.'}
                      </p>
                    </div>
                    {activeFilter === 'All' && (
                      <Link to="/post-listing" className="btn-primary !h-10 !px-6 !text-sm gap-1.5">
                        <Plus size={15} /> Post Your First Listing
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-bg">
                          <th className="text-left px-6 py-3.5 font-questrial text-xs text-text-muted uppercase tracking-wide">Meal</th>
                          <th className="text-left px-4 py-3.5 font-questrial text-xs text-text-muted uppercase tracking-wide">Price</th>
                          <th className="text-left px-4 py-3.5 font-questrial text-xs text-text-muted uppercase tracking-wide">Claims</th>
                          <th className="text-left px-4 py-3.5 font-questrial text-xs text-text-muted uppercase tracking-wide">Status</th>
                          <th className="text-left px-4 py-3.5 font-questrial text-xs text-text-muted uppercase tracking-wide hidden sm:table-cell">Expires</th>
                          <th className="px-4 py-3.5 w-10" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filtered.map((listing) => {
                          const cfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG['active'];
                          const claimsTotal   = listing.quantity + listing.claimsUsed;
                          const claimsPct     = claimsTotal > 0 ? Math.round((listing.claimsUsed / claimsTotal) * 100) : 0;

                          return (
                            <tr key={listing.$id} className="hover:bg-bg transition-colors group">
                              {/* Meal */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-[#F0F4F1]">
                                    {listing.imageUrl
                                      ? <img src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover" />
                                      : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                                    }
                                  </div>
                                  <span className="font-questrial text-sm text-text-primary whitespace-nowrap line-clamp-1 max-w-[140px]">
                                    {listing.name}
                                  </span>
                                </div>
                              </td>
                              {/* Price */}
                              <td className="px-4 py-4">
                                <div className="flex flex-col">
                                  <span className="font-questrial text-sm text-text-primary">₦{listing.discountedPrice.toLocaleString()}</span>
                                  <span className="font-questrial text-xs text-text-muted line-through">₦{listing.originalPrice.toLocaleString()}</span>
                                </div>
                              </td>
                              {/* Claims */}
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-1.5 min-w-[90px]">
                                  <div className="flex items-center justify-between">
                                    <span className="font-questrial text-xs text-text-secondary">{listing.claimsUsed}/{claimsTotal}</span>
                                    <span className="font-questrial text-xs text-text-muted">{claimsPct}%</span>
                                  </div>
                                  <div className="w-full h-1 bg-[#F0F4F1] rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-primary rounded-full" style={{ width: `${claimsPct}%` }} />
                                  </div>
                                </div>
                              </td>
                              {/* Status */}
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-questrial ${cfg.textColor} ${cfg.bg}`}>
                                  {cfg.icon} {cfg.label}
                                </span>
                              </td>
                              {/* Expires */}
                              <td className="px-4 py-4 hidden sm:table-cell">
                                <span className="font-questrial text-xs text-text-muted whitespace-nowrap">
                                  {listing.expiresAt
                                    ? new Date(listing.expiresAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                    : '—'}
                                </span>
                              </td>
                              {/* Actions */}
                              <td className="px-4 py-4 relative">
                                <button
                                  onClick={() => setOpenMenuId(openMenuId === listing.$id ? null : listing.$id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F4F1] transition-colors"
                                >
                                  <MoreVertical size={15} className="text-text-muted" />
                                </button>
                                {openMenuId === listing.$id && (
                                  <div className="absolute right-4 top-full mt-1 w-36 bg-white rounded-xl border border-border z-20 py-1 overflow-hidden"
                                    style={{ boxShadow: '0 4px 16px rgba(10,38,35,0.10)' }}>
                                    <button
                                      onClick={() => { navigate(`/post-listing?edit=${listing.$id}`); setOpenMenuId(null); }}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors"
                                    >
                                      <Edit2 size={13} /> Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(listing.$id)}
                                      disabled={deletingId === listing.$id}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 font-questrial text-sm text-[#EF4444] hover:bg-[#EF444408] transition-colors disabled:opacity-50"
                                    >
                                      <Trash2 size={13} />
                                      {deletingId === listing.$id ? 'Deleting…' : 'Delete'}
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Recent claims */}
            <div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col gap-4">
              <div className="section-card flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-questrial text-base text-text-primary">Recent Claims</h2>
                  <span className="font-questrial text-xs text-text-muted">{orders.length} total</span>
                </div>

                {loading ? (
                  <div className="flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full skeleton flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-3 w-3/4 skeleton rounded-full" />
                          <div className="h-2.5 w-1/2 skeleton rounded-full" />
                        </div>
                        <div className="h-3 w-14 skeleton rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                    <Package size={28} className="text-text-muted" />
                    <p className="font-questrial text-sm text-text-secondary">
                      No claims yet. They'll appear here when buyers claim your listings.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-border">
                    {recentOrders.map((order) => (
                      <div key={order.$id} className="flex items-center gap-3 py-3.5">
                        <div className="w-9 h-9 rounded-full bg-brand-primary/15 flex items-center justify-center flex-shrink-0">
                          <span className="font-questrial text-xs text-brand-secondary uppercase">
                            {(order.buyerId ?? 'U').slice(0, 1)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-questrial text-sm text-text-primary truncate">
                            Claimed <span className="text-brand-secondary">{order.listingName}</span>
                          </p>
                          <p className="font-questrial text-xs text-text-muted">
                            {order.claimedAt ? timeAgo(order.claimedAt) : ''}
                          </p>
                        </div>
                        <span className="font-questrial text-sm text-[#22C55E] flex-shrink-0">
                          +₦{order.totalPaid.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick tip card */}
              {!loading && listings.length === 0 && (
                <div className="p-5 rounded-2xl bg-[#EFF4F0] border border-border flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-brand-secondary" />
                    <p className="font-questrial text-sm text-brand-secondary">Getting Started</p>
                  </div>
                  <p className="font-questrial text-xs text-text-secondary leading-relaxed">
                    Post your first surplus food listing to start reaching buyers near you. It takes less than 2 minutes!
                  </p>
                  <Link to="/post-listing" className="btn-primary !h-9 !px-5 !text-xs gap-1.5 self-start">
                    <Plus size={13} /> Post Now
                  </Link>
                </div>
              )}

              {/* Verify prompt */}
              <div className="p-5 rounded-2xl bg-[#0F3934] border border-[#0F3934] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-brand-primary" />
                  <p className="font-questrial text-sm text-white">Verify Your Business</p>
                </div>
                <p className="font-questrial text-xs text-white/70 leading-relaxed">
                  Get a verified badge and build trust with buyers. Verified vendors get 3× more claims.
                </p>
                <Link to="/verify-business" className="btn-green !h-9 !px-5 !text-xs self-start">
                  Verify Now
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
      )}

      <Footer />
    </div>
  );
};

export default VendorDashboardPage;
