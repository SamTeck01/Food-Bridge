import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Flame, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FoodCardProps {
  id?: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  timeLeft: string;
  claimsUsed: number;
  claimsTotal: number;
  distance: string;
  vendorName: string;
  imageUrl?: string;
  isFeatured?: boolean;
  pickupTime?: string;
  vendorVerified?: boolean;
}

const FoodCard = ({
  id = '1',
  name,
  originalPrice,
  discountedPrice,
  timeLeft,
  claimsUsed,
  claimsTotal,
  distance,
  vendorName,
  imageUrl,
  isFeatured = false,
  pickupTime = 'Before 8:00 PM',
  vendorVerified = false,
}: FoodCardProps) => {
  const { addToCart, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const soldOut = claimsUsed >= claimsTotal;
  const discountPercent = Math.round((1 - discountedPrice / originalPrice) * 100);
  const claimsLeft = claimsTotal - claimsUsed;
  const urgent = claimsLeft <= 2 && !soldOut;

  const handleClaim = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { navigate('/login'); return; }
    if (soldOut) return;
    addToCart({ id, name, vendorName, vendorId: '', originalPrice, discountedPrice, imageUrl: imageUrl || '', pickupTime, distance });
    navigate('/cart');
  };

  return (
    <Link
      to={`/listing/${id}`}
      className={`group flex flex-col bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
        isFeatured ? 'col-span-2 row-span-2' : ''
      }`}
      style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06), 0 1px 2px rgba(10,38,35,0.04)' }}
    >
      {/* Image */}
      <div className={`relative w-full overflow-hidden bg-[#F0F4F1] ${isFeatured ? 'h-56' : 'h-44'}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Discount badge — top left */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0F3934] text-white text-xs font-questrial">
            {discountPercent}% OFF
          </div>
        )}

        {/* Urgent / sold out overlay */}
        {soldOut ? (
          <div className="absolute inset-0 bg-[#0A2623]/60 flex items-center justify-center">
            <span className="font-questrial text-white text-sm bg-[#0A2623]/80 px-4 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        ) : urgent && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EF4444] text-white text-xs font-questrial">
            <Flame size={11} />
            {claimsLeft} left!
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Vendor */}
        <div className="flex items-center gap-1.5">
          <span className="font-questrial text-xs text-text-secondary truncate">{vendorName}</span>
          {vendorVerified && (
            <ShieldCheck size={12} className="text-brand-primary flex-shrink-0" />
          )}
        </div>

        {/* Name */}
        <h3 className="font-questrial text-base text-text-primary leading-snug line-clamp-2 -mt-1">
          {name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="font-questrial text-xl text-text-primary">
            ₦{discountedPrice.toLocaleString()}
          </span>
          <span className="font-questrial text-sm text-text-muted line-through">
            ₦{originalPrice.toLocaleString()}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 font-questrial text-xs text-text-secondary">
            <Clock size={12} className="text-text-muted" />
            {timeLeft}
          </span>
          <span className="flex items-center gap-1 font-questrial text-xs text-text-secondary">
            <MapPin size={12} className="text-text-muted" />
            {distance}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-questrial text-xs text-text-muted">
              {claimsUsed}/{claimsTotal} claimed
            </span>
            {!soldOut && (
              <span className={`font-questrial text-xs ${urgent ? 'text-[#EF4444]' : 'text-text-muted'}`}>
                {claimsLeft} left
              </span>
            )}
          </div>
          <div className="w-full h-1 bg-[#F0F4F1] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${soldOut ? 'bg-text-muted' : urgent ? 'bg-[#EF4444]' : 'bg-brand-primary'}`}
              style={{ width: claimsTotal > 0 ? `${Math.min(100, (claimsUsed / claimsTotal) * 100)}%` : '0%' }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          className={`mt-auto w-full h-10 rounded-full font-questrial text-sm transition-all duration-200 ${
            soldOut
              ? 'bg-[#F0F4F1] text-text-muted border border-border cursor-not-allowed'
              : 'bg-[#0F3934] text-white hover:bg-[#1A4A3F] hover:shadow-md active:scale-[0.97]'
          }`}
          onClick={handleClaim}
          disabled={soldOut}
        >
          {soldOut ? 'Sold Out' : 'Claim Now'}
        </button>
      </div>
    </Link>
  );
};

export default FoodCard;
