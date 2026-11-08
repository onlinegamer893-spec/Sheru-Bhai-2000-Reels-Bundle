import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or localStorage override if admin entered them
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  localStorage.getItem('sb_supabase_url') ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  localStorage.getItem('sb_supabase_anon_key') ||
  '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload file to Supabase Storage with graceful fallback to server / local storage
 */
export async function uploadToSupabaseStorage(
  bucketName: 'product_images' | 'demo_videos' | 'product_downloads',
  filePath: string,
  file: File | Blob
): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase is not configured') };
  }

  try {
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error(`Supabase storage upload error in ${bucketName}:`, err);
    return { url: null, error: err };
  }
}
