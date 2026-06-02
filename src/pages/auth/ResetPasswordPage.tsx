import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { confirmPasswordReset } from '../services/auth.service';
import { Eye, EyeOff, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

const ResetPasswordPage = () => {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId') || '';
  const secret = searchParams.get('secret') || '';

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-state-error', 'bg-yellow-400', 'bg-blue-400', 'bg-state-success'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return;
    if (!userId || !secret) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await confirmPasswordReset(userId, secret, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('This reset link has expired or already been used. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-8 md:px-[100px] py-8">
        <Link to="/">
          <Logo />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-10 px-6">
        <div className="w-full max-w-[450px] flex flex-col gap-8">
          <div>
            <h1 className="font-questrial text-4xl text-text-primary mb-2">Set new password</h1>
            <p className="font-questrial text-base text-text-secondary">
              Your new password must be at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* New Password */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">New password</label>
              <div className="flex h-10 items-center gap-2 px-4 rounded-[10px] bg-white border border-border focus-within:ring-2 focus-within:ring-brand-primary transition-all">
                <input
                  type={show.password ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 bg-transparent outline-none font-questrial text-base text-text-primary placeholder:text-text-muted"
                  required
                />
                <button type="button" onClick={() => setShow({ ...show, password: !show.password })} className="text-text-secondary hover:text-text-primary">
                  {show.password ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-1 rounded-full transition-all ${level <= strength ? strengthColor : 'bg-border'}`}
                      />
                    ))}
                  </div>
                  <span className="font-questrial text-sm text-text-secondary">{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2.5">
              <label className="font-questrial text-base text-text-primary">Confirm password</label>
              <div className={`flex h-10 items-center gap-2 px-4 rounded-[10px] bg-white border focus-within:ring-2 focus-within:ring-brand-primary transition-all
                ${form.confirm && form.password !== form.confirm ? 'border-state-error' : 'border-border'}`}>
                <input
                  type={show.confirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="flex-1 bg-transparent outline-none font-questrial text-base text-text-primary placeholder:text-text-muted"
                  required
                />
                {form.confirm && form.password === form.confirm ? (
                  <Check size={20} className="text-state-success flex-shrink-0" />
                ) : (
                  <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })} className="text-text-secondary hover:text-text-primary">
                    {show.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="font-questrial text-sm text-state-error">Passwords do not match</p>
              )}
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430]">
                <AlertCircle size={18} className="text-state-error flex-shrink-0" />
                <p className="font-questrial text-sm text-state-error">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                <CheckCircle2 size={18} className="text-brand-primary flex-shrink-0" />
                <p className="font-questrial text-sm text-brand-secondary">Password reset! Redirecting to login…</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!form.password || form.password !== form.confirm || loading || success}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>

            <p className="text-center font-questrial text-base text-text-secondary">
              Remember it after all?{' '}
              <Link to="/login" className="text-brand-secondary hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
