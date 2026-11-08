export interface Order {
  id: string;
  customerName: string;
  email: string;
  mobile: string;
  amount: number;
  utr: string;
  screenshotUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface DemoReel {
  id: string;
  title: string;
  category: string;
  views: string;
  likes: string;
  thumbnailUrl: string;
  description: string;
}

export interface InstagramProfile {
  username: string;
  displayName: string;
  followersCount: string;
  followingCount: string;
  postsCount: string;
  bio: string;
  isVerified: boolean;
}

export interface PublicStoreSettings {
  productName: string;
  originalPrice: number;
  sellingPrice: number;
  discountPercentage: number;
  upiId: string;
  merchantName: string;
  supportWhatsApp: string;
  bundleDownloadUrl: string;
  instagram: InstagramProfile;
  demoReels: DemoReel[];
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  totalSales: number;
}
