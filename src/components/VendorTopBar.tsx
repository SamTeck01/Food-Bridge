import { Bell, MapPin, Package, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { Order } from '../services/orders.service';
import { getVendorOrders } from '../services/orders.service';

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function VendorTopBar() {
  const { user } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    getVendorOrders(user.id).then(setOrders).catch(console.error);
  }, [user?.id]);

  // Close the activity panel on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const recent = orders.slice(0, 5);
  const pendingCount = orders.filter((o) => o.status === 'confirmed').length;

  return (
    <header className="sticky top-0 z-30 bg-[#F9F9F9] px-8 h-[80px] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-[#0F3934]" />
        <span className="font-questrial text-[16px] text-[#0F3934]">Ilorin, Kwara</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Recent activity"
            className="relative w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:border-[#7AD371] transition-all"
          >
            <Bell size={18} className="text-[#0A2623]" />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-questrial">
                {pendingCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-[min(500px,90vw)] bg-white rounded-[20px] border border-black/10 shadow-lg p-6 z-50">
              <h2 className="font-questrial text-[20px] text-[#0A2623] mb-4">Recent Activity</h2>
              {recent.length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="mx-auto text-[rgba(10,38,35,0.3)] mb-2" size={32} />
                  <p className="font-questrial text-[14px] text-[rgba(10,38,35,0.5)]">No claims yet</p>
                </div>
              ) : (
                <div className="divide-y divide-black/[0.06]">
                  {recent.map((order) => (
                    <div key={order.$id} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-full bg-[#7AD371]/15 flex items-center justify-center text-[#0F3934] font-questrial text-sm flex-shrink-0">
                        {(order.buyerName ?? 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-questrial text-[14px] text-[#0A2623] truncate">
                          <span className="font-semibold">{order.buyerName ?? 'Customer'}</span> claimed {order.listingName}
                        </p>
                        <p className="font-questrial text-[12px] text-[rgba(10,38,35,0.5)]">{timeAgo(order.claimedAt)}</p>
                      </div>
                      <span className="font-questrial text-[14px] text-[#28A745] flex-shrink-0">
                        +₦{order.totalPaid.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Link
          to="/vendor/post-listing"
          className="flex items-center gap-2 h-10 px-5 rounded-full bg-[#0F3934] text-white font-questrial text-[16px] hover:bg-[#0A2623] transition-all"
        >
          Post <Plus size={16} />
        </Link>
      </div>
    </header>
  );
}
