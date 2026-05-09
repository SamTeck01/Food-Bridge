import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Clock, CheckCircle2, Tag, Leaf } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart } = useApp();
  const [promoCode, setPromoCode]     = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]   = useState('');
  const [placed, setPlaced]           = useState(false);

  const subtotal      = cart.reduce((a, i) => a + i.discountedPrice * i.quantity, 0);
  const originalTotal = cart.reduce((a, i) => a + i.originalPrice  * i.quantity, 0);
  const savings       = originalTotal - subtotal;
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total         = subtotal - promoDiscount;
  const itemCount     = cart.reduce((a, i) => a + i.quantity, 0);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'BRIDGE10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try BRIDGE10 for 10% off.');
      setPromoApplied(false);
    }
  };

  const handlePlaceOrder = () => {
    setPlaced(true);
    clearCart();
  };

  /* ── Success state ── */
  if (placed) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-[440px] w-full flex flex-col items-center gap-7 text-center animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-[#7AD37120] border border-brand-primary/20 flex items-center justify-center">
              <CheckCircle2 size={44} className="text-brand-primary" />
            </div>
            <div>
              <h1 className="font-questrial text-2xl text-text-primary mb-2">Order Confirmed! 🎉</h1>
              <p className="font-questrial text-base text-text-secondary leading-relaxed">
                Head to your pickup locations before the listed times to collect your meals.
              </p>
            </div>
            <div className="w-full p-4 rounded-2xl bg-[#7AD37112] border border-brand-primary/20 flex items-start gap-3">
              <Leaf size={18} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
              <p className="font-questrial text-sm text-brand-secondary text-left">
                You saved <strong>₦{savings.toLocaleString()}</strong> and helped reduce food waste! 🌱
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button onClick={() => navigate('/orders')} className="btn-primary flex-1 !h-12">Track Orders</button>
              <button onClick={() => navigate('/listings')} className="btn-secondary flex-1 !h-12">Browse More</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border bg-white hover:border-brand-primary transition-all"
            >
              <ArrowLeft size={18} className="text-text-secondary" />
            </button>
            <div>
              <h1 className="font-questrial text-2xl text-text-primary">Your Cart</h1>
              <p className="font-questrial text-sm text-text-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} ready to claim
              </p>
            </div>
          </div>

          {cart.length === 0 ? (
            /* Empty cart */
            <div className="flex flex-col items-center justify-center py-28 gap-6 text-center">
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#F0F4F1] border border-border text-4xl">
                🛒
              </div>
              <div>
                <p className="font-questrial text-xl text-text-primary mb-2">Your cart is empty</p>
                <p className="font-questrial text-base text-text-secondary">
                  Browse listings and claim discounted food near you
                </p>
              </div>
              <Link to="/listings" className="btn-primary !h-12 !px-10">Browse Food</Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* ── Cart Items ─────────────────────────────────── */}
              <div className="flex-1 flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.id} className="section-card flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full sm:w-[110px] h-[80px] rounded-xl overflow-hidden flex-shrink-0 bg-[#F0F4F1]">
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-questrial text-sm text-text-primary">{item.name}</p>
                          <p className="font-questrial text-xs text-text-muted">{item.vendorName}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#EF444412] transition-colors flex-shrink-0"
                        >
                          <Trash2 size={14} className="text-[#EF4444]" />
                        </button>
                      </div>

                      {/* Pickup meta */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1 font-questrial text-xs text-text-muted">
                          <MapPin size={11} /> {item.distance}
                        </span>
                        <span className="flex items-center gap-1 font-questrial text-xs text-text-muted">
                          <Clock size={11} /> {item.pickupTime}
                        </span>
                      </div>

                      {/* Price + qty */}
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-questrial text-base text-text-primary">
                            ₦{(item.discountedPrice * item.quantity).toLocaleString()}
                          </span>
                          <span className="font-questrial text-xs text-text-muted line-through">
                            ₦{(item.originalPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-brand-primary transition-all bg-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-questrial text-sm w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-brand-primary transition-all bg-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Savings callout */}
                {savings > 0 && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#7AD37110] border border-brand-primary/25">
                    <Tag size={16} className="text-brand-primary flex-shrink-0 mt-0.5" />
                    <p className="font-questrial text-sm text-brand-secondary">
                      You're saving <strong>₦{savings.toLocaleString()}</strong> on this order — food rescued from going to waste! 🌱
                    </p>
                  </div>
                )}
              </div>

              {/* ── Order Summary ───────────────────────────────── */}
              <div className="w-full lg:w-[340px] flex flex-col gap-4 lg:sticky lg:top-24">
                <div className="section-card flex flex-col gap-5">
                  <h2 className="font-questrial text-base text-text-primary">Order Summary</h2>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <span className="font-questrial text-sm text-text-secondary">Subtotal ({itemCount} items)</span>
                      <span className="font-questrial text-sm text-text-primary">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-questrial text-sm text-text-muted">Original value</span>
                      <span className="font-questrial text-sm text-text-muted line-through">₦{originalTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-questrial text-sm text-[#22C55E]">Food Rescue Discount</span>
                      <span className="font-questrial text-sm text-[#22C55E]">-₦{savings.toLocaleString()}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between">
                        <span className="font-questrial text-sm text-brand-primary">Promo (BRIDGE10)</span>
                        <span className="font-questrial text-sm text-brand-primary">-₦{promoDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="h-px bg-border" />
                    <div className="flex justify-between">
                      <span className="font-questrial text-base text-text-primary">Total</span>
                      <span className="font-questrial text-xl text-text-primary">₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input-field flex-1 !h-9 !text-sm"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                      />
                      <button
                        onClick={applyPromo}
                        className="h-9 px-4 rounded-xl border border-[#0F3934] text-[#0F3934] font-questrial text-sm hover:bg-[#0F3934] hover:text-white transition-all flex-shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="font-questrial text-xs text-[#EF4444]">{promoError}</p>}
                    {promoApplied && <p className="font-questrial text-xs text-[#22C55E]">✓ Promo applied — 10% off!</p>}
                  </div>

                  <button onClick={handlePlaceOrder} className="btn-primary w-full !h-12 !text-base">
                    Confirm & Claim All
                  </button>

                  <p className="font-questrial text-xs text-text-muted text-center">
                    Payment is made at pickup. You'll receive confirmation via email.
                  </p>
                </div>

                {/* Pickup summary */}
                <div className="section-card flex flex-col gap-3">
                  <h3 className="font-questrial text-sm text-text-primary">Pickup Locations</h3>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <MapPin size={13} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-questrial text-sm text-text-primary">{item.vendorName}</p>
                        <p className="font-questrial text-xs text-text-muted">{item.distance} · {item.pickupTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
