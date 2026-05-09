import { ID, AppwriteException } from 'appwrite';
import { account } from '../lib/appwrite';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  prefs: { role?: string };
  emailVerification: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map Appwrite error codes to user-friendly messages */
export const getAuthErrorMessage = (err: unknown): string => {
  if (err instanceof AppwriteException) {
    switch (err.code) {
      case 401: return 'Invalid email or password.';
      case 404: return 'No account found with this email.';
      case 409: return 'An account with this email already exists.';
      case 429: return 'Too many attempts. Please wait a moment and try again.';
      case 503: return 'Service unavailable. Please try again later.';
      default:  return err.message || 'Something went wrong. Please try again.';
    }
  }
  return 'An unexpected error occurred.';
};

// ─── Auth Functions ───────────────────────────────────────────────────────────

/** Get the currently logged-in user, or null if no session */
export const getCurrentUser = async (): Promise<AppwriteUser | null> => {
  try {
    return await account.get() as unknown as AppwriteUser;
  } catch {
    return null;
  }
};

/** Sign in with email + password */
export const signIn = async (email: string, password: string): Promise<AppwriteUser> => {
  await account.createEmailPasswordSession(email, password);
  return await account.get() as unknown as AppwriteUser;
};

/** Register a new account, log them in, and send verification email */
export const signUp = async (
  email: string,
  password: string,
  name: string,
  role: 'buyer' | 'vendor' = 'buyer'
): Promise<AppwriteUser> => {
  // Create account
  await account.create(ID.unique(), email, password, name);
  // Immediately log them in
  await account.createEmailPasswordSession(email, password);
  // Save role in prefs
  await account.updatePrefs({ role });
  // Send verification email
  const verifyUrl = `${window.location.origin}/verify-email`;
  await account.createVerification(verifyUrl);
  return await account.get() as unknown as AppwriteUser;
};

/** Sign out current session */
export const signOut = async (): Promise<void> => {
  await account.deleteSession('current');
};

/** Send a password recovery email */
export const sendPasswordRecovery = async (email: string): Promise<void> => {
  const resetUrl = `${window.location.origin}/reset-password`;
  await account.createRecovery(email, resetUrl);
};

/** Complete the password reset (called from /reset-password with URL params) */
export const confirmPasswordReset = async (
  userId: string,
  secret: string,
  newPassword: string
): Promise<void> => {
  await account.updateRecovery(userId, secret, newPassword);
};

/** Re-send email verification */
export const sendEmailVerification = async (): Promise<void> => {
  const verifyUrl = `${window.location.origin}/verify-email`;
  await account.createVerification(verifyUrl);
};

/** Confirm email verification (called from /verify-email with URL params) */
export const confirmEmailVerification = async (
  userId: string,
  secret: string
): Promise<void> => {
  await account.updateVerification(userId, secret);
};
