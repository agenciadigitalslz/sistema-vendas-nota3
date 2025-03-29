
// Types for our entities matching the C program's structs

export interface Client {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
  value: number;
}

export type SaleStatus = 'ativa' | 'cancelada';

export interface Sale {
  id: number;
  clientId: number;
  productId: number;
  quantity: number;
  totalValue: number;
  dateTime: string;
  status: SaleStatus;
}

// Type for sale with product and client details
export interface DetailedSale extends Sale {
  clientName: string;
  productName: string;
  productValue: number;
}
