import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useApp } from '../../context/AppContext';

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
      navigate(from === '/' ? (loggedInUser.role === 'vendor' ? '/dashboard' : '/listings') : from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // h-dvh ensures it fits the viewport perfectly without scrolling
    
    <div className="h-dvh bg-red-950 flex flex-col overflow-hidden">
      <div className="h-dvh bg-red-600"> {/* Change to red */}
    <h1 className="text-9xl text-white">I AM THE CORRECT FILE</h1>
    {/* ... rest of your code */}
  </div>
      {/* Header */}
      <header className="flex items-center justify-between px-8 md:px-[100px] py-8">
        <Link to="/"><Logo /></Link>
        <Link to="/get-started" className="h-10 px-6 rounded-full border border-border flex items-center hover:border-brand-primary transition-colors">
          Create Account
        </Link>
      </header>

      {/* Centered Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[450px] flex flex-col gap-8"
        >
          <h1 className="font-questrial text-4xl text-text-primary">Log in to your account</h1>

          {error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430]">
              <AlertCircle size={18} className="text-state-error flex-shrink-0" />
              <p className="font-questrial text-sm text-state-error">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Email</label>
              <input
                type="email"
                placeholder="Your email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-12 px-4 rounded-xl border border-border focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Password</label>
              <div className="flex h-12 items-center gap-2 px-4 rounded-xl bg-white border border-border focus-within:ring-2 focus-within:ring-brand-primary transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 bg-transparent outline-none"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-secondary">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="font-questrial text-sm text-brand-secondary hover:underline">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary h-12 w-full flex items-center justify-center gap-2 rounded-xl">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginPage;