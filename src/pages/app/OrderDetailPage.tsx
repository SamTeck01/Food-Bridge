import { AlarmClock, ArrowLeft, ArrowUpRight, BadgeCheck, Check, Frown, MapPin, ShoppingBag, Star, ThumbsUp, Timer, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Listing } from '../../services/listings.service';
import { getListingById, getListingImage } from '../../services/listings.service';
import type { Order } from '../../services/orders.service';
import { getOrderById, rateOrder } from '../../services/orders.service';

type Phase = 'progress' | 'completed' | 'missed';

const phaseOf = (status: Order['status']): Phase =>
  status === 'completed' ? 'completed' : status === 'expired' || status === 'cancelled' ? 'missed' : 'progress';

const PHASE_BADGE: Record<Phase, { label: string; timeline: string; cls: string }> = {
  progress:  { label: 'Pickup In Progress',   timeline: 'In progress', cls: 'bg-[#7AD371]/15 text-[#28A745]' },
  completed: { label: 'Picked Up',            timeline: 'Completed',   cls: 'bg-[#7AD371]/15 text-[#28A745]' },
  missed:    { label: 'Pickup Window Missed', timeline: 'Missed',      cls: 'bg-[#EF4444]/10 text-[#EF4444]' },
};

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [rateOpen, setRateOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((o) => {
        setOrder(o);
        return getListingById(o.listingId).then(setListing).catch(() => setListing(null));
      })
      .catch(() => setError('We could not find this order.'));
  }, [id]);

  // Tick once a minute so the countdown stays current
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (error) {
    return (
      <div className="max-w-[77.5rem] mx-auto px-4 md:px-6 py-16 text-center font-questrial">
        <p className="text-[#0A2623]/70 mb-4">{error}</p>
        <Link to="/orders" className="btn-primary">Back to orders</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#7AD371] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const phase = phaseOf(order.status);
  const badge = PHASE_BADGE[phase];
  const qty = order.quantity ?? 1;
  const unitPrice = Math.round(order.totalPaid / qty);
  const minsLeft = listing?.expiresAt ? Math.max(0, Math.floor((new Date(listing.expiresAt).getTime() - now) / 60000)) : null;

  const steps = [
    { title: 'Order Claimed', sub: 'Order claimed and confirmed', at: order.claimedAt, done: true, Icon: Check },
    { title: 'Order Picked Up', sub: 'Your order was successfully picked up', at: phase === 'completed' ? order.$updatedAt : undefined, done: phase === 'completed', Icon: ShoppingBag },
    { title: 'Order Completed', sub: 'Order completed', at: phase === 'completed' ? order.$updatedAt : undefined, done: phase === 'completed', Icon: BadgeCheck },
  ];

  return (
    <div className="max-w-[77.5rem] mx-auto px-4 md:px-6 py-10 font-questrial grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5 items-start">
      {/* Left column */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} aria-label="Back" className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:bg-neutral-50">
            <ArrowLeft size={18} className="text-[#0A2623]" />
          </button>
          <h1 className="text-[24px] text-[#0A2623]">#{order.$id.slice(-6).toUpperCase()}</h1>
        </div>

        <div className="bg-white rounded-[20px] border border-black/10 divide-y divide-black/10">
          <div className="p-6 flex items-center gap-5">
            <img
              src={getListingImage(order.listingName, order.listingImageUrl)}
              alt={order.listingName}
              className="w-[106px] h-[78px] rounded-[10px] object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[24px] text-[#0A2623] truncate">{order.listingName}</p>
              <p className="text-[20px] text-[#0A2623]/70">{order.totalPaid === 0 ? 'Free' : `₦${unitPrice.toLocaleString()}`}</p>
            </div>
            <span className="text-[24px] text-[#0A2623]">x{qty}</span>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <span className={`self-start flex items-center gap-2 px-3 py-1 rounded-full text-sm ${badge.cls}`}>
              {phase === 'missed' ? <Frown size={14} /> : <span className="w-2 h-2 rounded-full bg-current" />}
              {badge.label}
            </span>
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-[10px] border border-black/10 flex items-center justify-center">
                <Timer size={18} className="text-[#0A2623]/70" />
              </span>
              <p className="flex-1 text-[#0A2623]">
                {phase === 'missed' ? 'This order expired before pickup' : phase === 'completed' ? 'Picked up' : `Please arrive before ${order.pickupTime.split('-').pop()?.trim()}`}
              </p>
              {phase === 'progress' && minsLeft !== null && (
                <span className="text-[#EF4444]">{minsLeft} mins remaining</span>
              )}
              {phase !== 'progress' && <span className="text-[#0A2623]">{fmtDate(order.$updatedAt)}</span>}
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <p className="text-[#0A2623]/70">Posted by</p>
            <div className="flex items-center gap-4">
              <span className="w-[60px] h-[60px] rounded-full bg-[#F9F9F9] flex items-center justify-center text-xl text-[#0F3934]">
                {order.vendorName.charAt(0).toUpperCase()}
              </span>
              <p className="text-[20px] text-[#0A2623] flex items-center gap-2">
                {order.vendorName} <BadgeCheck size={18} className="text-[#7AD371]" />
              </p>
            </div>
          </div>

          {listing?.description && (
            <div className="p-6 flex flex-col gap-3">
              <p className="text-[#0A2623]/70">About this food</p>
              <p className="text-[#0A2623] whitespace-pre-line">{listing.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-5 lg:mt-[60px]">
        <div className="bg-white rounded-[20px] border border-black/10 p-7 flex flex-col gap-5">
          <h2 className="text-[24px] text-[#0A2623]">Pickup details</h2>
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-[10px] border border-black/10 flex items-center justify-center"><MapPin size={18} className="text-[#EF4444]" /></span>
            <div className="flex-1">
              <p className="text-sm text-[#0A2623]/70">{order.vendorName}</p>
              <p className="text-[#0A2623]">{order.distance}</p>
            </div>
            <ArrowUpRight size={18} className="text-[#7AD371]" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-[10px] border border-black/10 flex items-center justify-center"><AlarmClock size={18} className="text-[#28A745]" /></span>
            <p className="flex-1 text-sm text-[#0A2623]/70">Pickup Time</p>
            <div className="text-right text-sm text-[#0A2623]">
              <p>{fmtDate(order.claimedAt)}</p>
              <p>{order.pickupTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-black/10 p-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] text-[#0A2623]">Timeline</h2>
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${badge.cls}`}>
              {phase === 'missed' ? <Frown size={14} /> : <span className="w-2 h-2 rounded-full bg-current" />}
              {badge.timeline}
            </span>
          </div>
          <ol className="relative flex flex-col gap-7 pl-1 before:absolute before:left-[20px] before:top-0 before:bottom-0 before:border-l before:border-dashed before:border-black/20">
            {steps.map(({ title, sub, at, done, Icon }) => (
              <li key={title} className="relative flex items-center gap-4">
                <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-[#0F3934] text-white' : 'bg-white border border-black/10 text-[#0A2623]/60'}`}>
                  <Icon size={16} />
                </span>
                <div className="flex-1">
                  <p className="text-[#0A2623]">{title}</p>
                  <p className="text-xs text-[#0A2623]/60">{sub}</p>
                </div>
                {at && <p className="text-xs text-right text-[#0A2623]/70">{fmtDate(at)}<br />{fmtTime(at)}</p>}
              </li>
            ))}
          </ol>
          {phase === 'completed' && (
            <button
              onClick={() => setRateOpen(true)}
              disabled={order.rating != null}
              className="h-11 rounded-full bg-[#0F3934] text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ThumbsUp size={16} /> {order.rating != null ? `You rated ${order.rating}/5` : 'Rate your experience'}
            </button>
          )}
        </div>
      </div>

      {rateOpen && (
        <RateModal
          onClose={() => setRateOpen(false)}
          onSubmit={async (rating, remark) => {
            try {
              setOrder(await rateOrder(order.$id, rating, remark));
              setRateOpen(false);
              toast.success('Thanks for your feedback!');
            } catch {
              toast.error('Could not save your rating. Please try again.');
            }
          }}
        />
      )}
    </div>
  );
}

const RateModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (rating: number, remark: string) => Promise<void> }) => {
  const [rating, setRating] = useState(0);
  const [remark, setRemark] = useState('');
  const [saving, setSaving] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A2623]/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-[600px] bg-white rounded-[20px] p-8 md:p-[60px] font-questrial">
        <button onClick={onClose} aria-label="Close" className="absolute top-8 right-8 text-[#0A2623]/70"><X size={22} /></button>
        <div className="w-[82px] h-[100px] mb-6 relative">
          <ShoppingBag size={82} className="text-[#7AD371]" fill="#7AD371" />
          <Star size={26} className="absolute left-[28px] top-[38px] text-[#0F3934]" fill="#0F3934" />
        </div>
        <h2 className="text-[32px] text-[#0A2623]">Rate your experience</h2>
        <p className="text-[#0A2623]/70 mb-8">Let us know how we did so we can keep improving!</p>
        <p className="text-[#0A2623] mb-3">Rating ({rating}/5)</p>
        <div className="flex justify-between max-w-[480px] mb-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
              <Star size={46} className={n <= rating ? 'text-[#7AD371]' : 'text-[#E5E5E5]'} fill="currentColor" />
            </button>
          ))}
        </div>
        <label className="block text-[#0A2623] mb-3" htmlFor="remark">Review</label>
        <textarea
          id="remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter your remark"
          className="w-full h-[150px] rounded-[10px] border border-black/10 p-4 outline-none focus:border-[#7AD371] resize-none mb-8"
        />
        <button
          disabled={!rating || saving}
          onClick={async () => { setSaving(true); await onSubmit(rating, remark); setSaving(false); }}
          className="w-full h-12 rounded-full bg-[#0F3934] text-white disabled:opacity-50"
        >
          {saving ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </div>
  );
};
