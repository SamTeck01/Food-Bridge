import { CheckCheck, Upload, X, Shield } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import toast from 'react-hot-toast';
import { Permission, Role } from 'appwrite';
import { account, storage, BUCKETS, ID } from '../../lib/appwrite';

const REGISTRATION_TYPES = [
  'Limited Liability Company (LTD)',
  'Sole Proprietorship / Registered Business Name',
  'Cooperative / NGO',
  'Unregistered / Individual Home Cook',
  'Other'
];

interface UploadedFile {
  name: string;
  size: string;
  file: File;
}

const VerifyBusinessPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [regType, setRegType] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [cacFile, setCacFile] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const size = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    setCacFile({ name: file.name, size, file });
  };

  const handleRemoveFile = () => {
    setCacFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let documentId: string | null = null;
      if (cacFile) {
        const me = await account.get();
        // Private to the vendor; reviewers read it with a server key
        const uploaded = await storage.createFile(BUCKETS.BUSINESS_DOCS, ID.unique(), cacFile.file, [
          Permission.read(Role.user(me.$id)),
          Permission.delete(Role.user(me.$id)),
        ]);
        documentId = uploaded.$id;
      }
      // Stored on the account prefs until a vendor-profiles review flow exists
      const prefs = await account.getPrefs();
      await account.updatePrefs({
        ...prefs,
        businessVerification: {
          status: 'pending',
          regType,
          regNumber,
          documentId,
          submittedAt: new Date().toISOString(),
        },
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Business verification submit failed:', err);
      toast.error('Could not submit your documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6 h-20 max-w-[1040px] mx-auto w-full">
          <div className="flex items-center gap-1.5">
            <Logo />
          </div>
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="flex items-center gap-2 h-10 px-5 rounded-full border border-black/10 bg-white font-questrial text-sm font-semibold text-[rgba(10,38,35,0.7)] hover:border-[#0F3934] hover:text-[#0F3934] transition-all cursor-pointer"
          >
            Close <X size={15} />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center px-4 pt-[3.25rem] pb-8">
          <div className="w-full max-w-[400px] flex flex-col items-center gap-8 text-center">
            {/* Checked badge */}
            <div className="flex flex-col items-center gap-6">
              <div className="w-[100px] h-[100px] rounded-full bg-[#E5F2E8] border border-[#28A745]/15 flex items-center justify-center text-[#28A745] shadow-sm">
                <CheckCheck size={48} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-questrial text-[36px] text-[#0A2623] font-normal leading-tight">
                  Submission Received!
                </h1>
                <p className="font-questrial text-sm text-[rgba(10,38,35,0.6)] mt-2 leading-relaxed">
                  Your business verification documents have been submitted. Our compliance team will review and respond within <strong>2–3 business days</strong>.
                </p>
              </div>
            </div>

            {/* Shield trust info */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-black/10 bg-white text-left w-full">
              <Shield size={20} className="text-[#28A745] flex-shrink-0 mt-0.5" />
              <p className="font-questrial text-sm text-[rgba(10,38,35,0.7)] leading-relaxed">
                Once verified, your listings will display a <span className="text-[#28A745] font-semibold">Verified Vendor</span> badge to buyers to build maximum trust.
              </p>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 h-[45px] rounded-full border border-black/10 bg-white font-questrial text-[16px] font-semibold text-[rgba(10,38,35,0.7)] hover:bg-neutral-50 transition-all cursor-pointer"
              >
                Re-submit
              </button>
              <button
                onClick={() => navigate('/vendor/dashboard')}
                className="flex-1 h-[45px] rounded-full bg-[#0F3934] text-white font-questrial text-[16px] font-semibold hover:bg-[#0A2623] transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isUnregistered = regType.includes('Unregistered');

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] pb-12">
      {/* Header */}
      <header className="flex items-center justify-between px-5 md:px-[100px] py-8">
        <Link to="/vendor/dashboard"><Logo /></Link>
        <Link to="/vendor/dashboard" className="h-10 px-6 rounded-full border border-border flex items-center hover:border-brand-primary transition-colors font-questrial">
          Dashboard
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pt-[3.25rem] pb-8">
        <div className="w-full max-w-[450px] flex flex-col gap-8">
          <div>
            <h1 className="font-questrial text-[40px] text-[#0A2623] leading-tight font-normal">
              Verify your business
            </h1>
            <p className="font-questrial text-sm text-[rgba(10,38,35,0.6)] mt-2">
              Unlock the Verified badge and increase claim rates by 3x.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Registration Type selector */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-[16px] text-[#0A2623]">
                How did you register your business?
              </label>
              <select
                required
                value={regType}
                onChange={(e) => setRegType(e.target.value)}
                className="h-11 px-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] focus:border-[#7AD371] transition-all"
              >
                <option value="" disabled>Select registration type</option>
                {REGISTRATION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Registration Number (optional or hidden if unregistered) */}
            {!isUnregistered && (
              <div className="flex flex-col gap-2.5">
                <label className="font-questrial text-[16px] text-[#0A2623]">
                  Registration number
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your registration number"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="h-11 px-4 rounded-[10px] border border-black/10 bg-white outline-none font-questrial text-[16px] text-[#0A2623] placeholder:text-black/30 focus:border-[#7AD371] transition-all"
                />
              </div>
            )}

            {/* CAC document upload (optional or hidden if unregistered) */}
            {!isUnregistered && (
              <div className="flex flex-col gap-2.5">
                <label className="font-questrial text-[16px] text-[#0A2623]">
                  Upload CAC Document
                </label>

                {cacFile ? (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#28A745]/20 bg-[#E5F2E8]/40">
                    <div className="flex items-center gap-3">
                      <CheckCheck size={18} className="text-[#28A745] flex-shrink-0" />
                      <div>
                        <p className="font-questrial text-sm text-[#0A2623] font-semibold truncate max-w-[200px]">
                          {cacFile.name}
                        </p>
                        <p className="font-questrial text-xs text-[rgba(10,38,35,0.5)]">{cacFile.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-3.5 p-6 rounded-2xl border border-dashed border-black/10 bg-white cursor-pointer hover:border-[#7AD371] transition-all text-center"
                  >
                    <Upload size={28} className="text-black/30" />
                    <span className="font-questrial text-xs text-[rgba(10,38,35,0.7)]">
                      We accept PDF, PNG & JPG files, up to 20MB
                    </span>
                    <div className="h-10 px-6 rounded-full border border-black/10 bg-white font-questrial text-sm font-semibold text-[rgba(10,38,35,0.7)] hover:bg-neutral-50 transition-all flex items-center justify-center">
                      Browse Files
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* Note for unregistered individuals */}
            {isUnregistered && (
              <div className="p-4 rounded-xl border border-black/10 bg-white flex items-start gap-3">
                <Shield className="text-[#28A745] flex-shrink-0 mt-0.5" size={18} />
                <p className="font-questrial text-sm text-[rgba(10,38,35,0.7)] leading-relaxed">
                  Individual home cooks don't require CAC documents. Skip for now, and you can submit any business registration later when your business grows.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (!isUnregistered && (!regNumber || !cacFile))}
              className="h-11 rounded-full bg-[#0F3934] text-white font-questrial text-[16px] font-semibold hover:bg-[#0A2623] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Submit
            </button>

            {/* Skip for later */}
            <button
              type="button"
              onClick={() => navigate('/vendor/dashboard')}
              className="text-center font-questrial text-[16px] text-[rgba(10,38,35,0.7)] hover:text-[#0A2623] hover:underline cursor-pointer transition-colors"
            >
              Skip for later
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default VerifyBusinessPage;
