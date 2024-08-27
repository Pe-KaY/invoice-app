export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string; // ID is a string
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: 'pending' | 'paid' | 'draft'; // Status as string literal union
  senderAddress: Address;
  clientAddress: Address;
  items: Item[];
  total: number;
}