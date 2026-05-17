import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      if (from === '/') {
        if (loggedInUser.role === 'vendor') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/listings', { replace: true });
        }
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-8 md:px-[100px] py-8">
        <Link to="/"><Logo /></Link>
        <Link
          to="/get-started"
          className="flex items-center justify-center h-10 px-6 rounded-pill border border-border font-questrial text-base text-text-primary hover:border-brand-primary transition-colors"
        >
          Create Account
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-10 px-6">
        <div className="w-full max-w-[450px] flex flex-col gap-8">
          <h1 className="font-questrial text-4xl text-text-primary">Log in to your account</h1>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430]">
              <AlertCircle size={18} className="text-state-error flex-shrink-0" />
              <p className="font-questrial text-sm text-state-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Email</label>
              <input
                type="email"
                placeholder="Your email address"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
                className="input-field"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Password</label>
              <div className="flex h-10 items-center gap-2 px-4 rounded-[10px] bg-white border border-border focus-within:ring-2 focus-within:ring-brand-primary transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
                  className="flex-1 bg-transparent outline-none font-questrial text-base text-text-primary placeholder:text-text-muted"
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-text-secondary hover:text-text-primary transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Forgot Password — right-aligned, matching Figma */}
              <div className="text-right">
                <Link to="/forgot-password" className="font-questrial text-sm text-brand-secondary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full disabled:opacity-70 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Logging in…' : 'Log in'}
            </button>

            <p className="text-center font-questrial text-base text-text-secondary">
              Don't have an account?{' '}
              <Link to="/get-started" className="text-brand-secondary hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
