import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronLeft, Upload, CheckCircle2, X, Shield } from 'lucide-react';

type DocField = 'businessReg' | 'cacDocument' | 'proofOfAddress' | 'ownerID';

interface UploadedFile {
  name: string;
  size: string;
}

interface FormState {
  businessName: string;
  businessType: string;
  rcNumber: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  description: string;
  files: Record<DocField, UploadedFile | null>;
}

const DOC_FIELDS: { key: DocField; label: string; hint: string }[] = [
  { key: 'businessReg', label: 'Business Registration Certificate', hint: 'Certificate of Incorporation or Business Name Registration' },
  { key: 'cacDocument', label: 'CAC Document', hint: 'CAC Form BN 1 or CAC Form CO 7' },
  { key: 'proofOfAddress', label: 'Proof of Address', hint: 'Utility bill or bank statement (not older than 3 months)' },
  { key: 'ownerID', label: 'Owner Valid ID', hint: 'NIN slip, International Passport, or Driver\'s Licence' },
];

const BUSINESS_TYPES = ['Restaurant', 'Café', 'Bakery / Pastry', 'Food Vendor', 'Catering Service', 'Home Cook', 'Other'];

const VerifyBusinessPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const fileRefs = useRef<Record<DocField, HTMLInputElement | null>>({
    businessReg: null, cacDocument: null, proofOfAddress: null, ownerID: null,
  });

  const [form, setForm] = useState<FormState>({
    businessName: '', businessType: '', rcNumber: '',
    businessAddress: '', businessPhone: '', businessEmail: '',
    description: '',
    files: { businessReg: null, cacDocument: null, proofOfAddress: null, ownerID: null },
  });

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleFileChange = (key: DocField, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const size = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    setForm((p) => ({ ...p, files: { ...p.files, [key]: { name: file.name, size } } }));
  };

  const removeFile = (key: DocField) =>
    setForm((p) => ({ ...p, files: { ...p.files, [key]: null } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-[480px] w-full flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#7AD37120] flex items-center justify-center">
              <CheckCircle2 size={40} className="text-brand-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-questrial text-2xl text-text-primary">Submission Received!</h1>
              <p className="font-questrial text-base text-text-secondary">
                Your business verification documents have been submitted. Our team will review and respond within <strong>2–3 business days</strong>.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-overlay border border-border w-full">
              <Shield size={20} className="text-brand-primary flex-shrink-0" />
              <p className="font-questrial text-sm text-text-secondary text-left">
                Once verified, your listings will display a <span className="text-brand-primary font-semibold">Verified Vendor</span> badge to buyers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">
                Go to Dashboard
              </button>
              <button onClick={() => setSubmitted(false)} className="btn-outline flex-1">
                Re-submit
              </button>
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
        <div className="max-w-[760px] mx-auto flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-brand-primary transition-all"
            >
              <ChevronLeft size={20} className="text-text-secondary" />
            </button>
            <div>
              <h1 className="font-questrial text-2xl text-text-primary">Verify Your Business</h1>
              <p className="font-questrial text-sm text-text-secondary">
                Get the <span className="text-brand-primary">Verified Vendor</span> badge and build buyer trust
              </p>
            </div>
          </div>

          {/* Trust banner */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-[#7AD37110] border border-brand-primary/30">
            <Shield size={22} className="text-brand-primary flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="font-questrial text-base text-brand-secondary">Why verify?</p>
              <p className="font-questrial text-sm text-text-secondary">
                Verified businesses see up to <strong>3x more claims</strong>. Your documents are encrypted and only reviewed by our compliance team.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Business Info */}
            <div className="section-card flex flex-col gap-5">
              <h2 className="font-questrial text-xl text-text-primary">Business Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="input-group">
                  <label className="input-label">Business Name <span className="text-state-error">*</span></label>
                  <input type="text" required className="input-field" placeholder="e.g. Tasty Bites Kitchen"
                    value={form.businessName} onChange={(e) => setField('businessName', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Business Type <span className="text-state-error">*</span></label>
                  <select required className="input-field bg-bg" value={form.businessType}
                    onChange={(e) => setField('businessType', e.target.value)}>
                    <option value="" disabled>Select type</option>
                    {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">RC / BN Number (optional)</label>
                <input type="text" className="input-field" placeholder="e.g. RC1234567"
                  value={form.rcNumber} onChange={(e) => setField('rcNumber', e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Business Address <span className="text-state-error">*</span></label>
                <input type="text" required className="input-field" placeholder="Full address including LGA and State"
                  value={form.businessAddress} onChange={(e) => setField('businessAddress', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="input-group">
                  <label className="input-label">Business Phone <span className="text-state-error">*</span></label>
                  <input type="tel" required className="input-field" placeholder="+234 800 000 0000"
                    value={form.businessPhone} onChange={(e) => setField('businessPhone', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Business Email</label>
                  <input type="email" className="input-field" placeholder="contact@yourbusiness.com"
                    value={form.businessEmail} onChange={(e) => setField('businessEmail', e.target.value)} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Business Description</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Tell us what your business does and what kind of food you offer…"
                  value={form.description} onChange={(e) => setField('description', e.target.value)} />
              </div>
            </div>

            {/* Document Uploads */}
            <div className="section-card flex flex-col gap-5">
              <div>
                <h2 className="font-questrial text-xl text-text-primary">Supporting Documents</h2>
                <p className="font-questrial text-sm text-text-secondary mt-1">
                  Accepted formats: PDF, JPG, PNG. Max 5 MB per file.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {DOC_FIELDS.map(({ key, label, hint }) => {
                  const uploaded = form.files[key];
                  return (
                    <div key={key}>
                      <label className="input-label mb-2 block">{label}</label>
                      {uploaded ? (
                        <div className="flex items-center justify-between p-4 rounded-[10px] border border-brand-primary bg-[#7AD37108]">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-brand-primary flex-shrink-0" />
                            <div>
                              <p className="font-questrial text-sm text-text-primary">{uploaded.name}</p>
                              <p className="font-questrial text-xs text-text-muted">{uploaded.size}</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeFile(key)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#EF444415] transition-colors">
                            <X size={14} className="text-state-error" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRefs.current[key]?.click()}
                          className="w-full flex items-center gap-4 p-4 rounded-[10px] border-2 border-dashed border-border hover:border-brand-primary transition-colors group text-left"
                        >
                          <div className="w-10 h-10 rounded-[10px] border border-border bg-bg-overlay flex items-center justify-center flex-shrink-0 group-hover:border-brand-primary transition-colors">
                            <Upload size={18} className="text-text-muted group-hover:text-brand-primary transition-colors" />
                          </div>
                          <div>
                            <p className="font-questrial text-sm text-text-primary group-hover:text-brand-secondary transition-colors">Upload {label}</p>
                            <p className="font-questrial text-xs text-text-muted">{hint}</p>
                          </div>
                        </button>
                      )}
                      <input
                        ref={(el) => { fileRefs.current[key] = el; }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(key, e)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3">
              <input type="checkbox" required id="terms"
                className="w-4 h-4 mt-1 accent-[#0F3934] cursor-pointer flex-shrink-0" />
              <label htmlFor="terms" className="font-questrial text-sm text-text-secondary cursor-pointer">
                I confirm that the information provided above is accurate and that the uploaded documents are genuine.
                I understand that submitting false documents may result in permanent account suspension.
              </label>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pb-6">
              <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyBusinessPage;
