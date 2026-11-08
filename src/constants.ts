import { PublicStoreSettings } from './types';

export const ASSET_IMAGES = {
  bundleMockup: '/src/assets/images/sheru_bundle_mockup_1794107965527.jpg',
  supercarReel: '/src/assets/images/demo_reel_supercar_1794107967087.jpg',
  royalReel: '/src/assets/images/demo_reel_royal_1794107966987.jpg',
  fitnessReel: '/src/assets/images/demo_reel_fitness_1794107968437.jpg',
  funnyLionReel: '/src/assets/images/demo_reel_funny_lion_1794109493564.jpg',
  avatarLogo: '/src/assets/images/sheru_avatar_logo_1794107968916.jpg',
};

export const DEFAULT_STORE_CONFIG: PublicStoreSettings = {
  productName: 'SHERU BHAI VIRAL REELS BUNDLE',
  originalPrice: 1199,
  sellingPrice: 197,
  discountPercentage: 80,
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
    bio: '🔥 India’s #1 AI Reels Creator\n🚀 100M+ Monthly Views\n👑 Living Royal • AI Supercars • Animal Attitude\n👇 Get 2000+ Ready Reels for ₹197 Only!',
    isVerified: true,
  },
  demoReels: [
    {
      id: 'demo-1',
      title: 'Night Rider · Supercar Beast',
      category: 'Luxury Cars',
      views: '14.8M',
      likes: '1.2M',
      thumbnailUrl: '/src/assets/images/demo_reel_supercar_1794107967087.jpg',
      description: 'Futuristic matte black supercar tearing through neon rain in Dubai.',
    },
    {
      id: 'demo-2',
      title: 'Maharaja Lion King · Royal Attitude',
      category: 'Royal Lifestyle',
      views: '22.4M',
      likes: '1.9M',
      thumbnailUrl: '/src/assets/images/demo_reel_royal_1794107966987.jpg',
      description: 'Regal Sheru Bhai on golden royal throne with high-status cinematic audio.',
    },
    {
      id: 'demo-3',
      title: 'Beast Mode · Iron Never Lies',
      category: 'Fitness & Attitude',
      views: '9.6M',
      likes: '740K',
      thumbnailUrl: '/src/assets/images/demo_reel_fitness_1794107968437.jpg',
      description: 'Ultra-muscular lion dominating heavy gym sets with neon electric pump.',
    },
    {
      id: 'demo-4',
      title: 'Tropical Squad · Vacation King',
      category: 'Funny Animals',
      views: '18.2M',
      likes: '1.5M',
      thumbnailUrl: '/src/assets/images/demo_reel_funny_lion_1794109493564.jpg',
      description: 'Chilling with funny tropical animal squad on luxury beach resort.',
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

export const CREATOR_BONUSES = [
  {
    title: 'Bonus #1: Viral Audio Vault (100+ Links)',
    value: '₹3,499',
    description: 'Instant 1-tap links to trending Instagram audio tracks that the algorithm is actively boosting right now.',
  },
  {
    title: 'Bonus #2: 0 to 1M Followers Blueprint PDF',
    value: '₹4,999',
    description: 'The step-by-step posting schedule, hashtag strategy, and audience retention secrets used by Sheru Bhai.',
  },
  {
    title: 'Bonus #3: 500+ Indian Viral Hashtags Bank',
    value: '₹1,999',
    description: 'Copy-paste high-performing hashtags categorized by niche (Royal, Cars, Motivation, Swag, Comedy).',
  },
  {
    title: 'Bonus #4: Lifetime Master Vault Updates',
    value: '₹2,500',
    description: 'Automatic access to all newly rendered Sheru Bhai reels added each month directly in your Google Drive.',
  },
];

export const TARGET_AUDIENCE = [
  { title: 'Content Creators', desc: 'Grow your personal brand and explosive engagement without spending hours recording.' },
  { title: 'Theme Page Owners', desc: 'Build automated faceless pages that pull millions of organic views and monetization.' },
  { title: 'Digital Marketers & Agencies', desc: 'Provide viral reels content to clients in fitness, luxury, motivation, and lifestyle.' },
  { title: 'Entrepreneurs & Students', desc: 'Start a high-growth side hustle and monetize through sponsorships and brand deals.' },
];

export const UPLOAD_PLATFORMS = [
  { name: 'Instagram Reels', badge: '1080x1920 HD', ratio: '9:16' },
  { name: 'YouTube Shorts', badge: 'High Retention', ratio: '9:16' },
  { name: 'Facebook Reels', badge: 'Massive Reach', ratio: '9:16' },
  { name: 'TikTok & Moj', badge: 'Trending Audio', ratio: '9:16' },
];

export const MONETIZATION_METHODS = [
  { step: '01', title: 'Brand Sponsorships', desc: 'Charge ₹5,000 to ₹50,000 per sponsored reel once your page reaches 20k+ followers.' },
  { step: '02', title: 'Affiliate Marketing', desc: 'Promote fitness, luxury, or tech products in your bio link and earn high commissions.' },
  { step: '03', title: 'Sell Digital Products', desc: 'Sell your own e-books, bundles, or courses to your highly engaged, loyal audience.' },
  { step: '04', title: 'Theme Page Flipping', desc: 'Scale faceless pages to 50k–100k followers and resell them for lucrative payouts.' },
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

