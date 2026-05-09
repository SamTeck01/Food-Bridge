import { ID, Query } from 'appwrite';
import { databases, storage, DB_ID, COLLECTIONS, BUCKETS } from '../lib/appwrite';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ListingStatus = 'active' | 'sold_out' | 'expired' | 'pending';

export interface Listing {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  vendorId: string;
  vendorName: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  claimsUsed: number;
  pickupTime: string;
  expiresAt: string;
  imageUrl: string;
  status: ListingStatus;
  allergens: string[];
  distance?: string;
}

export interface CreateListingData {
  vendorId: string;
  vendorName: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  pickupTime: string;
  expiresAt: string;
  allergens: string[];
  imageFile?: File;
}

// ─── Listings Service ─────────────────────────────────────────────────────────

/** Fetch all active listings */
export const getListings = async (limit = 20): Promise<Listing[]> => {
  const response = await databases.listDocuments(DB_ID, COLLECTIONS.LISTINGS, [
    Query.equal('status', 'active'),
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
  ]);
  return response.documents as unknown as Listing[];
};

/** Fetch a single listing by ID */
export const getListingById = async (id: string): Promise<Listing> => {
  const doc = await databases.getDocument(DB_ID, COLLECTIONS.LISTINGS, id);
  return doc as unknown as Listing;
};

/** Fetch all listings for a specific vendor */
export const getVendorListings = async (vendorId: string): Promise<Listing[]> => {
  const response = await databases.listDocuments(DB_ID, COLLECTIONS.LISTINGS, [
    Query.equal('vendorId', vendorId),
    Query.orderDesc('$createdAt'),
  ]);
  return response.documents as unknown as Listing[];
};

/** Create a new food listing (with optional image upload) */
export const createListing = async (data: CreateListingData): Promise<Listing> => {
  let imageUrl = '';

  if (data.imageFile) {
    const file = await storage.createFile(
      BUCKETS.FOOD_IMAGES,
      ID.unique(),
      data.imageFile
    );
    imageUrl = storage.getFilePreview(BUCKETS.FOOD_IMAGES, file.$id).toString();
  }

  const { imageFile: _, ...listingData } = data;
  const doc = await databases.createDocument(
    DB_ID,
    COLLECTIONS.LISTINGS,
    ID.unique(),
    {
      ...listingData,
      imageUrl,
      claimsUsed: 0,
      status: 'active',
    }
  );
  return doc as unknown as Listing;
};

/** Update a listing */
export const updateListing = async (
  id: string,
  data: Partial<Listing>
): Promise<Listing> => {
  const doc = await databases.updateDocument(DB_ID, COLLECTIONS.LISTINGS, id, data);
  return doc as unknown as Listing;
};

/** Delete a listing */
export const deleteListing = async (id: string): Promise<void> => {
  await databases.deleteDocument(DB_ID, COLLECTIONS.LISTINGS, id);
};

/** Upload a food image to storage */
export const uploadFoodImage = async (file: File): Promise<string> => {
  const uploaded = await storage.createFile(BUCKETS.FOOD_IMAGES, ID.unique(), file);
  return storage.getFilePreview(BUCKETS.FOOD_IMAGES, uploaded.$id).toString();
};
