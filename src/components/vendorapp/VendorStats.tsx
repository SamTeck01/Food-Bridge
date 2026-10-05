import { Eye, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import type { Listing } from '../../services/listings.service';
import type { Order } from '../../services/orders.service';

export default function VendorStats({ listings, orders, loading }: { listings: Listing[]; orders: Order[]; loading: boolean }) {
  const activeCount = listings.filter((l) => l.status === 'active').length;
  const totalClaims = listings.reduce((s: number, l) => s + (l.claimsUsed ?? 0), 0);

  const stats = [
    { label: 'Total Listings', value: listings.length, icon: ShoppingBag, color: 'text-brand-secondary', bg: 'bg-[#0F39340F]' },
    { label: 'Active Now', value: activeCount, icon: Eye, color: 'text-[#22C55E]', bg: 'bg-[#22C55E0F]' },
    { label: 'Total Claims', value: totalClaims, icon: TrendingUp, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F60F]' },
    { label: 'Recent Orders', value: orders.length, icon: Package, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B0F]' },
  ];

  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}</div>;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="section-card flex flex-col gap-4">
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
  );
}