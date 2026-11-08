-- ==============================================================================
-- SHERU BHAI REELS STORE - SUPABASE SCHEMA & STORAGE POLICIES
-- ==============================================================================

-- 1. Create table for store settings
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  product_name TEXT NOT NULL DEFAULT 'SHERU BHAI VIRAL REELS BUNDLE',
  original_price NUMERIC NOT NULL DEFAULT 1199,
  selling_price NUMERIC NOT NULL DEFAULT 197,
  discount_percentage NUMERIC NOT NULL DEFAULT 80,
  upi_id TEXT NOT NULL DEFAULT 'sherubhai.reels@oksbi',
  merchant_name TEXT NOT NULL DEFAULT 'SHERU BHAI MEDIA',
  support_whatsapp TEXT NOT NULL DEFAULT '+919876543210',
  custom_qr_url TEXT,
  bundle_download_url TEXT NOT NULL DEFAULT 'https://drive.google.com/drive/folders/1SheruBhaiMasterVaultHDReelsAI',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create table for product images
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_type TEXT NOT NULL, -- 'cover', 'mockup', 'promotional'
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create table for instagram demo
CREATE TABLE IF NOT EXISTS public.instagram_demo (
  id TEXT PRIMARY KEY DEFAULT 'default',
  username TEXT NOT NULL DEFAULT 'sherubhai.official',
  display_name TEXT NOT NULL DEFAULT 'SHERU BHAI | King of AI Reels 👑',
  followers_count TEXT NOT NULL DEFAULT '1.4M',
  following_count TEXT NOT NULL DEFAULT '84',
  posts_count TEXT NOT NULL DEFAULT '342',
  bio TEXT NOT NULL DEFAULT '🔥 India’s #1 AI Reels Creator\n🚀 100M+ Monthly Views\n👑 Living Royal • AI Supercars • Animal Attitude\n👇 Get 2000+ Ready Reels for ₹197 Only!',
  is_verified BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  profile_screenshot TEXT,
  profile_url TEXT,
  post_grid JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create table for demo reels videos
CREATE TABLE IF NOT EXISTS public.demo_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  views TEXT NOT NULL DEFAULT '10M+',
  likes TEXT NOT NULL DEFAULT '1M+',
  thumbnail_url TEXT NOT NULL,
  video_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Create table for product downloads
CREATE TABLE IF NOT EXISTS public.product_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_url TEXT NOT NULL,
  version TEXT DEFAULT '2027.1',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
-- Create public storage buckets for media
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('product_images', 'product_images', true),
  ('demo_videos', 'demo_videos', true),
  ('product_downloads', 'product_downloads', false) -- Private: accessible only via signed URLs
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_demo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_downloads ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allow anyone to view published store content)
CREATE POLICY "Public Read Store Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Instagram Demo" ON public.instagram_demo FOR SELECT USING (true);
CREATE POLICY "Public Read Demo Videos" ON public.demo_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public View Product Images Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'product_images');
CREATE POLICY "Public View Demo Videos Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'demo_videos');

-- 2. Admin Write Policies (Service role or authenticated admin)
CREATE POLICY "Admin All Store Settings" ON public.store_settings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Product Images" ON public.product_images FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Instagram Demo" ON public.instagram_demo FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Demo Videos" ON public.demo_videos FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin All Product Downloads" ON public.product_downloads FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Storage Admin Upload Policies
CREATE POLICY "Admin Storage Product Images" ON storage.objects FOR ALL USING (bucket_id = 'product_images' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));
CREATE POLICY "Admin Storage Demo Videos" ON storage.objects FOR ALL USING (bucket_id = 'demo_videos' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));
CREATE POLICY "Admin Storage Product Downloads" ON storage.objects FOR ALL USING (bucket_id = 'product_downloads' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));
