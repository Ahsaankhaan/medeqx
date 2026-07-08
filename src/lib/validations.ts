import { z } from 'zod';

export const listingSchema = z.object({
  name: z.string().min(3, 'Equipment name must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string(),
  serial: z.string(),
  year: z.string(),
  condition: z.enum(['new', 'refurbished', 'used', 'parts']),
  warranty: z.string(),
  listingType: z.enum(['for_sale', 'wanted']),
  price: z.string(),
  payment: z.string(),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specs: z.string(),
  sellerName: z.string().min(2, 'Name is required'),
  sellerEmail: z.string().email('Valid email is required'),
  sellerPhone: z.string(),
  sellerCompany: z.string(),
  images: z.string(),
  services: z.string(),
});

export const inquirySchema = z.object({
  listingId: z.string().min(1),
  buyerName: z.string().min(2, 'Name is required'),
  buyerEmail: z.string().email('Valid email required'),
  buyerPhone: z.string(),
  buyerCompany: z.string(),
  message: z.string(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  company: z.string(),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export type ListingInput = z.infer<typeof listingSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
