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
  videoUrl?: string;
  description: string;
  active?: boolean;
  displayOrder?: number;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  views?: string;
  likes?: string;
}

export interface InstagramProfile {
  username: string;
  displayName: string;
  followersCount: string;
  followingCount: string;
  postsCount: string;
  bio: string;
  isVerified: boolean;
  avatarUrl?: string;
  profileScreenshot?: string;
  profileUrl?: string;
  postGrid?: InstagramPost[];
}

export interface PromotionalImage {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export interface ProductImages {
  coverImage?: string;
  bundleMockup?: string;
  promotionalImages?: PromotionalImage[];
}

export interface ProductDownloadFile {
  id: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
  version?: string;
}

export interface PublicStoreSettings {
  productName: string;
  originalPrice: number;
  sellingPrice: number;
  discountPercentage: number;
  upiId: string;
  merchantName: string;
  supportWhatsApp: string;
  customQrUrl?: string;
  bundleDownloadUrl: string;
  productImages?: ProductImages;
  instagram: InstagramProfile;
  demoReels: DemoReel[];
  productDownloads?: ProductDownloadFile[];
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  totalSales: number;
}
