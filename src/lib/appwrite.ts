import { Client, Account, Databases, Storage, ID } from 'appwrite';

// ─── Client ───────────────────────────────────────────────────────────────────

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// ─── Services ─────────────────────────────────────────────────────────────────

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// ─── Resource IDs ─────────────────────────────────────────────────────────────

export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID as string;

export const COLLECTIONS = {
  LISTINGS: import.meta.env.VITE_APPWRITE_LISTINGS_COLLECTION as string,
  ORDERS: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION as string,
  VENDOR_PROFILES: import.meta.env.VITE_APPWRITE_VENDOR_PROFILES_COLLECTION as string,
} as const;

export const BUCKETS = {
  FOOD_IMAGES: import.meta.env.VITE_APPWRITE_FOOD_IMAGES_BUCKET as string,
  BUSINESS_DOCS: import.meta.env.VITE_APPWRITE_BUSINESS_DOCS_BUCKET as string,
} as const;

export { ID };
export default client;
