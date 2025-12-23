export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role: 'DONOR' | 'RECEIVER' | 'VOLUNTEER' | 'NGO' | 'ADMIN';
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'DEACTIVATED';
  organizationName?: string;
  points: number;
  preferredLanguage: string;
}

export interface Donation {
  id: number;
  donor: User;
  foodType: string;
  description: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  pickupAddress?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  status: 'PENDING' | 'MATCHED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  isRecurring: boolean;
  specialInstructions?: string;
  createdAt: string;
}

export interface Delivery {
  id: number;
  donation: Donation;
  volunteer?: User;
  receiver?: User;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  pickupTime?: string;
  deliveryTime?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  safetyCheckPassed: boolean;
  receiptConfirmed: boolean;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedEntityId?: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  role: string;
  status: string;
}
