import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { sendPasswordRecovery } from '../services/auth.service';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordRecovery(email);
      setSubmitted(true);
    } catch {
      setError('Could not find an account with that email address.');
    } finally {
      setLoading(false);
    }
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
          <Link to="/login"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors w-fit">
            <ArrowLeft size={20} />
            <span className="font-questrial text-base">Back to Login</span>
          </Link>

          <div>
            <h1 className="font-questrial text-4xl text-text-primary mb-2">Forgot password?</h1>
            <p className="font-questrial text-base text-text-secondary leading-relaxed">
              No worries! Enter your email address below and we'll send you a reset link.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-5 py-8 px-6 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-brand-primary/20">
                <CheckCircle2 size={32} className="text-brand-secondary" />
              </div>
              <h3 className="font-questrial text-xl text-text-primary">Check your email</h3>
              <p className="font-questrial text-base text-text-secondary">
                We sent a reset link to <strong>{email}</strong>. Click the link to set a new password.
              </p>
              <p className="font-questrial text-xs text-text-muted">
                The link expires in 1 hour. Check your spam folder if you don't see it.
              </p>
              <Link to="/login" className="btn-primary mt-2">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430]">
                  <AlertCircle size={18} className="text-state-error flex-shrink-0" />
                  <p className="font-questrial text-sm text-state-error">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <label className="font-questrial text-base text-text-primary">Email</label>
                <input type="email" placeholder="Your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="input-field" required />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70">
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Sending…' : 'Continue'}
              </button>

              <p className="text-center font-questrial text-base text-text-secondary">
                Remembered your password?{' '}
                <Link to="/login" className="text-brand-secondary hover:underline">Log in</Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
