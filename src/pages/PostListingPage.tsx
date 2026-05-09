import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { Upload, X, Plus, Minus, AlertCircle, Clock, CheckSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createListing } from '../services/listings.service';

const CATEGORIES = ['Rice Dishes', 'Stew & Soups', 'Snacks', 'Pastries', 'Beverages', 'Swallow', 'Other'];
const ALLERGENS  = ['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish'];

interface FormState {
  mealName:       string;
  description:    string;
  category:       string;
  allergens:      string[];
  quantity:       number;
  originalPrice:  string;
  discountedPrice:string;
  isFree:         boolean;
  pickupTime:     string;
  expiresAt:      string;
  imageFiles:     File[];
  imagePreviews:  string[];
}

const PostListingPage = () => {
  const navigate = useNavigate();
  const { user }  = useApp();
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    mealName:        '',
    description:     '',
    category:        '',
    allergens:       [],
    quantity:        1,
    originalPrice:   '',
    discountedPrice: '',
    isFree:          false,
    pickupTime:      '',
    expiresAt:       '',
    imageFiles:      [],
    imagePreviews:   [],
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({
      ...prev,
      imageFiles:    [...prev.imageFiles,   ...files   ].slice(0, 4),
      imagePreviews: [...prev.imagePreviews, ...previews].slice(0, 4),
    }));
  };

  const removeImage = (i: number) =>
    setForm((prev) => ({
      ...prev,
      imageFiles:    prev.imageFiles.filter((_, j) => j !== i),
      imagePreviews: prev.imagePreviews.filter((_, j) => j !== i),
    }));

  const toggleAllergen = (a: string) =>
    set('allergens', form.allergens.includes(a)
      ? form.allergens.filter((x) => x !== a)
      : [...form.allergens, a]);

  const discountPct =
    form.originalPrice && form.discountedPrice && !form.isFree
      ? Math.round(
          ((Number(form.originalPrice) - Number(form.discountedPrice)) / Number(form.originalPrice)) * 100
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createListing({
        vendorId:       user?.id ?? 'unknown',
        vendorName:     user?.name ?? 'Unknown Vendor',
        name:           form.mealName,
        description:    form.description,
        originalPrice:  Number(form.originalPrice),
        discountedPrice:form.isFree ? 0 : Number(form.discountedPrice),
        quantity:       form.quantity,
        pickupTime:     form.pickupTime,
        expiresAt:      form.expiresAt,
        allergens:      form.allergens,
        imageFile:      form.imageFiles[0],
      });
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Failed to post listing. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg pb-24 md:pb-0">
      <Navbar />

      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-[1040px] mx-auto">

          {/* ── Page header ────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-brand-primary transition-all">
                ←
              </Link>
              <div>
                <h1 className="font-questrial text-2xl text-text-primary">Post Listing</h1>
                <p className="font-questrial text-sm text-text-muted">Share surplus food with your community</p>
              </div>
            </div>
            <Link to="/dashboard"
              className="hidden sm:flex items-center gap-1.5 h-10 px-5 rounded-full border border-border font-questrial text-sm text-text-primary hover:border-[#EF4444] hover:text-[#EF4444] transition-all">
              Cancel <X size={14} />
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

              {/* ── Left column ─────────────────────────────────── */}
              <div className="flex flex-col gap-5">

                {/* Photo upload */}
                <div className="bg-white rounded-2xl border border-border p-6"
                  style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                  <h2 className="font-questrial text-base text-text-primary mb-1">Upload Photo</h2>
                  <p className="font-questrial text-xs text-text-muted mb-4">We accept PNG &amp; JPG files, up to 5MB</p>

                  <div className="flex flex-wrap gap-3">
                    {form.imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-[120px] h-[90px] rounded-xl overflow-hidden border border-border">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-brand-primary text-white text-[9px] px-1.5 py-0.5 rounded-full font-questrial">
                            Cover
                          </span>
                        )}
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}

                    {form.imagePreviews.length < 4 && (
                      <>
                        <button type="button" onClick={() => imageInputRef.current?.click()}
                          className="w-[120px] h-[90px] rounded-xl border-2 border-dashed border-border hover:border-brand-primary flex flex-col items-center justify-center gap-2 transition-colors group">
                          <Upload size={18} className="text-text-muted group-hover:text-brand-primary transition-colors" />
                          <span className="font-questrial text-xs text-text-muted group-hover:text-brand-primary transition-colors">
                            Browse Files
                          </span>
                        </button>
                        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                      </>
                    )}
                  </div>
                </div>

                {/* Food info */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4"
                  style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                  <h2 className="font-questrial text-base text-text-primary">Food Details</h2>

                  {/* Name */}
                  <div className="input-group">
                    <label className="input-label">Food Name <span className="text-state-error">*</span></label>
                    <input
                      type="text" required
                      className="input-field"
                      placeholder="Your food name"
                      value={form.mealName}
                      onChange={(e) => set('mealName', e.target.value)}
                    />
                  </div>

                  {/* Category + Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">Category <span className="text-state-error">*</span></label>
                      <select required className="input-field bg-white" value={form.category} onChange={(e) => set('category', e.target.value)}>
                        <option value="" disabled>Select category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Quantity <span className="text-state-error">*</span></label>
                      <div className="flex items-center gap-3 h-11">
                        <button type="button" onClick={() => set('quantity', Math.max(1, form.quantity - 1))}
                          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-brand-primary transition-all bg-white flex-shrink-0">
                          <Minus size={15} />
                        </button>
                        <input
                          type="number" min={1} required
                          className="input-field text-center w-20"
                          value={form.quantity}
                          onChange={(e) => set('quantity', Math.max(1, Number(e.target.value)))}
                        />
                        <button type="button" onClick={() => set('quantity', form.quantity + 1)}
                          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-brand-primary transition-all bg-white flex-shrink-0">
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="input-group">
                    <label className="input-label">Description (Optional)</label>
                    <textarea
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Enter food description — ingredients, taste, portion size…"
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                    />
                  </div>

                  {/* Allergens */}
                  <div>
                    <label className="input-label mb-2">Allergens</label>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGENS.map((a) => (
                        <button key={a} type="button" onClick={() => toggleAllergen(a)}
                          className={`px-3 py-1.5 rounded-full border font-questrial text-sm transition-all ${
                            form.allergens.includes(a)
                              ? 'bg-brand-secondary text-white border-brand-secondary'
                              : 'bg-bg border-border text-text-secondary hover:border-brand-primary'
                          }`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4"
                  style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                  <h2 className="font-questrial text-base text-text-primary">Pricing</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">Original Price (₦) <span className="text-state-error">*</span></label>
                      <input type="number" required min={0} className="input-field" placeholder="0.00"
                        value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Discounted Price (₦) <span className="text-state-error">*</span></label>
                      <input type="number" required={!form.isFree} min={0} disabled={form.isFree}
                        className="input-field disabled:opacity-50 disabled:cursor-not-allowed" placeholder="0.00"
                        value={form.isFree ? '0' : form.discountedPrice}
                        onChange={(e) => set('discountedPrice', e.target.value)} />
                    </div>
                  </div>

                  {/* Mark as free */}
                  <button type="button" onClick={() => set('isFree', !form.isFree)}
                    className="flex items-center gap-2.5 w-fit">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      form.isFree ? 'bg-brand-secondary border-brand-secondary' : 'border-border'
                    }`}>
                      {form.isFree && <CheckSquare size={12} className="text-white" />}
                    </div>
                    <span className="font-questrial text-sm text-text-primary">Mark as FREE</span>
                  </button>

                  {discountPct > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#7AD37115] border border-brand-primary/30">
                      <span className="font-questrial text-sm text-brand-secondary">
                        🎉 You're offering a <strong className="text-brand-primary">{discountPct}% discount</strong> — great for reducing waste!
                      </span>
                    </div>
                  )}
                </div>

                {/* Pickup */}
                <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4"
                  style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                  <h2 className="font-questrial text-base text-text-primary">Pickup Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label">Pickup Time <span className="text-state-error">*</span></label>
                      <div className="relative">
                        <input type="time" required className="input-field pr-10"
                          value={form.pickupTime} onChange={(e) => set('pickupTime', e.target.value)} />
                        <Clock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Expires At <span className="text-state-error">*</span></label>
                      <div className="relative">
                        <input type="datetime-local" required className="input-field pr-10"
                          value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)} />
                        <Clock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right column: preview ────────────────────────── */}
              <div className="lg:sticky lg:top-24 flex flex-col gap-5 h-fit">
                <div className="bg-white rounded-2xl border border-border p-6"
                  style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                  <h2 className="font-questrial text-base text-text-primary mb-4">Preview Post</h2>

                  {/* Mini food card */}
                  <div className="rounded-2xl border border-border overflow-hidden">
                    {/* Image */}
                    <div className="w-full h-[140px] bg-[#F0F4F1] flex items-center justify-center">
                      {form.imagePreviews[0]
                        ? <img src={form.imagePreviews[0]} alt="" className="w-full h-full object-cover" />
                        : <span className="text-4xl">🍽️</span>
                      }
                    </div>
                    {/* Info */}
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-questrial text-sm text-text-primary">{form.mealName || 'Your meal name'}</p>
                        {form.category && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F0F4F1] font-questrial text-[10px] text-text-muted flex-shrink-0">
                            {form.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {form.originalPrice && !form.isFree && (
                          <span className="font-questrial text-xs text-text-muted line-through">
                            ₦{Number(form.originalPrice).toLocaleString()}
                          </span>
                        )}
                        <span className="font-questrial text-lg text-text-primary">
                          {form.isFree ? 'FREE' : form.discountedPrice
                            ? `₦${Number(form.discountedPrice).toLocaleString()}`
                            : '₦0'}
                        </span>
                        {discountPct > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#7AD37120] text-[#0F3934] font-questrial text-[10px]">
                            -{discountPct}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-border">
                        {form.pickupTime && (
                          <span className="flex items-center gap-1 font-questrial text-xs text-text-muted">
                            <Clock size={10} /> {form.pickupTime}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-questrial text-xs text-text-muted">
                          🔥 0/{form.quantity} claims
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[#EF444415] border border-[#EF444430]">
                    <AlertCircle size={16} className="text-state-error flex-shrink-0 mt-0.5" />
                    <p className="font-questrial text-sm text-state-error">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full !h-12 !text-base flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Posting…' : 'Post Listing'}
                </button>

                <p className="font-questrial text-xs text-text-muted text-center">
                  Your listing will be visible to buyers in your area immediately.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default PostListingPage;
