import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { sendEmailVerification } from '../services/auth.service';
import { CheckCircle2, Mail, AlertCircle } from 'lucide-react';

/**
 * Email Verification page.
 *
 * Appwrite uses a magic link (not OTP) — the user gets an email with a link
 * that calls /verify-email?userId=...&secret=... which we confirm server-side.
 *
 * This page serves as the "Check your inbox" holding screen and lets users
 * re-send the verification email.
 */
const VerifyEmailPage = () => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await sendEmailVerification();
      setResent(true);
    } catch {
      setError('Could not resend. Make sure you are logged in.');
    } finally {
      setResending(false);
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
        <div className="w-full max-w-[450px] flex flex-col items-center gap-8">
          {/* Icon */}
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-brand-primary/10 border-2 border-brand-primary/20">
            <Mail size={40} strokeWidth={1.5} className="text-brand-secondary" />
          </div>

          <div className="text-center flex flex-col gap-3">
            <h1 className="font-questrial text-4xl text-text-primary">Check your email</h1>
            <p className="font-questrial text-base text-text-secondary leading-relaxed max-w-xs">
              We sent a verification link to your email address. Click it to verify your account and start using FoodBridge.
            </p>
          </div>

          {/* Steps */}
          <div className="w-full flex flex-col gap-3">
            {[
              'Open your email inbox',
              'Find the email from FoodBridge',
              'Click the verification link',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-border">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <span className="font-questrial text-sm text-brand-secondary font-semibold">{i + 1}</span>
                </div>
                <span className="font-questrial text-base text-text-primary">{step}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430]">
              <AlertCircle size={18} className="text-state-error flex-shrink-0" />
              <p className="font-questrial text-sm text-state-error">{error}</p>
            </div>
          )}

          {/* Resent confirmation */}
          {resent && (
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
              <CheckCircle2 size={18} className="text-brand-primary flex-shrink-0" />
              <p className="font-questrial text-sm text-brand-secondary">Verification email resent!</p>
            </div>
          )}

          {/* Resend button */}
          <p className="font-questrial text-base text-text-secondary text-center">
            Didn't receive it?{' '}
            <button onClick={handleResend} disabled={resending}
              className="text-brand-primary hover:underline disabled:opacity-50 font-questrial">
              {resending ? 'Sending…' : 'Resend verification email'}
            </button>
          </p>

          {/* Continue to app */}
          <div className="flex flex-col gap-3 w-full">
            <Link to="/" className="btn-primary w-full text-center">
              Continue to FoodBridge
            </Link>
            <Link to="/get-started"
              className="font-questrial text-sm text-text-secondary hover:text-text-primary transition-colors text-center">
              ← Back to sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmailPage;
