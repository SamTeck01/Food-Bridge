import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, ChevronDown, AlertCircle } from 'lucide-react';

const GetStartedPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'vendor'>('vendor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    businessName: '', fullName: '', email: '', phone: '',
    address: '', businessType: '', password: '',
  });

  const { register } = useApp();
  const navigate = useNavigate();

  const displayName = userType === 'vendor' ? form.businessName : form.fullName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email) { setError('Email is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!displayName.trim()) { setError('Name is required.'); return; }

    setLoading(true);
    try {
      await register(form.email, form.password, displayName, userType === 'vendor' ? 'vendor' : 'buyer');
      navigate('/verify-email');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="flex items-center justify-between px-8 md:px-[100px] py-8">
        <Link to="/"><Logo /></Link>
        <Link to="/login"
          className="flex items-center justify-center h-10 px-6 rounded-pill border border-border font-questrial text-base text-text-primary hover:border-brand-primary transition-colors">
          Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-10 px-6">
        <div className="w-full max-w-[450px] flex flex-col gap-8">
          {/* User Type Toggle */}
          <div className="flex gap-4 p-1 bg-white rounded-pill border border-border">
            {(['vendor', 'individual'] as const).map((type) => (
              <button key={type} onClick={() => setUserType(type)}
                className={`flex-1 h-10 rounded-pill font-questrial text-base capitalize transition-all ${
                  userType === type
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}>
                {type === 'vendor' ? 'Join as a Vendor' : 'Join as Individual'}
              </button>
            ))}
          </div>

          <h1 className="font-questrial text-4xl text-text-primary leading-tight">
            {userType === 'vendor' ? 'Join as a Vendor' : 'Create Your Account'}
          </h1>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430]">
              <AlertCircle size={18} className="text-state-error flex-shrink-0" />
              <p className="font-questrial text-sm text-state-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Business / Full Name */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">
                {userType === 'vendor' ? 'Business name' : 'Full name'}
              </label>
              <input type="text"
                placeholder={userType === 'vendor' ? 'Your business name' : 'Your full name'}
                value={userType === 'vendor' ? form.businessName : form.fullName}
                onChange={(e) => update(userType === 'vendor' ? 'businessName' : 'fullName', e.target.value)}
                className="input-field" required />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Email address</label>
              <input type="email" placeholder="your@email.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="input-field" required autoComplete="email" />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Phone number</label>
              <div className="flex h-10 items-center gap-2 px-4 rounded-[10px] bg-white border border-border focus-within:ring-2 focus-within:ring-brand-primary transition-all">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2.5C1.46957 2.5 0.960859 2.71071 0.585786 3.08579C0.210714 3.46086 0 3.96957 0 4.5L0 13.5C0 14.0304 0.210714 14.5391 0.585786 14.9142C0.960859 15.2893 1.46957 15.5 2 15.5H6V2.5H2Z" fill="#009A49"/>
                  <path d="M6 2.5H12V15.5H6V2.5Z" fill="#EEEEEE"/>
                  <path d="M16 2.5H12V15.5H16C16.5304 15.5 17.0391 15.2893 17.4142 14.9142C17.7893 14.5391 18 14.0304 18 13.5V4.5C18 3.96957 17.7893 3.46086 17.4142 3.08579C17.0391 2.71071 16.5304 2.5 16 2.5Z" fill="#009A49"/>
                </svg>
                <ChevronDown size={16} className="text-text-secondary" />
                <div className="w-px h-5 bg-text-muted" />
                <span className="font-questrial text-base text-text-secondary">+234</span>
                <input type="tel" placeholder="08XX XXX XXXX"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="flex-1 bg-transparent outline-none font-questrial text-base text-text-primary placeholder:text-text-muted" />
              </div>
            </div>

            {/* Vendor-only fields */}
            {userType === 'vendor' && (
              <>
                <div className="flex flex-col gap-2.5">
                  <label className="font-questrial text-base text-text-primary">Business address</label>
                  <input type="text" placeholder="Your business address"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    className="input-field" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="font-questrial text-base text-text-primary">Business type</label>
                  <div className="relative">
                    <select value={form.businessType}
                      onChange={(e) => update('businessType', e.target.value)}
                      className="input-field appearance-none pr-10 cursor-pointer">
                      <option value="" disabled>Select business type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="catering">Catering Service</option>
                      <option value="bakery">Bakery</option>
                      <option value="canteen">School/Office Canteen</option>
                      <option value="hotel">Hotel</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Password</label>
              <div className="flex h-10 items-center gap-2 px-4 rounded-[10px] bg-white border border-border focus-within:ring-2 focus-within:ring-brand-primary transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="flex-1 bg-transparent outline-none font-questrial text-base text-text-primary placeholder:text-text-muted"
                  required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-text-secondary hover:text-text-primary transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-70 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>

            <p className="text-center font-questrial text-sm text-text-secondary leading-relaxed">
              By creating an account, you agree to FoodBridge{' '}
              <a href="#" className="text-brand-primary underline">Privacy Policy</a> and{' '}
              <a href="#" className="text-brand-primary underline">Terms of Service.</a>
            </p>

            <p className="text-center font-questrial text-base text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-secondary hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default GetStartedPage;
