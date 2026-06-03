import { Package } from 'lucide-react';
const timeAgo = (dateStr: string) => { /* copy your helper function here */ };

export default function VendorRecentClaims({ orders, loading }: any) {
  if (loading) return <div className="section-card h-64 skeleton" />;
  
  return (
    <div className="w-full xl:w-[320px] section-card flex flex-col gap-4">
      <h2 className="font-questrial text-base">Recent Claims</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8"><Package className="mx-auto text-text-muted" /> <p className="text-sm">No claims yet.</p></div>
      ) : (
        orders.slice(0, 5).map((order: any) => (
          <div key={order.$id} className="flex items-center gap-3 py-2">
            <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs text-brand-secondary">
              {(order.buyerId ?? 'U').slice(0, 1)}
            </div>
            <div className="flex-1 text-sm">
              <p className="truncate">Claimed {order.listingName}</p>
              <p className="text-xs text-text-muted">{timeAgo(order.claimedAt)}</p>
            </div>
            <span className="text-sm text-[#22C55E]">+₦{order.totalPaid.toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
}