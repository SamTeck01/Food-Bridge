import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FoodCard from '../../components/FoodCard';
import { useApp } from '../../context/AppContext';
import type { Listing } from '../../services/listings.service';
import { getListingById } from '../../services/listings.service';

const SavedPage = () => {
  const { savedIds, toggleSave, isSaved } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [now] = useState(() => Date.now());
  // Drop listings that were un-saved since the last fetch
  const visible = listings.filter((l) => savedIds.includes(l.$id));

  useEffect(() => {
    if (savedIds.length === 0) return;
    Promise.all(savedIds.map((id) => getListingById(id).catch(() => null)))
      .then((results) => setListings(results.filter(Boolean) as Listing[]))
      .finally(() => setLoading(false));
  }, [savedIds]);

  // compute timeLeft helper
  const getTimeLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] pb-24 md:pb-12">
      <main className="flex-1 py-8 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#7AD371]/20">
            <Heart size={20} className="text-[#0F3934]" fill="#0F3934" />
          </div>
          <div>
            <h1 className="font-questrial text-2xl text-[#0A2623]">Saved Listings</h1>
            <p className="font-questrial text-sm text-[#0A2623]/60">{visible.length} saved item{visible.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {savedIds.length > 0 && loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] h-[260px] animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-black/10">
              <Heart size={32} className="text-[#0A2623]/30" />
            </div>
            <div>
              <h2 className="font-questrial text-xl text-[#0A2623] mb-2">No saved listings yet</h2>
              <p className="font-questrial text-sm text-[#0A2623]/60 max-w-xs">
                Tap the heart icon on any listing to save it here for quick access.
              </p>
            </div>
            <Link to="/listings" className="btn-primary !h-10 !px-6 !text-sm">Explore Listings</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map((listing) => (
              <FoodCard
                key={listing.$id}
                id={listing.$id}
                name={listing.name}
                originalPrice={listing.originalPrice}
                discountedPrice={listing.discountedPrice}
                timeLeft={listing.expiresAt ? getTimeLeft(listing.expiresAt) : 'Pickup: ' + listing.pickupTime}
                claimsUsed={listing.claimsUsed}
                claimsTotal={listing.quantity + listing.claimsUsed}
                distance=""
                vendorName={listing.vendorName}
                imageUrl={listing.imageUrl}
                isSaved={isSaved(listing.$id)}
                onSave={(e) => { e.preventDefault(); toggleSave(listing.$id); }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedPage;
