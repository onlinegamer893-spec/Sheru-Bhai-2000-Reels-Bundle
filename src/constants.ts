import { PublicStoreSettings } from './types';

export const ASSET_IMAGES = {
  bundleMockup: '/src/assets/images/sheru_bundle_mockup_1794107965527.jpg',
  supercarReel: '/src/assets/images/demo_reel_supercar_1794107967087.jpg',
  royalReel: '/src/assets/images/demo_reel_royal_1794107966987.jpg',
  fitnessReel: '/src/assets/images/demo_reel_fitness_1794107968437.jpg',
  avatarLogo: '/src/assets/images/sheru_avatar_logo_1794107968916.jpg',
};

export const DEFAULT_STORE_CONFIG: PublicStoreSettings = {
  productName: 'SHERU BHAI VIRAL REELS BUNDLE',
  originalPrice: 1199,
  sellingPrice: 197,
  discountPercentage: 84,
  upiId: 'sherubhai.reels@oksbi',
  merchantName: 'SHERU BHAI MEDIA',
  supportWhatsApp: '+919876543210',
  bundleDownloadUrl: 'https://drive.google.com/drive/folders/1SheruBhaiMasterVaultHDReelsAI',
  instagram: {
    username: 'sherubhai.official',
    displayName: 'SHERU BHAI | King of AI Reels 👑',
    followersCount: '1.4M',
    followingCount: '84',
    postsCount: '342',
    bio: '🔥 India’s #1 AI Reels Creator\n🚀 100M+ Monthly Views\n👑 Living Royal • AI Supercars • Animal Attitude\n👇 Get 1000+ Ready Reels for ₹197 Only!',
    isVerified: true,
  },
  demoReels: [
    {
      id: 'demo-1',
      title: 'Night Rider · Supercar Beast',
      category: 'Luxury Cars & Speed',
      views: '14.8M',
      likes: '1.2M',
      thumbnailUrl: ASSET_IMAGES.supercarReel,
      description: 'Futuristic matte black supercar tearing through neon rain in Dubai.',
    },
    {
      id: 'demo-2',
      title: 'Maharaja Lion King · Royal Attitude',
      category: 'Royal Lifestyle & Attitude',
      views: '22.4M',
      likes: '1.9M',
      thumbnailUrl: ASSET_IMAGES.royalReel,
      description: 'Regal Sheru Bhai on golden royal throne with high-status cinematic audio.',
    },
    {
      id: 'demo-3',
      title: 'Beast Mode · Iron Never Lies',
      category: 'High Energy Motivation',
      views: '9.6M',
      likes: '740K',
      thumbnailUrl: ASSET_IMAGES.fitnessReel,
      description: 'Ultra-muscular lion dominating heavy gym sets with neon electric pump.',
    },
  ],
};

export const PRODUCT_FEATURES = [
  {
    icon: 'Crown',
    title: 'Sheru Bhai Royal Lifestyle',
    description: 'Billionaire mansions, tailored Italian suits, private jets, and royal golden palace thrones crafted with cinematic perfection.',
    tag: 'Highest Virality',
  },
  {
    icon: 'Flame',
    title: 'Luxury Supercars & Neon Drives',
    description: 'Matte black Lamborghinis, Bugattis, and Rolls-Royces cruising neon city streets at midnight with ultra-bass audio cues.',
    tag: 'Trending Audio',
  },
  {
    icon: 'Zap',
    title: 'Alpha Attitude & Savage Quotes',
    description: 'High-status body language, iconic sunglasses, and powerful Hindi/English attitude dialogues that stop viewers mid-scroll.',
    tag: 'High Retention',
  },
  {
    icon: 'Dumbbell',
    title: 'Motivational & Beast Mindset',
    description: 'Intense workout visuals, discipline, success mantras, and relentless grind clips that inspire millions of saves.',
    tag: 'Maximum Shares',
  },
  {
    icon: 'Smile',
    title: 'Funny & Wholesome AI Animals',
    description: 'Hilarious lion and tiger relatable comedy situations that generate massive comments and family group sharing.',
    tag: 'Broad Reach',
  },
  {
    icon: 'Sparkles',
    title: '100% Ready-to-Post HD 9:16',
    description: 'Rendered in crisp 1080x1920 60FPS vertical format. No watermarks, no logos, zero editing required—just upload.',
    tag: 'Instant Upload',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Harsh Vardhan Singh',
    handle: '@harsh_attitude_ai',
    followersGained: '+142K Followers in 28 Days',
    quote: 'Maine ₹197 me bundle liya tha. First 5 reels me se ek reel 4.8 million views cross kar gayi! Sabhi reels crystal clear HD hain without any watermark.',
    verified: true,
    city: 'Jaipur, Rajasthan',
  },
  {
    name: 'Pooja Deshmukh',
    handle: '@pooja_daily_reels',
    followersGained: 'Earned ₹35,000 via Brand Deals',
    quote: 'Editing me ghanto lagte the. Sheru Bhai bundle se daily 3 reels post karti hu. 3 weeks me page monetize ho gaya aur sponsorships aane lage.',
    verified: true,
    city: 'Pune, Maharashtra',
  },
  {
    name: 'Kabir Qureshi',
    handle: '@kabir_beast_reels',
    followersGained: '+88K Followers in 3 Weeks',
    quote: 'Payment verify hone me bas 7 minute lage aur download link Google Drive ka turant mil gaya. Audio guide and hashtag templates are pure gold!',
    verified: true,
    city: 'Lucknow, Uttar Pradesh',
  },
];

export const FAQS = [
  {
    question: 'How do I receive the reels after paying ₹197?',
    answer: 'Once you submit your 12-digit UTR and payment screenshot, our automated & manual verification queue reviews your payment (typically within 5 to 15 minutes). As soon as approved, your order unlocks instant access to the Google Drive Master Cloud Folder and direct ZIP downloads.',
  },
  {
    question: 'Are there any watermarks or logos on the videos?',
    answer: 'None whatsoever! Every single video in the Sheru Bhai bundle is 100% clean, unbranded, and watermark-free in 1080x1920 full HD resolution. You can put your own logo, handle, or caption overlays as you wish.',
  },
  {
    question: 'Can I monetize my Instagram, YouTube Shorts, or Facebook page with these reels?',
    answer: 'Yes! All videos come with unrestricted digital commercial and distribution rights for your personal and creator brand channels across Instagram, YouTube Shorts, Facebook Reels, and TikTok.',
  },
  {
    question: 'Do I need any video editing software or skills?',
    answer: 'No editing is needed. The videos are pre-rendered in high definition with visual effects and dynamic motion. We also include a curated Trending Audio Playlist guide so you can pick trending Instagram songs in 1 tap.',
  },
  {
    question: 'What payment apps are supported?',
    answer: 'We support all Indian UPI applications including Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay, and direct banking UPI handles.',
  },
  {
    question: 'What if my payment verification gets delayed or rejected?',
    answer: 'You can check your live order status anytime in our Track Order portal using your Order ID and mobile number. If there is a typo in your UTR, our system displays the reason and gives you a 1-click option to resubmit correct proof.',
  },
];
