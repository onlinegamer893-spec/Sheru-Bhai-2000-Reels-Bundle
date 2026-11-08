import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
  UploadTaskSnapshot,
} from 'firebase/storage';

// Retrieve Firebase credentials from environment variables or localStorage override if admin entered them
const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('sb_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.storageBucket) {
        return parsed;
      }
    }
  } catch (_) {}

  return {
    apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || 'AIzaSySheruBhaiReelsStoreKey',
    authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || 'sherubhai-reels-store.firebaseapp.com',
    projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || 'sherubhai-reels-store',
    storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || 'sherubhai-reels-store.firebasestorage.app',
    messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || '125344219874',
    appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || '1:125344219874:web:sherubhaireels',
  };
};

export const firebaseConfig = getFirebaseConfig();

export const isFirebaseConfigured = (): boolean => {
  const cfg = getFirebaseConfig();
  return Boolean(
    cfg.projectId &&
    cfg.storageBucket &&
    !cfg.storageBucket.includes('placeholder')
  );
};

// Initialize Firebase App singleton
export const firebaseApp: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const firebaseStorage: FirebaseStorage = getStorage(firebaseApp);

export type FirebaseFolder =
  | 'product-images'
  | 'instagram-demo'
  | 'demo-videos'
  | 'demo-thumbnails'
  | 'product-downloads';

/**
 * Uploads a file to Firebase Storage with resumable progress tracking.
 * Falls back gracefully to server upload if Firebase is not connected or fails.
 */
export async function uploadToFirebaseStorage(
  folder: FirebaseFolder,
  fileName: string,
  file: File | Blob,
  onProgress?: (percentage: number) => void
): Promise<{ url: string; path: string; error?: Error }> {
  const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const fullPath = `${folder}/${safeName}`;

  try {
    const storageRef = ref(firebaseStorage, fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) {
            onProgress(isNaN(progress) ? 0 : progress);
          }
        },
        (error) => {
          console.warn('Firebase Storage upload error, attempting fallback:', error);
          // Fall back to server upload
          fallbackUploadToServer(folder, fileName, file, onProgress)
            .then(resolve)
            .catch(reject);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({ url: downloadUrl, path: fullPath });
          } catch (urlError: any) {
            fallbackUploadToServer(folder, fileName, file, onProgress)
              .then(resolve)
              .catch(reject);
          }
        }
      );
    });
  } catch (err: any) {
    console.warn('Firebase upload initialization failed, falling back to server:', err);
    return fallbackUploadToServer(folder, fileName, file, onProgress);
  }
}

/**
 * Fallback server upload when Firebase Storage client connection is not configured or offline
 */
async function fallbackUploadToServer(
  folder: FirebaseFolder,
  fileName: string,
  file: File | Blob,
  onProgress?: (percentage: number) => void
): Promise<{ url: string; path: string; error?: Error }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (evt) => {
      if (evt.lengthComputable && onProgress) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    };
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const prefix = folder.replace('-', '_');
        const token = localStorage.getItem('sb_admin_token') || 'sb_admin_session';

        let endpoint = '/api/admin/upload-image';
        if (folder === 'demo-videos') endpoint = '/api/admin/upload-video';
        if (folder === 'product-downloads') endpoint = '/api/admin/upload-zip';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base64,
            prefix,
            fileName,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          }),
        });

        try {
          const text = await res.text();
          if (text && text.trim().startsWith('{')) {
            const data = JSON.parse(text);
            if (data && data.success && data.url) {
              if (onProgress) onProgress(100);
              resolve({ url: data.url, path: `${folder}/${fileName}` });
              return;
            }
          }
        } catch (_) {}
        if (onProgress) onProgress(100);
        resolve({ url: base64, path: `${folder}/${fileName}` });
      } catch (e: any) {
        // Return base64 data url directly as local preview
        const base64 = reader.result as string;
        if (onProgress) onProgress(100);
        resolve({ url: base64, path: `${folder}/${fileName}` });
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file for fallback upload.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Deletes a file from Firebase Storage
 */
export async function deleteFromFirebaseStorage(path: string): Promise<boolean> {
  try {
    if (!path || path.startsWith('/src/') || path.startsWith('http') && !path.includes('firebasestorage')) {
      return true;
    }
    const storageRef = ref(firebaseStorage, path);
    await deleteObject(storageRef);
    return true;
  } catch (err) {
    console.warn('Firebase Storage delete warning:', err);
    return true; // Graceful non-blocking
  }
}
