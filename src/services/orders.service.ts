import { ID, Query } from 'appwrite';
import { databases, DB_ID, COLLECTIONS } from '../lib/appwrite';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'expired' | 'cancelled';

export interface Order {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  listingId: string;
  listingName: string;
  listingImageUrl: string;
  buyerId: string;
  vendorId: string;
  vendorName: string;
  totalPaid: number;
  originalTotal: number;
  status: OrderStatus;
  pickupTime: string;
  distance: string;
  claimedAt: string;
  rating?: number;
  remark?: string;
  buyerName?: string;
  quantity?: number;
}

// ─── Orders Service ───────────────────────────────────────────────────────────

/** Create an order (claim) — prevents duplicate active claims */
export const createOrder = async (data: {
  listingId: string;
  listingName: string;
  listingImageUrl: string;
  buyerId: string;
  vendorId: string;
  vendorName: string;
  totalPaid: number;
  originalTotal: number;
  pickupTime: string;
  distance: string;
  buyerName?: string;
  quantity?: number;
}): Promise<Order> => {
  // ── Duplicate guard ──────────────────────────────────────────────────
  // Check if this buyer already has an active/pending/confirmed order for this listing
  try {
    const existing = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
      Query.equal('buyerId', data.buyerId),
      Query.equal('listingId', data.listingId),
      Query.or([
        Query.equal('status', 'confirmed'),
        Query.equal('status', 'pending'),
      ]),
      Query.limit(1),
    ]);
    if (existing.total > 0) {
      // Return the existing order instead of creating a duplicate
      return existing.documents[0] as unknown as Order;
    }
  } catch {
    // If the check fails, proceed with creation (fail open)
  }

  const doc = await databases.createDocument(
    DB_ID,
    COLLECTIONS.ORDERS,
    ID.unique(),
    {
      ...data,
      status: 'confirmed',
      claimedAt: new Date().toISOString(),
    }
  );
  return doc as unknown as Order;
};

/** Get all orders for a buyer */
export const getUserOrders = async (buyerId: string): Promise<Order[]> => {
  const response = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
    Query.equal('buyerId', buyerId),
    Query.orderDesc('claimedAt'),
  ]);
  return response.documents as unknown as Order[];
};

/** Get all orders for a vendor */
export const getVendorOrders = async (vendorId: string): Promise<Order[]> => {
  const response = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
    Query.equal('vendorId', vendorId),
    Query.orderDesc('claimedAt'),
  ]);
  return response.documents as unknown as Order[];
};

/** Get all orders for a specific listing */
export const getListingOrders = async (listingId: string): Promise<Order[]> => {
  const response = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
    Query.equal('listingId', listingId),
    Query.orderDesc('claimedAt'),
  ]);
  return response.documents as unknown as Order[];
};

/** Update an order's status */
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<Order> => {
  const doc = await databases.updateDocument(DB_ID, COLLECTIONS.ORDERS, id, { status });
  return doc as unknown as Order;
};

/** Get a single order by ID */
export const getOrderById = async (id: string): Promise<Order> => {
  const doc = await databases.getDocument(DB_ID, COLLECTIONS.ORDERS, id);
  return doc as unknown as Order;
};

/** Rate an order */
export const rateOrder = async (
  id: string,
  rating: number,
  remark: string
): Promise<Order> => {
  const doc = await databases.updateDocument(DB_ID, COLLECTIONS.ORDERS, id, {
    rating,
    remark,
  });
  return doc as unknown as Order;
};

