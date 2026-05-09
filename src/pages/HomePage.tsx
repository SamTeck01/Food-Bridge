import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import Footer from '../components/Footer';
import Features from '../components/homepage/Features';
import Hero from '../components/homepage/Hero';
import Navbar from '../components/Navbar';
import type { Listing } from '../services/listings.service';
import { getListings } from '../services/listings.service';

const HomePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings(3) // Fetching top 3 for the preview
      .then(setListings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Available Listings Section */}
        <section className="py-24 px-6">
          <div className="max-w-[77.5rem] mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-[2.5rem] text-[#0A2623] font-normal">Available Near You</h2>
                <p className="text-[#0A2623B2]">Fresh surplus meals ready for pickup.</p>
              </div>
              <Link to="/listings" className="hidden md:block text-[#0F3934] font-medium border-b border-[#0F3934]">
                View all listings
              </Link>
            </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {loading ? (
    <p>Loading fresh meals...</p>
  ) : (
    listings.map((listing) => (
      <FoodCard 
        key={listing.$id}
        id={listing.$id}
        name={listing.name}
        originalPrice={listing.originalPrice}
        discountedPrice={listing.discountedPrice}
        vendorName={listing.vendorName}
        imageUrl={listing.imageUrl}
        distance={listing.distance ?? ''}
        claimsUsed={listing.claimsUsed}
        // Map the specific names expected by FoodCard:
        timeLeft={listing.pickupTime} 
        claimsTotal={listing.quantity + listing.claimsUsed}
      />
    ))
  )}
</div>
          </div>
        </section>

        <Features />
        
        {/* CTA Banner */}
        <section className="px-6 pb-24">
          <div className="max-w-[77.5rem] mx-auto bg-[#0F3934] rounded-[3rem] p-16 relative overflow-hidden text-center">
             <h2 className="text-[2.5rem] text-white mb-6">Are you a food vendor?</h2>
             <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg">
               Turn your end-of-day surplus into extra revenue and help your community.
             </p>
             <Link to="/get-started" className="inline-block px-12 py-5 bg-[#7AD371] text-[#0A2623] rounded-full font-bold">
               Partner with us
             </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;