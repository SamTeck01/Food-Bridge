import {
  createContext, useContext, useState, useCallback,
  useEffect
} from 'react';

import type { ReactNode } from 'react';
import {
  getCurrentUser, signIn, signOut, signUp,
  getAuthErrorMessage
} from '../services/auth.service';
import type { AppwriteUser } from '../services/auth.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'vendor';
  emailVerified: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  vendorName: string;
  vendorId: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  imageUrl: string;
  pickupTime: string;
  distance: string;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  isLoggedIn: boolean;
  /** True while the initial session check is in flight (prevents redirect flicker) */
  authLoading: boolean;
}

interface AppActions {
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, role: 'buyer' | 'vendor') => Promise<void>;
  logout: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

type AppContextType = AppState & AppActions;

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapAppwriteUser = (u: AppwriteUser): User => ({
  id: u.$id,
  name: u.name,
  email: u.email,
  role: (u.prefs?.role as 'buyer' | 'vendor') ?? 'buyer',
  emailVerified: u.emailVerification,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Restore session on mount ─────────────────────────────────────────────────
  useEffect(() => {
    getCurrentUser().then((appwriteUser) => {
      if (appwriteUser) setUser(mapAppwriteUser(appwriteUser));
    }).finally(() => setAuthLoading(false));
  }, []);

  // ── Auth Actions ─────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      const appwriteUser = await signIn(email, password);
      const mappedUser = mapAppwriteUser(appwriteUser);
      setUser(mappedUser);
      return mappedUser;
    } catch (err) {
      throw new Error(getAuthErrorMessage(err));
    }
  }, []);

  const register = useCallback(async (
    email: string, password: string, name: string, role: 'buyer' | 'vendor'
  ) => {
    try {
      const appwriteUser = await signUp(email, password, name, role);
      setUser(mapAppwriteUser(appwriteUser));
    } catch (err) {
      throw new Error(getAuthErrorMessage(err));
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setCart([]);
  }, []);

  // ── Cart Actions ─────────────────────────────────────────────────────────────

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.discountedPrice * i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        isLoggedIn: !!user,
        authLoading,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
