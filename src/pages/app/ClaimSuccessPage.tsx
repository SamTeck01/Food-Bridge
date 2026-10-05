import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pickupCode } from '../../lib/pickupCode';
import { Clock, Package, MapPin, ShieldCheck } from 'lucide-react';
import { getOrderById } from '../../services/orders.service';
import type { Order } from '../../services/orders.service';

export default function ClaimSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((data) => setOrder(data))
      .catch((err) => {
        console.error(err);
        setError('Order not found.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFDF2] items-center justify-center py-10 px-6 select-none">
        <div className="w-10 h-10 border-4 border-[#7AD371] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFDF2] items-center justify-center gap-6 py-20 px-6 text-center select-none">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-black/10">
          <span className="text-4xl">⚠️</span>
        </div>
        <div>
          <h1 className="font-questrial text-2xl text-[#0A2623] mb-2">Claim Not Found</h1>
          <p className="font-questrial text-sm text-[#0A2623]/70">This claim confirmation details could not be retrieved.</p>
        </div>
        <Link to="/listings" className="btn-primary">Back to Listings</Link>
      </div>
    );
  }

  const mapQuery = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.vendorName)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF2] py-[60px] px-4 select-none">
      <div className="max-w-[400px] w-full mx-auto flex flex-col items-center text-center">
        
        {/* Animated Double Checkmark Circle */}
        <div className="w-[100px] h-[100px] rounded-full bg-[#28A745]/10 border border-[#28A745]/20 flex items-center justify-center mb-[24px]">
          <svg className="w-[50px] h-[50px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 11.1111C2.5 11.1111 3.75 11.6667 5.41667 14.1667C5.41667 14.1667 5.65404 13.766 6.10111 13.1272M14.1667 5C12.2571 5.95481 10.2599 7.95984 8.65658 9.85192" stroke="#28A745" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.6665 11.1111C6.6665 11.1111 7.9165 11.6667 9.58317 14.1667C9.58317 14.1667 14.1665 7.08333 18.3332 5" stroke="#28A745" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Success Header */}
        <h1 className="font-questrial text-[32px] font-normal leading-[130%] text-[#0A2623] mb-[8px]">
          Claim Successful!
        </h1>
        <p className="font-questrial text-[16px] text-[#0A2623]/70 leading-[130%] mb-[32px]">
          Please arrive before the pickup window ends.
        </p>

        <div className="w-full flex items-center justify-between rounded-[16px] bg-white border border-black/10 px-5 py-4 mb-[16px]">
          <span className="font-questrial text-sm text-[#0A2623]/70">Pickup code</span>
          <span className="font-questrial text-[22px] tracking-[0.3em] text-[#0F3934]">{pickupCode(order.$id)}</span>
        </div>

        {/* Claim Info Card */}
        <div className="w-full bg-white border border-black/10 rounded-[20px] p-[5px] flex items-center gap-[16px] mb-[32px]">
          <div className="w-[80px] h-[80px] rounded-[16px] overflow-hidden bg-[#F9F9F9] flex-shrink-0">
            {order.listingImageUrl ? (
              <img src={order.listingImageUrl} alt={order.listingName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between items-start py-1">
            <h3 className="font-questrial text-[16px] text-[#0A2623] truncate w-full font-medium text-left">{order.listingName}</h3>
            
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-questrial text-[14px] text-[#0A2623]/70 truncate max-w-[150px]">{order.vendorName}</span>
              <ShieldCheck size={16} className="text-[#7AD371] flex-shrink-0" />
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-[#0A2623]/70">
              <Clock size={16} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="font-questrial text-[12px] truncate">{order.pickupTime}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mb-[24px]">
          <Link
            to="/orders"
            className="w-full h-[50px] rounded-full border border-black/10 bg-white hover:bg-neutral-50 font-questrial text-[16px] text-[#0A2623] flex items-center justify-center gap-2.5 transition-all"
          >
            <Package size={18} strokeWidth={1.5} />
            <span>Track My Orders</span>
          </Link>

          <a
            href={mapQuery}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[50px] rounded-full bg-[#0F3934] hover:bg-[#0A2623] text-white font-questrial text-[16px] flex items-center justify-center gap-2.5 transition-all shadow-sm"
          >
            <MapPin size={18} strokeWidth={1.5} />
            <span>Get Directions</span>
          </a>
        </div>

      </div>
    </div>
  );
}
