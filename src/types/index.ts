export type ListingStatus = 'pending' | 'approved' | 'suspended' | 'sold';
export type ListingCondition = 'new' | 'refurbished' | 'used' | 'parts';
export type ListingType = 'for_sale' | 'wanted';
export type Language = 'en' | 'ar';

export interface Listing {
  id: string;
  ref: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  serial: string;
  year: number | null;
  condition: ListingCondition;
  warranty: string;
  listingType: ListingType;
  price: number | null;
  currency: string;
  payment: string;
  location: string;
  country: string;
  description: string;
  specs: string;
  images: string; // JSON string of base64 array
  services: string; // JSON string of extra services array
  status: ListingStatus;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerCompany: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  approvedAt: Date | string | null;
}

export interface Inquiry {
  id: string;
  listingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCompany: string;
  message: string;
  createdAt: Date | string;
}

export interface AdminStats {
  totalApproved: number;
  totalPending: number;
  totalSuspended: number;
  totalValue: number;
  byCategory: Record<string, number>;
}

export interface ListingFormData {
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  serial: string;
  year: string;
  condition: ListingCondition;
  warranty: string;
  listingType: ListingType;
  price: string;
  payment: string;
  location: string;
  description: string;
  specs: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerCompany: string;
}
