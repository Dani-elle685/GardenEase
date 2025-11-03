export interface Garden {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  size: number;
  image: string;
  images?: string[]; // Multiple images for gallery
  rating: number;
  reviews: number;
  amenities: string[];
  ownerName: string;
  ownerAvatar: string;
  availability: boolean;
}

export interface Booking {
  id: string;
  gardenId: string;
  gardenName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}

export interface Claim {
  id: string;
  bookingId: string;
  gardenName: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  category: 'refund' | 'property_damage' | 'cancellation' | 'service_issue' | 'other';
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export type UserRole = 'visitor' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}
