import { AlertCircle, Clock, Minus, Plus, Upload, X, CheckCheck, Flame, CheckSquare } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { createListing, getListingById, updateListing, uploadFoodImage } from '../../services/listings.service';
import type { Listing } from '../../services/listings.service';

const CATEGORIES = ['Rice Dishes', 'Stew & Soups', 'Snacks', 'Pastries', 'Beverages', 'Swallow', 'Other'];
const ALLERGENS  = ['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Fish'];

interface FormState {
  mealName:        string;
  description:     string;
  category:        string;
  allergens:       string[];
  quantity:        number;
  originalPrice:   string;
  discountedPrice: string;
  isFree:          boolean;
  pickupTime:      string;
  expiresAt:       string;
  imageFiles:      File[];
  imagePreviews:   string[];
}

const PostListingPage = () => {
  const navigate = useNavigate();
  const { user }  = useApp();
  const [searchParams] = useSearchParams();
  const editId    = searchParams.get('edit'); // present when editing
  const isEditing = !!editId;

  const [loading,     setLoading]     = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEditing);
  const [error,       setError]       = useState('');
  const [createdListing, setCreatedListing] = useState<Listing | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
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

  // Prefill form when in edit mode
  useEffect(() => {
    if (!editId) return;
    getListingById(editId)
      .then((listing) => {
        setForm({
          mealName:        listing.name,
          description:     listing.description || '',
          category:        '',
          allergens:       listing.allergens || [],
          quantity:        listing.quantity,
          originalPrice:   String(listing.originalPrice),
          discountedPrice: listing.discountedPrice === 0 ? '' : String(listing.discountedPrice),
          isFree:          listing.discountedPrice === 0,
          pickupTime:      listing.pickupTime,
          expiresAt:       listing.expiresAt ? listing.expiresAt.slice(0, 16) : '',
          imageFiles:      [],
          imagePreviews:   listing.imageUrl ? [listing.imageUrl] : [],
        });
      })
      .catch(() => setError('Could not load listing details for editing.'))
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({
      ...prev,
      imageFiles:    [...prev.imageFiles,    ...files   ].slice(0, 4),
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
    setError('');

    const origNum = Number(form.originalPrice);
    const discNum = form.isFree ? 0 : Number(form.discountedPrice);

    if (!form.isFree && discNum >= origNum) {
      setError('Discounted price must be lower than the original price.');
      return;
    }
    if (!form.isFree && discNum < 0) {
      setError('Discounted price cannot be negative.');
      return;
    }
    if (form.expiresAt && new Date(form.expiresAt).getTime() <= Date.now()) {
      setError('Expiry date/time must be in the future.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && editId) {
        let newImageUrl: string | undefined;
        if (form.imageFiles[0]) {
          try {
            newImageUrl = await uploadFoodImage(form.imageFiles[0]);
          } catch (uploadErr) {
            console.warn('Image upload failed during edit:', uploadErr);
          }
        }
        await updateListing(editId, {
          name:            form.mealName,
          description:     form.description,
          originalPrice:   origNum,
          discountedPrice: discNum,
          quantity:        form.quantity,
          pickupTime:      form.pickupTime,
          expiresAt:       form.expiresAt,
          allergens:       form.allergens,
          ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
        });
        navigate('/vendor/listings');
      } else {
        const res = await createListing({
          vendorId:        user?.id ?? 'unknown',
          vendorName:      user?.name ?? 'Unknown Vendor',
          name:            form.mealName,
          description:     form.description,
          originalPrice:   origNum,
          discountedPrice: discNum,
          quantity:        form.quantity,
          pickupTime:      form.pickupTime,
          expiresAt:       form.expiresAt,
          allergens:       form.allergens,
          imageFile:       form.imageFiles[0],
        });
        setCreatedListing(res);
        setShowSuccess(true);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to save listing. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!createdListing) return;
    const shareUrl = `${window.location.origin}/listings/${createdListing.$id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  };

  // ── Success Step Screen ──────────────────────────────────────────
  if (showSuccess && createdListing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6 h-20 max-w-[1040px] mx-auto w-full">
          <div className="flex items-center gap-1.5">
            <img src="/images/homepage/logo.svg" alt="FoodBridge" className="h-10 w-auto" />
          </div>
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="flex items-center gap-2 h-10 px-5 rounded-full border border-black/10 bg-white font-questrial text-sm font-semibold text-[rgba(10,38,35,0.7)] hover:border-red-500 hover:text-red-500 transition-all cursor-pointer"
          >
            Close <X size={15} />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-[400px] flex flex-col items-center gap-10 text-center">
            {/* Checked badge */}
            <div className="flex flex-col items-center gap-6">
              <div className="w-[100px] h-[100px] rounded-full bg-[#E5F2E8] border border-[#28A745]/15 flex items-center justify-center text-[#28A745] shadow-sm">
                <CheckCheck size={48} strokeWidth={2.5} />
              </div>
              <h1 className="font-questrial text-[36px] text-[#0A2623] font-normal leading-tight">
                Your listing is LIVE!
              </h1>
            </div>

            {/* Real-time Listing Card Preview */}
            <div
              className="bg-white rounded-[24px] border border-black/10 overflow-hidden p-1.5 flex flex-col text-left w-full shadow-[0_1px_3px_rgba(10,38,35,0.06)]"
            >
              <div className="h-[120px] w-full bg-[#F0F9EF] overflow-hidden rounded-t-[19.2px]">
                {form.imagePreviews[0] ? (
                  <img
                    src={form.imagePreviews[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-[#F0F9EF]">
                    🍽️
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="font-questrial text-[19px] text-[#0A2623] font-semibold truncate">
                      {createdListing.name}
                    </p>
                    <p className="font-questrial text-[19px] text-[rgba(10,38,35,0.3)] line-through">
                      ₦{createdListing.originalPrice.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-questrial text-[28.8px] text-[#0A2623] font-semibold">
                    ₦{createdListing.discountedPrice.toLocaleString()}
                  </p>
                </div>
                <div className="h-[1.2px] bg-black/10" />
                <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={20} />
                    <span className="font-questrial text-[16.8px]">
                      {createdListing.pickupTime || '60 mins left'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame size={20} className="text-[#28A745]" />
                    <span className="font-questrial text-[19px] font-semibold text-[#0A2623]">
                      0/{createdListing.quantity} claims
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={handleShare}
                className="flex-1 h-[45px] rounded-full border border-black/10 bg-white font-questrial text-[16px] font-semibold text-[rgba(10,38,35,0.7)] hover:bg-neutral-50 transition-all cursor-pointer"
              >
                {copied ? 'Link Copied!' : 'Share'}
              </button>
              <button
                onClick={() => navigate(`/vendor/listings/${createdListing.$id}`)}
                className="flex-1 h-[45px] rounded-full bg-[#0F3934] text-white font-questrial text-[16px] font-semibold hover:bg-[#0A2623] transition-all cursor-pointer"
              >
                View Listing
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Form Step Screen ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] pb-12">
      {/* Edit loading overlay */}
      {loadingEdit && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#7AD371] border-t-transparent rounded-full animate-spin" />
            <p className="font-questrial text-sm text-[#0A2623]/70">Loading listing…</p>
          </div>
        </div>
      )}

      <header className="max-w-[1040px] w-full mx-auto px-4 md:px-6 h-[100px] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/vendor/dashboard"><img src="/images/homepage/logo.svg" alt="FoodBridge" className="h-10 w-auto" /></Link>
          <span className="w-px h-8 bg-black/10" />
          <h1 className="font-questrial text-[24px] text-[#0A2623]">{isEditing ? 'Edit Listing' : 'Post Listing'}</h1>
        </div>
        <Link
          to="/vendor/listings"
          className="flex items-center gap-2 h-10 px-5 rounded-full border border-black/10 bg-white font-questrial text-sm text-[rgba(10,38,35,0.7)] hover:border-red-500 hover:text-red-500 transition-all"
        >
          Cancel <X size={14} />
        </Link>
      </header>

      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-[1040px] mx-auto">

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_333px] gap-8">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {/* Photo Upload Container */}
              <div className="flex flex-col gap-3.5 w-full">
                <span className="font-questrial text-[16px] text-[#0A2623]">Upload photo</span>
                
                {form.imagePreviews.length > 0 ? (
                  <div className="flex flex-wrap gap-3 p-4 rounded-2xl border border-black/10 bg-white">
                    {form.imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-[120px] h-[90px] rounded-xl overflow-hidden border border-black/10">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#0F3934] text-white text-[9px] px-1.5 py-0.5 rounded-full font-questrial">
                            Cover
                          </span>
                        )}
                        {(!isEditing || form.imageFiles[i]) && (
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center"
                          >
                            <X size={10} className="text-white" />
                          </button>
                        )}
                      </div>
                    ))}
                    {form.imagePreviews.length < 4 && (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-[120px] h-[90px] rounded-xl border-2 border-dashed border-black/10 hover:border-[#7AD371] flex flex-col items-center justify-center gap-2 transition-colors group"
                      >
                        <Upload size={18} className="text-black/30 group-hover:text-[#7AD371] transition-colors" />
                        <span className="font-questrial text-xs text-black/30 group-hover:text-[#7AD371] transition-colors">
                          Add Photo
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className="display:flex h-[240px] p-10 flex-col justify-center items-center gap-4 rounded-[16px] border border-dashed border-black/10 bg-white relative text-center cursor-pointer hover:border-[#7AD371] transition-all flex"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload size={32} className="text-[rgba(10,38,35,0.7)]" />
                    <p className="font-questrial text-[12px] text-[rgba(10,38,35,0.7)]">
                      We accept PNG & JPG files, up to 5MB
                    </p>
                    <div className="flex h-10 px-8 justify-center items-center rounded-full border border-black/10 bg-white font-questrial text-sm font-semibold text-[rgba(10,38,35,0.7)] group-hover:bg-neutral-50 transition-all">
                      Browse Files
                    </div>
                  </div>
                )}
                
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImages}
                />
              </div>

              {/* Form details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Food Name */}
                <div className="flex flex-col gap-2.5">
                  <label className="font-questrial text-[16px] text-[#0A2623]">Food Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your food name"
                    value={form.mealName}
                    onChange={(e) => set('mealName', e.target.value)}
                    className="h-11 px-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] placeholder:text-black/30 focus:border-[#7AD371] transition-all"
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-2.5">
                  <label className="font-questrial text-[16px] text-[#0A2623]">Quantity</label>
                  <div className="flex items-center gap-3 h-11">
                    <button
                      type="button"
                      onClick={() => set('quantity', Math.max(1, form.quantity - 1))}
                      className="w-11 h-11 rounded-[10px] border border-black/10 bg-white flex items-center justify-center hover:bg-neutral-50 transition-all flex-shrink-0"
                    >
                      <Minus size={15} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      required
                      value={form.quantity}
                      onChange={(e) => set('quantity', Math.max(1, Number(e.target.value)))}
                      className="h-11 px-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] text-center w-full focus:border-[#7AD371] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => set('quantity', form.quantity + 1)}
                      className="w-11 h-11 rounded-[10px] border border-black/10 bg-white flex items-center justify-center hover:bg-neutral-50 transition-all flex-shrink-0"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-2.5">
                  <label className="font-questrial text-[16px] text-[#0A2623]">Category</label>
                  <select
                    required={!isEditing}
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="h-11 px-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] focus:border-[#7AD371] transition-all"
                  >
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Allergens selection */}
                <div className="flex flex-col gap-2.5 md:col-span-2">
                  <label className="font-questrial text-[16px] text-[#0A2623]">Allergens</label>
                  <div className="flex flex-wrap gap-2">
                    {ALLERGENS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAllergen(a)}
                        className={`px-4 py-2 rounded-full border font-questrial text-sm font-semibold transition-all ${
                          form.allergens.includes(a)
                            ? 'bg-[#0F3934] text-white border-[#0F3934]'
                            : 'bg-white border-black/10 text-[rgba(10,38,35,0.7)] hover:border-[#7AD371]'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prices block */}
                <div className="flex flex-col gap-4 md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Original Price */}
                    <div className="flex flex-col gap-2.5">
                      <label className="font-questrial text-[16px] text-[#0A2623]">Original Price (₦)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="0.00"
                        value={form.originalPrice}
                        onChange={(e) => set('originalPrice', e.target.value)}
                        className="h-11 px-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] focus:border-[#7AD371] transition-all"
                      />
                    </div>

                    {/* Discounted Price */}
                    <div className="flex flex-col gap-2.5">
                      <label className="font-questrial text-[16px] text-[#0A2623]">Discounted Price (₦)</label>
                      <input
                        type="number"
                        required={!form.isFree}
                        min={0}
                        disabled={form.isFree}
                        placeholder="0.00"
                        value={form.isFree ? '0' : form.discountedPrice}
                        onChange={(e) => set('discountedPrice', e.target.value)}
                        className="h-11 px-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] focus:border-[#7AD371] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Mark as free checkbox */}
                  <button
                    type="button"
                    onClick={() => set('isFree', !form.isFree)}
                    className="flex items-center gap-2.5 w-fit select-none"
                  >
                    <div
                      className={`w-5 h-5 rounded-[4px] flex items-center justify-center border transition-all ${
                        form.isFree ? 'bg-[#0F3934] border-[#0F3934] text-white' : 'border-black/20 bg-white'
                      }`}
                    >
                      {form.isFree && <CheckSquare size={12} className="text-white" />}
                    </div>
                    <span className="font-questrial text-sm font-semibold text-[#0A2623]">Mark as FREE</span>
                  </button>

                  {discountPct > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#7AD371]/10 border border-[#7AD371]/20">
                      <span className="font-questrial text-sm text-[#0F3934]">
                        🎉 You're offering a <strong className="text-[#0F3934] font-semibold">{discountPct}% discount</strong> — great for reducing waste!
                      </span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 border-t border-black/10 my-2" />

                {/* Times block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:col-span-2">
                  {/* Pickup Start Time */}
                  <div className="flex flex-col gap-2.5">
                    <label className="font-questrial text-[16px] text-[#0A2623]">Pickup Start Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        required
                        value={form.pickupTime}
                        onChange={(e) => set('pickupTime', e.target.value)}
                        className="h-11 px-4 pr-10 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] focus:border-[#7AD371] transition-all w-full"
                      />
                      <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" />
                    </div>
                  </div>

                  {/* Pickup End Time (Expires At) */}
                  <div className="flex flex-col gap-2.5">
                    <label className="font-questrial text-[16px] text-[#0A2623]">Pickup End Time (Expires At)</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        required
                        value={form.expiresAt}
                        onChange={(e) => set('expiresAt', e.target.value)}
                        className="h-11 px-4 pr-10 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] focus:border-[#7AD371] transition-all w-full"
                      />
                      <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2.5 md:col-span-2">
                  <label className="font-questrial text-[16px] text-[#0A2623]">Description (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Enter food description — ingredients, taste, portion size…"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    className="p-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] placeholder:text-black/30 focus:border-[#7AD371] transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right column: Preview Card */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5 w-full">
                <span className="font-questrial text-[16px] text-[#0A2623]">Preview Post</span>
                
                <div
                  className="bg-white rounded-[20px] border border-black/10 overflow-hidden p-1.5 flex flex-col justify-between shadow-[0_1px_3px_rgba(10,38,35,0.06)]"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-[120px] w-full overflow-hidden bg-[#F0F9EF] rounded-t-[16px]">
                      {form.imagePreviews[0] ? (
                        <img
                          src={form.imagePreviews[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-[#F0F9EF]">
                          🍽️
                        </div>
                      )}
                    </div>
                    {/* Body */}
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="font-questrial text-[16px] text-[#0A2623] font-semibold truncate">
                            {form.mealName || 'Jollof Rice + Chicken'}
                          </p>
                          <p className="font-questrial text-[16px] text-[rgba(10,38,35,0.3)] line-through">
                            ₦{form.originalPrice ? Number(form.originalPrice).toLocaleString() : '2,000'}
                          </p>
                        </div>
                        <p className="font-questrial text-[24px] text-[#0A2623] font-semibold">
                          ₦{form.isFree ? '0' : (form.discountedPrice ? Number(form.discountedPrice).toLocaleString() : '500')}
                        </p>
                      </div>
                      <div className="h-[1px] bg-black/10" />
                      <div className="flex items-center justify-between text-[rgba(10,38,35,0.7)]">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span className="font-questrial text-[14px]">
                            {form.pickupTime || '45 mins left'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Flame size={16} className="text-[#28A745]" />
                          <span className="font-questrial text-[16px] font-semibold text-[#0A2623]">
                            0/{form.quantity} claims
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error messages */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="font-questrial text-sm text-red-500 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[#0F3934] text-white font-questrial text-[16px] font-semibold hover:bg-[#0A2623] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading
                  ? (isEditing ? 'Saving…' : 'Posting…')
                  : (isEditing ? 'Save Changes' : 'Post Listing')}
              </button>

              <p className="font-questrial text-xs text-[rgba(10,38,35,0.5)] text-center">
                {isEditing
                  ? 'Changes will be visible to buyers immediately.'
                  : 'Your listing will be visible to buyers in your area immediately.'}
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostListingPage;
