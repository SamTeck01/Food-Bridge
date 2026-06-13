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
    try {
      const file = await storage.createFile(
        BUCKETS.FOOD_IMAGES,
        ID.unique(),
        data.imageFile
      );
      imageUrl = storage.getFileView(BUCKETS.FOOD_IMAGES, file.$id).toString();
    } catch (uploadErr) {
      console.warn('Image upload failed, proceeding without image:', uploadErr);
    }
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
  return storage.getFileView(BUCKETS.FOOD_IMAGES, uploaded.$id).toString();
};

/**
 * Resolves a listing image, falling back to high-quality topic-relevant Unsplash images
 * if the provided image URL is empty or represents a placeholder.
 */
export const getListingImage = (name: string, imageUrl?: string, description?: string): string => {
  if (imageUrl && imageUrl.trim().startsWith('http')) {
    return imageUrl;
  }

  const textToAnalyze = `${name} ${description || ''}`.toLowerCase();

  if (textToAnalyze.includes('rice') || textToAnalyze.includes('jollof') || textToAnalyze.includes('biryani') || textToAnalyze.includes('fried rice')) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80';
  }
  if (textToAnalyze.includes('soup') || textToAnalyze.includes('stew') || textToAnalyze.includes('egusi') || textToAnalyze.includes('sauce') || textToAnalyze.includes('curry')) {
    return 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80';
  }
  if (textToAnalyze.includes('bread') || textToAnalyze.includes('pastry') || textToAnalyze.includes('pastries') || textToAnalyze.includes('cake') || textToAnalyze.includes('bakery') || textToAnalyze.includes('pie') || textToAnalyze.includes('donut') || textToAnalyze.includes('chin chin')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';
  }
  if (textToAnalyze.includes('drink') || textToAnalyze.includes('beverage') || textToAnalyze.includes('juice') || textToAnalyze.includes('water') || textToAnalyze.includes('tea') || textToAnalyze.includes('soda') || textToAnalyze.includes('coke')) {
    return 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80';
  }
  if (textToAnalyze.includes('swallow') || textToAnalyze.includes('amala') || textToAnalyze.includes('fufu') || textToAnalyze.includes('eba') || textToAnalyze.includes('semo') || textToAnalyze.includes('yam')) {
    return 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80';
  }
  if (textToAnalyze.includes('burger') || textToAnalyze.includes('sandwich') || textToAnalyze.includes('shawarma') || textToAnalyze.includes('fast food') || textToAnalyze.includes('fry') || textToAnalyze.includes('fries') || textToAnalyze.includes('chips')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80';
  }
  if (textToAnalyze.includes('salad') || textToAnalyze.includes('fruit') || textToAnalyze.includes('vegetable') || textToAnalyze.includes('veg')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80';
  }
  if (textToAnalyze.includes('pasta') || textToAnalyze.includes('spaghetti') || textToAnalyze.includes('noodle') || textToAnalyze.includes('indomie')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80';
  }

  // General food fallback
  return 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80';
};
