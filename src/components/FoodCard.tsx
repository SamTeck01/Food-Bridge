import { Link } from 'react-router-dom';
import { MapPin, Clock, Flame, Heart } from 'lucide-react';
import { getListingImage } from '../services/listings.service';

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
  isSaved?: boolean;
  onSave?: (e: React.MouseEvent) => void;
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
  isSaved = false,
  onSave,
}: FoodCardProps) => {
  const soldOut = claimsUsed >= claimsTotal;
  const discountPercent = Math.round((1 - discountedPrice / originalPrice) * 100);

  return (
    <Link
      to={`/listings/${id}`}
      className="group flex flex-col bg-white rounded-[20px] p-[5px] border border-black/10 overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full"
      style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}
    >
      {/* Image Container */}
      <div className="relative h-[120px] w-full rounded-[16px] overflow-hidden bg-[#F9F9F9]">
        <img
          src={getListingImage(name, imageUrl)}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0F3934] text-white text-[11px] font-questrial font-medium">
            {discountPercent}% OFF
          </div>
        )}

        {/* Sold Out Overlay */}
        {soldOut && (
          <div className="absolute inset-0 bg-[#0A2623]/60 flex items-center justify-center">
            <span className="font-questrial text-white text-xs bg-[#0A2623]/80 px-3.5 py-1.5 rounded-full font-medium">
              Sold Out
            </span>
          </div>
        )}

        {/* Save / Heart button */}
        {onSave && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave(e); }}
            className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm"
          >
            <Heart
              size={15}
              className={isSaved ? 'text-red-500' : 'text-[#0A2623]/50'}
              fill={isSaved ? '#EF4444' : 'none'}
            />
          </button>
        )}
      </div>

      {/* Details Container */}
      <div className="flex flex-col p-[20px] gap-[15px] self-stretch">
        {/* Name & Pricing row */}
        <div className="flex justify-between items-start gap-[15px] self-stretch">
          <div className="flex flex-col items-start gap-[4px] flex-1 min-w-0">
            <h3 className="text-[#0A2623] font-questrial text-[16px] font-normal leading-[130%] truncate w-full" title={name}>
              {name}
            </h3>
            {vendorName && (
              <span className="text-[#0A2623]/40 font-questrial text-[12px] leading-[130%] truncate w-full">{vendorName}</span>
            )}
            <span className="text-[#0A2623]/30 font-questrial text-[14px] font-normal leading-[130%] line-through">
              ₦{originalPrice.toLocaleString()}
            </span>
          </div>
          <span className="text-[#0A2623] font-questrial text-[24px] font-normal leading-[130%] whitespace-nowrap">
            ₦{discountedPrice.toLocaleString()}
          </span>
        </div>

        {/* Divider line */}
        <div className="h-[1px] bg-black/10 self-stretch"></div>

        {/* Meta Widgets row */}
        <div className="flex items-center gap-[12px] self-stretch">
          {/* Time widget */}
          <div className="flex items-center gap-[10px] flex-1 min-w-0 text-[#0A2623]/70">
            <Clock size={20} strokeWidth={1.25} className="text-[#0A2623]/70 flex-shrink-0" />
            <span className="font-questrial text-[14px] leading-[130%] whitespace-nowrap text-[#0A2623]/70 truncate">
              {timeLeft}
            </span>
          </div>

          {/* Claims widget */}
          <div className="flex items-center gap-[8px] flex-shrink-0 text-[#0A2623]/70">
            <Flame size={20} strokeWidth={1.25} className="text-[#0A2623]/70 flex-shrink-0" />
            <span className="font-questrial text-[16px] leading-[130%] text-[#0A2623]/70 whitespace-nowrap">
              {claimsUsed}/{claimsTotal} claims
            </span>
          </div>

          {/* Distance widget (if available) */}
          {distance && (
            <div className="flex items-center gap-[8px] flex-shrink-0 text-[#0A2623]/70">
              <MapPin size={20} strokeWidth={1.25} className="text-[#0A2623]/70 flex-shrink-0" />
              <span className="font-questrial text-[14px] leading-[130%] text-[#0A2623]/70 whitespace-nowrap">
                {distance}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
