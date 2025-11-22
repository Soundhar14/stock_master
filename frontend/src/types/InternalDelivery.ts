export interface TransferProduct {
  id: number;
  name: string;
  sku: string;
}

export interface TransferWarehouse {
  id: number;
  name: string;
}

export interface TransferLocation {
  id: number;
  name: string;
}

export interface InternalTransferData {
  id: number;
  product: TransferProduct[];               // array with product details
  sourceWarehouse: TransferWarehouse[];     // array for warehouse
  sourceLocation: TransferLocation[];       // array for location
  destinationWarehouse: TransferWarehouse[]; 
  destinationLocation: TransferLocation[];

  quantity: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";  // status enum
  transferDate: string;                      // ISO string
  reference: string;                         // "IT-2025-001"
  notes: string | null;
}

export interface InternalTransferRequest {
  productId: number;
  sourceWarehouseId: number;
  sourceLocationId: number;
  destinationWarehouseId: number;
  destinationLocationId: number;
  quantity: number;
  reference: string;
  notes: string | null;
}
