import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronLeft, Upload, Plus, Minus, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { createListing } from '../services/listings.service';

type Step = 1 | 2;

interface FormState {
  // Step 1 - Meal Info
  mealName: string;
  description: string;
  category: string;
  allergens: string[];
  portionSize: string;
  expiresAt: string;
  imageFiles: File[];       // actual File objects for upload
  imagePreviews: string[]; // object URLs for preview

  // Step 2 - Pricing & Pickup
  originalPrice: string;
  discountedPrice: string;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
  pickupAddress: string;
  instructions: string;
}

const CATEGORIES = ['Rice Dishes', 'Stew & Soups', 'Snacks', 'Pastries', 'Beverages', 'Swallow', 'Other'];
const ALLERGEN_LIST = ['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish'];

const STEP_LABELS = ['Meal Details', 'Pricing & Pickup'];

const PostListingPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    mealName: '',
    description: '',
    category: '',
    allergens: [],
    portionSize: '',
    expiresAt: '',
    imageFiles: [],
    imagePreviews: [],
    originalPrice: '',
    discountedPrice: '',
    quantity: 1,
    pickupStart: '',
    pickupEnd: '',
    pickupAddress: '',
    instructions: '',
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...newFiles].slice(0, 4),
      imagePreviews: [...prev.imagePreviews, ...newPreviews].slice(0, 4),
    }));
  };

  const removeImage = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== idx),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== idx),
    }));

  const toggleAllergen = (a: string) =>
    set(
      'allergens',
      form.allergens.includes(a)
        ? form.allergens.filter((x) => x !== a)
        : [...form.allergens, a]
    );

  const discount =
    form.originalPrice && form.discountedPrice
      ? Math.round(
          ((Number(form.originalPrice) - Number(form.discountedPrice)) /
            Number(form.originalPrice)) *
            100
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Step 2 — submit to Appwrite
    setLoading(true);
    setError('');
    try {
      await createListing({
        vendorId: user?.id ?? 'unknown',
        vendorName: user?.name ?? 'Unknown Vendor',
        name: form.mealName,
        description: form.description,
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        quantity: form.quantity,
        pickupTime: `${form.pickupStart} – ${form.pickupEnd}`,
        expiresAt: form.expiresAt,
        allergens: form.allergens,
        imageFile: form.imageFiles[0], // upload first image
      });
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Failed to post listing. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-[800px] mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-brand-primary transition-all"
            >
              <ChevronLeft size={20} className="text-text-secondary" />
            </button>
            <div>
              <h1 className="font-questrial text-2xl text-text-primary">Post a Listing</h1>
              <p className="font-questrial text-sm text-text-secondary">
                Step {step} of {STEP_LABELS.length} — {STEP_LABELS[step - 1]}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-bg-overlay rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {step === 1 && (
              <>
                {/* Images */}
                <div className="section-card flex flex-col gap-5">
                  <h2 className="font-questrial text-xl text-text-primary">Food Photos</h2>
                  <p className="font-questrial text-sm text-text-secondary -mt-3">
                    Upload up to 4 clear photos of the food. First photo will be the cover.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {form.imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-[150px] h-[100px] rounded-[10px] overflow-hidden border border-border">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
                        >
                          <X size={12} className="text-white" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded-full font-questrial">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                    {form.imagePreviews.length < 4 && (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-[150px] h-[100px] rounded-[10px] border-2 border-dashed border-border hover:border-brand-primary flex flex-col items-center justify-center gap-2 transition-colors group"
                      >
                        <Upload size={20} className="text-text-muted group-hover:text-brand-primary transition-colors" />
                        <span className="font-questrial text-xs text-text-muted group-hover:text-brand-primary transition-colors">Add Photo</span>
                      </button>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* Meal Info */}
                <div className="section-card flex flex-col gap-5">
                  <h2 className="font-questrial text-xl text-text-primary">Meal Information</h2>

                  <div className="input-group">
                    <label className="input-label">Meal Name <span className="text-state-error">*</span></label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="e.g. Jollof Rice + Chicken"
                      value={form.mealName}
                      onChange={(e) => set('mealName', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Description</label>
                    <textarea
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Describe the meal — ingredients, taste, quantity included…"
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="input-group">
                      <label className="input-label">Category <span className="text-state-error">*</span></label>
                      <select
                        required
                        className="input-field bg-bg"
                        value={form.category}
                        onChange={(e) => set('category', e.target.value)}
                      >
                        <option value="" disabled>Select category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Portion Size</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. 1 plate, 500g"
                        value={form.portionSize}
                        onChange={(e) => set('portionSize', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Food Expiry Date/Time <span className="text-state-error">*</span></label>
                    <input
                      type="datetime-local"
                      required
                      className="input-field"
                      value={form.expiresAt}
                      onChange={(e) => set('expiresAt', e.target.value)}
                    />
                  </div>
                </div>

                {/* Allergens */}
                <div className="section-card flex flex-col gap-4">
                  <div>
                    <h2 className="font-questrial text-xl text-text-primary">Allergen Information</h2>
                    <p className="font-questrial text-sm text-text-secondary mt-1">Select all that apply</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {ALLERGEN_LIST.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAllergen(a)}
                        className={`px-4 py-2 rounded-full border font-questrial text-sm transition-all ${
                          form.allergens.includes(a)
                            ? 'bg-brand-secondary text-white border-brand-secondary'
                            : 'bg-bg border-border text-text-secondary hover:border-brand-primary'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Pricing */}
                <div className="section-card flex flex-col gap-5">
                  <h2 className="font-questrial text-xl text-text-primary">Pricing</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="input-group">
                      <label className="input-label">Original Price (₦) <span className="text-state-error">*</span></label>
                      <input
                        type="number"
                        required
                        min={0}
                        className="input-field"
                        placeholder="e.g. 2000"
                        value={form.originalPrice}
                        onChange={(e) => set('originalPrice', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Discounted Price (₦) <span className="text-state-error">*</span></label>
                      <input
                        type="number"
                        required
                        min={0}
                        className="input-field"
                        placeholder="e.g. 500"
                        value={form.discountedPrice}
                        onChange={(e) => set('discountedPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[#7AD37115] border border-brand-primary">
                      <span className="font-questrial text-sm text-brand-secondary">
                        🎉 You're offering a <span className="font-bold text-brand-primary">{discount}% discount</span> — great for reducing waste!
                      </span>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="input-group">
                    <label className="input-label">Number of Portions Available <span className="text-state-error">*</span></label>
                    <div className="flex items-center gap-4 mt-1">
                      <button
                        type="button"
                        onClick={() => set('quantity', Math.max(1, form.quantity - 1))}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-brand-primary transition-all"
                      >
                        <Minus size={16} className="text-text-secondary" />
                      </button>
                      <span className="font-questrial text-xl text-text-primary w-10 text-center">{form.quantity}</span>
                      <button
                        type="button"
                        onClick={() => set('quantity', form.quantity + 1)}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-brand-primary transition-all"
                      >
                        <Plus size={16} className="text-text-secondary" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pickup */}
                <div className="section-card flex flex-col gap-5">
                  <h2 className="font-questrial text-xl text-text-primary">Pickup Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="input-group">
                      <label className="input-label">Pickup Window Start <span className="text-state-error">*</span></label>
                      <input
                        type="time"
                        required
                        className="input-field"
                        value={form.pickupStart}
                        onChange={(e) => set('pickupStart', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Pickup Window End <span className="text-state-error">*</span></label>
                      <input
                        type="time"
                        required
                        className="input-field"
                        value={form.pickupEnd}
                        onChange={(e) => set('pickupEnd', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Pickup Address <span className="text-state-error">*</span></label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Enter full pickup address"
                      value={form.pickupAddress}
                      onChange={(e) => set('pickupAddress', e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Special Instructions</label>
                    <textarea
                      rows={3}
                      className="input-field resize-none"
                      placeholder="e.g. Collect from the back gate, ask for Emeka"
                      value={form.instructions}
                      onChange={(e) => set('instructions', e.target.value)}
                    />
                  </div>
                </div>

                {/* Preview Summary */}
                {(form.mealName || form.discountedPrice) && (
                  <div className="section-card flex flex-col gap-4 border-brand-primary/40">
                    <h2 className="font-questrial text-xl text-text-primary">Listing Preview</h2>
                    <div className="flex items-center gap-4">
                      {form.imagePreviews[0] ? (
                        <img src={form.imagePreviews[0]} alt="" className="w-20 h-20 rounded-[10px] object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-20 h-20 rounded-[10px] bg-bg-overlay border border-border flex-shrink-0" />
                      )}
                      <div className="flex flex-col gap-1">
                        <p className="font-questrial text-lg text-text-primary">{form.mealName || 'Your meal name'}</p>
                        <div className="flex items-center gap-3">
                          {form.originalPrice && (
                            <span className="font-questrial text-sm text-text-secondary line-through">₦{Number(form.originalPrice).toLocaleString()}</span>
                          )}
                          {form.discountedPrice && (
                            <span className="font-questrial text-base text-text-primary">₦{Number(form.discountedPrice).toLocaleString()}</span>
                          )}
                        </div>
                        {form.category && (
                          <span className="text-xs text-text-muted font-questrial">{form.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Error banner */}
            {error && step === 2 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430]">
                <AlertCircle size={18} className="text-state-error flex-shrink-0" />
                <p className="font-questrial text-sm text-state-error">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pb-6">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="btn-outline flex-1"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              <button type="submit" disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-70">
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Posting…' : step === 1 ? 'Continue to Pricing' : 'Post Listing'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostListingPage;
