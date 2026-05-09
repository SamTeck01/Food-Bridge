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
}

// ─── Orders Service ───────────────────────────────────────────────────────────

/** Create an order (claim) */
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
}): Promise<Order> => {
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

/** Update an order's status */
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<Order> => {
  const doc = await databases.updateDocument(DB_ID, COLLECTIONS.ORDERS, id, { status });
  return doc as unknown as Order;
};
