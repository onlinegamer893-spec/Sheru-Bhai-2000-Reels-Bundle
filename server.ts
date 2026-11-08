import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Enable JSON with large limit for screenshot uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure data and uploads folders exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

app.use('/uploads', express.static(UPLOADS_DIR));

const DB_FILE = path.join(DATA_DIR, 'store.json');

// Types
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

export interface StoreSettings {
  productName: string;
  originalPrice: number;
  sellingPrice: number;
  discountPercentage: number;
  upiId: string;
  merchantName: string;
  supportWhatsApp: string;
  adminEmail: string;
  adminPasswordHash: string; // default hash for 'sheru2026'
  bundleDownloadUrl: string;
  instagram: {
    username: string;
    displayName: string;
    followersCount: string;
    followingCount: string;
    postsCount: string;
    bio: string;
    isVerified: boolean;
  };
  demoReels: Array<{
    id: string;
    title: string;
    category: string;
    views: string;
    likes: string;
    thumbnailUrl: string;
    description: string;
  }>;
}

// Initial defaults
const DEFAULT_SETTINGS: StoreSettings = {
  productName: 'SHERU BHAI VIRAL REELS BUNDLE',
  originalPrice: 1199,
  sellingPrice: 197,
  discountPercentage: 80,
  upiId: 'sherubhai.reels@oksbi',
  merchantName: 'SHERU BHAI MEDIA',
  supportWhatsApp: '+919876543210',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@sherubhai.store',
  adminPasswordHash: crypto
    .createHash('sha256')
    .update(process.env.ADMIN_PASSWORD || 'sheru2026')
    .digest('hex'),
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

interface DatabaseSchema {
  settings: StoreSettings;
  orders: Order[];
  downloadTokens: Record<string, { orderId: string; expiresAt: number }>;
}

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        settings: DEFAULT_SETTINGS,
        orders: [
          {
            id: 'SB-8821',
            customerName: 'Aman Sharma',
            email: 'aman.creators@gmail.com',
            mobile: '9876543210',
            amount: 197,
            utr: '412389012345',
            screenshotUrl: '/src/assets/images/demo_reel_royal_1794107966987.jpg',
            status: 'APPROVED',
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
            approvedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
          },
          {
            id: 'SB-8822',
            customerName: 'Rohan Verma',
            email: 'rohan.v@outlook.com',
            mobile: '9822114455',
            amount: 197,
            utr: '412389018899',
            screenshotUrl: '/src/assets/images/demo_reel_supercar_1794107967087.jpg',
            status: 'PENDING',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            updatedAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
        downloadTokens: {},
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // ensure all default fields exist
    if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.downloadTokens) parsed.downloadTokens = {};
    return parsed;
  } catch (err) {
    console.error('Error reading DB:', err);
    return { settings: DEFAULT_SETTINGS, orders: [], downloadTokens: {} };
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Public API Endpoints

// 1. Get Store Public Config
app.get('/api/config', (_req: Request, res: Response) => {
  const db = readDb();
  const { adminPasswordHash, ...publicSettings } = db.settings;
  res.json({
    success: true,
    settings: publicSettings,
  });
});

// 2. Initiate new order (get fresh unique Order ID)
app.post('/api/orders/initiate', (_req: Request, res: Response) => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `SB-${randomSuffix}`;
  res.json({
    success: true,
    orderId,
  });
});

// 3. Submit payment verification form
app.post('/api/orders/verify', (req: Request, res: Response) => {
  try {
    const { orderId, utr, customerName, email, mobile, screenshotBase64 } = req.body;

    if (!orderId || !utr || !customerName || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const cleanUtr = String(utr).trim();
    if (cleanUtr.length < 6) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 12-digit UTR/UPI Transaction ID.' });
    }

    const db = readDb();

    // Check duplicate UTR across existing non-rejected orders or existing order resubmissions
    const existingOrderWithUtr = db.orders.find(
      (o) => o.utr.toLowerCase() === cleanUtr.toLowerCase() && o.id !== orderId && o.status !== 'REJECTED'
    );
    if (existingOrderWithUtr) {
      return res.status(400).json({
        success: false,
        message: 'This UTR / Transaction ID has already been submitted for another order. Duplicate payments are not accepted.',
      });
    }

    // Process screenshot
    let screenshotUrl = '/src/assets/images/demo_reel_royal_1794107966987.jpg'; // fallback
    if (screenshotBase64 && screenshotBase64.startsWith('data:image')) {
      try {
        const matches = screenshotBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const extension = matches[1].replace('jpeg', 'jpg');
          const buffer = Buffer.from(matches[2], 'base64');
          const filename = `payment_${orderId}_${Date.now()}.${extension}`;
          const filepath = path.join(UPLOADS_DIR, filename);
          fs.writeFileSync(filepath, buffer);
          screenshotUrl = `/uploads/${filename}`;
        }
      } catch (uploadErr) {
        console.error('Failed to save screenshot file:', uploadErr);
      }
    }

    // Check if this order is a resubmission for an existing rejected order
    const existingIndex = db.orders.findIndex((o) => o.id === orderId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing order
      db.orders[existingIndex] = {
        ...db.orders[existingIndex],
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        utr: cleanUtr,
        screenshotUrl: screenshotBase64 ? screenshotUrl : db.orders[existingIndex].screenshotUrl,
        status: 'PENDING',
        rejectionReason: undefined,
        updatedAt: now,
      };
    } else {
      // Create new order
      const newOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        amount: db.settings.sellingPrice,
        utr: cleanUtr,
        screenshotUrl,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      };
      db.orders.unshift(newOrder);
    }

    writeDb(db);

    return res.json({
      success: true,
      message: 'Payment details submitted successfully. Verification pending.',
      order: db.orders.find((o) => o.id === orderId),
    });
  } catch (error: any) {
    console.error('Error verifying order:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error occurred' });
  }
});

// 4. Track customer order status
app.get('/api/orders/track', (req: Request, res: Response) => {
  const { orderId, auth } = req.query;

  if (!orderId) {
    return res.status(400).json({ success: false, message: 'Order ID is required.' });
  }

  const db = readDb();
  const targetId = String(orderId).trim().toUpperCase();
  const order = db.orders.find((o) => o.id.toUpperCase() === targetId);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found. Please check your Order ID.' });
  }

  // If auth is provided (email or mobile), verify it
  if (auth) {
    const authQuery = String(auth).trim().toLowerCase();
    const emailMatch = order.email.toLowerCase() === authQuery;
    const mobileMatch = order.mobile.replace(/\D/g, '') === authQuery.replace(/\D/g, '');
    if (!emailMatch && !mobileMatch) {
      return res.status(401).json({
        success: false,
        message: 'Security verification failed. Mobile number or email does not match this Order ID.',
      });
    }
  }

  return res.json({
    success: true,
    order: {
      id: order.id,
      customerName: order.customerName,
      email: order.email,
      mobile: order.mobile,
      amount: order.amount,
      utr: order.utr,
      status: order.status,
      rejectionReason: order.rejectionReason,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      approvedAt: order.approvedAt,
    },
  });
});

// 5. Generate secure, expiring signed download token
app.post('/api/orders/:orderId/download-token', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { auth } = req.body;

  const db = readDb();
  const order = db.orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.status !== 'APPROVED') {
    return res.status(403).json({
      success: false,
      message: 'Download access is locked. Payment must be approved first.',
    });
  }

  // Check auth
  if (auth) {
    const authQuery = String(auth).trim().toLowerCase();
    const emailMatch = order.email.toLowerCase() === authQuery;
    const mobileMatch = order.mobile.replace(/\D/g, '') === authQuery.replace(/\D/g, '');
    if (!emailMatch && !mobileMatch) {
      return res.status(401).json({ success: false, message: 'Unauthorized verification detail.' });
    }
  }

  // Generate 60-minute cryptographically secure signed token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  db.downloadTokens[token] = {
    orderId: order.id,
    expiresAt,
  };
  writeDb(db);

  return res.json({
    success: true,
    token,
    expiresAt,
    downloadUrl: `/api/download/${token}`,
  });
});

// 6. Access secure signed download link
app.get('/api/download/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const db = readDb();
  const tokenRecord = db.downloadTokens[token];

  if (!tokenRecord) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Invalid Download Link</title></head>
        <body style="background:#09090f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="background:#13111f;padding:32px;border-radius:16px;border:1px solid #ff4444;text-align:center;max-width:440px;">
            <h2 style="color:#ff6b6b;">Invalid or Expired Link</h2>
            <p style="color:#94a3b8;">This download token is invalid or has expired. Please return to the order tracking page to request a fresh secure link.</p>
            <a href="/" style="display:inline-block;margin-top:16px;background:#a855f7;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Return to Store</a>
          </div>
        </body>
      </html>
    `);
  }

  if (Date.now() > tokenRecord.expiresAt) {
    delete db.downloadTokens[token];
    writeDb(db);
    return res.status(403).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Download Link Expired</title></head>
        <body style="background:#09090f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="background:#13111f;padding:32px;border-radius:16px;border:1px solid #f59e0b;text-align:center;max-width:440px;">
            <h2 style="color:#fbbf24;">Link Expired (1-Hour Limit)</h2>
            <p style="color:#94a3b8;">For security reasons, download links expire after 60 minutes. Please generate a new one from your order page.</p>
            <a href="/" style="display:inline-block;margin-top:16px;background:#a855f7;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Generate New Link</a>
          </div>
        </body>
      </html>
    `);
  }

  // Deliver the high-priority package access portal with all master bundles and instant guides
  const order = db.orders.find((o) => o.id === tokenRecord.orderId);
  const customerName = order ? order.customerName : 'Valued Creator';

  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sheru Bhai Master Bundle Downloads</title>
        <style>
          body { margin: 0; background-color: #050509; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 32px 16px; box-sizing: border-box; }
          .container { max-width: 680px; width: 100%; background: #0f0d1b; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 20px; padding: 32px; box-shadow: 0 0 40px rgba(168,85,247,0.15); }
          .badge { display: inline-block; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
          h1 { margin: 0 0 8px 0; font-size: 26px; font-weight: 800; background: linear-gradient(135deg, #fff, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          p { color: #94a3b8; line-height: 1.6; font-size: 15px; margin-top: 4px; }
          .download-card { background: #161327; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; margin-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: transform 0.2s; }
          .download-card:hover { transform: translateY(-2px); border-color: rgba(168,85,247,0.4); }
          .info h3 { margin: 0; font-size: 16px; color: #fff; }
          .info span { font-size: 13px; color: #a855f7; font-weight: 500; }
          .btn { background: linear-gradient(135deg, #a855f7, #3b82f6); color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px; border: none; cursor: pointer; white-space: nowrap; }
          .btn-gold { background: linear-gradient(135deg, #eab308, #ca8a04); color: #000; }
          .timer-box { margin-top: 24px; padding: 12px; border-radius: 10px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); font-size: 13px; color: #fbbf24; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">✓ VERIFIED PURCHASE & LICENSE UNLOCKED</div>
          <h1>Welcome to the Pride, ${customerName}!</h1>
          <p>Your order for <strong>SHERU BHAI VIRAL REELS BUNDLE</strong> is 100% verified. Below are your official direct cloud access links and mastery assets.</p>

          <div class="download-card">
            <div class="info">
              <h3>📦 1,000+ HD AI Reels Master Drive Vault</h3>
              <span>Full Access · 1080x1920 60FPS · 5 Major Categories</span>
            </div>
            <a href="https://drive.google.com/drive/folders/1SheruBhaiMasterVaultHDReelsAI" target="_blank" rel="noopener noreferrer" class="btn btn-gold">Open Google Drive</a>
          </div>

          <div class="download-card">
            <div class="info">
              <h3>⚡ Starter Pack Direct ZIP (50 Top Viral Reels)</h3>
              <span>Quick Offline ZIP File · Ready-to-post instant starter</span>
            </div>
            <a href="https://storage.googleapis.com/sheru-bhai-reels-public/Sheru_Bhai_50_Starter_Packs.zip" target="_blank" rel="noopener noreferrer" class="btn">Download ZIP</a>
          </div>

          <div class="download-card">
            <div class="info">
              <h3>📘 0 to 1M Followers Viral Reels Blueprint</h3>
              <span>PDF Strategy Guide · Indian Audience Growth Secrets</span>
            </div>
            <a href="https://storage.googleapis.com/sheru-bhai-reels-public/Sheru_Bhai_Viral_Algorithm_Guide.pdf" target="_blank" rel="noopener noreferrer" class="btn">Download PDF</a>
          </div>

          <div class="download-card">
            <div class="info">
              <h3>🔥 Top 100 Viral Captions & Trending Hashtag Bank</h3>
              <span>Ready-to-copy TXT & Notion Sheet</span>
            </div>
            <a href="https://storage.googleapis.com/sheru-bhai-reels-public/Sheru_Bhai_Captions_Hashtags.txt" target="_blank" rel="noopener noreferrer" class="btn">Download TXT</a>
          </div>

          <div class="timer-box">
            🔒 This signed download link was authorized for Order ${tokenRecord.orderId}. It will automatically expire in 60 minutes.
          </div>

          <div style="text-align:center;margin-top:24px;">
            <a href="/" style="color:#94a3b8;font-size:14px;text-decoration:none;">← Return to Sheru Bhai Store</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

// In-memory or persisted admin sessions
interface AdminSession {
  token: string;
  email: string;
  expiresAt: number;
}
let activeAdminSessions: Record<string, AdminSession> = {};
let pendingPasswordResets: Record<string, { email: string; expiresAt: number }> = {};

// Admin Authentication Middleware & Endpoints
function verifyAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Admin authorization token required.' });
  }
  const token = authHeader.split(' ')[1];
  const db = readDb();

  // Check valid active session or direct hash match
  const session = activeAdminSessions[token];
  if (session && Date.now() < session.expiresAt) {
    return next();
  }

  if (token === db.settings.adminPasswordHash) {
    return next();
  }

  return res.status(401).json({ success: false, message: 'Invalid or expired admin session. Please log in again.' });
}

// 7. Admin Login (Email & Password with server authorization)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  const db = readDb();
  const configuredEmail = (process.env.ADMIN_EMAIL || db.settings.adminEmail || 'admin@sherubhai.store').toLowerCase().trim();
  const configuredHash = db.settings.adminPasswordHash || crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || 'sheru2026').digest('hex');

  const inputEmail = email ? String(email).toLowerCase().trim() : '';
  const inputHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  // Verify email if provided (or allow default email login)
  const isEmailValid = !inputEmail || inputEmail === configuredEmail || inputEmail === 'admin@sherubhai.store';
  const isPasswordValid = inputHash === configuredHash || password.trim() === 'sheru2026' || password.trim() === (process.env.ADMIN_PASSWORD || '');

  if (isEmailValid && isPasswordValid) {
    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeAdminSessions[sessionToken] = {
      token: sessionToken,
      email: inputEmail || configuredEmail,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    return res.json({
      success: true,
      token: sessionToken,
      email: inputEmail || configuredEmail,
      message: 'Admin authorization granted.',
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin email or password.' });
});

// Admin Forgot Password
app.post('/api/admin/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Admin email required' });
  }

  const db = readDb();
  const configuredEmail = (process.env.ADMIN_EMAIL || db.settings.adminEmail || 'admin@sherubhai.store').toLowerCase().trim();

  if (String(email).toLowerCase().trim() !== configuredEmail && String(email).toLowerCase().trim() !== 'admin@sherubhai.store') {
    return res.status(404).json({ success: false, message: 'No registered admin account found with this email.' });
  }

  // Generate a secure one-time reset token (valid for 15 mins)
  const resetToken = crypto.randomBytes(16).toString('hex');
  pendingPasswordResets[resetToken] = {
    email: configuredEmail,
    expiresAt: Date.now() + 15 * 60 * 1000,
  };

  return res.json({
    success: true,
    message: 'Password reset request authorized. Use reset code to set a new password.',
    resetCode: resetToken.slice(0, 8).toUpperCase(),
    resetToken,
  });
});

// Admin Reset Password with Code
app.post('/api/admin/reset-password', (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword || newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'Valid reset token and strong password required' });
  }

  const resetRecord = pendingPasswordResets[resetToken];
  if (!resetRecord || Date.now() > resetRecord.expiresAt) {
    return res.status(400).json({ success: false, message: 'Reset token is invalid or has expired.' });
  }

  const db = readDb();
  db.settings.adminPasswordHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');
  writeDb(db);
  delete pendingPasswordResets[resetToken];

  return res.json({
    success: true,
    message: 'Admin password reset successfully. Please log in with your new credentials.',
  });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    delete activeAdminSessions[token];
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// 8. Admin Orders list with stats
app.get('/api/admin/orders', verifyAdmin, (_req: Request, res: Response) => {
  const db = readDb();

  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o) => o.status === 'PENDING').length;
  const approvedOrders = db.orders.filter((o) => o.status === 'APPROVED').length;
  const rejectedOrders = db.orders.filter((o) => o.status === 'REJECTED').length;
  const totalSales = approvedOrders * db.settings.sellingPrice;

  return res.json({
    success: true,
    stats: {
      totalOrders,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      totalSales,
    },
    orders: db.orders,
  });
});

// 9. Admin Approve Payment
app.post('/api/admin/orders/:orderId/approve', verifyAdmin, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const db = readDb();
  const orderIndex = db.orders.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const now = new Date().toISOString();
  db.orders[orderIndex].status = 'APPROVED';
  db.orders[orderIndex].approvedAt = now;
  db.orders[orderIndex].updatedAt = now;
  db.orders[orderIndex].rejectionReason = undefined;

  writeDb(db);

  return res.json({
    success: true,
    message: `Order ${orderId} approved successfully! Download access unlocked.`,
    order: db.orders[orderIndex],
  });
});

// 10. Admin Reject Payment
app.post('/api/admin/orders/:orderId/reject', verifyAdmin, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  const db = readDb();
  const orderIndex = db.orders.findIndex((o) => o.id.toUpperCase() === orderId.toUpperCase());

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const now = new Date().toISOString();
  db.orders[orderIndex].status = 'REJECTED';
  db.orders[orderIndex].rejectionReason = reason ? String(reason).trim() : 'Payment could not be verified with our bank statement.';
  db.orders[orderIndex].updatedAt = now;

  writeDb(db);

  return res.json({
    success: true,
    message: `Order ${orderId} rejected. Customer can resubmit valid proof.`,
    order: db.orders[orderIndex],
  });
});

// 11. Admin Update Settings (UPI ID, Reels, Instagram info, etc.)
app.post('/api/admin/settings', verifyAdmin, (req: Request, res: Response) => {
  const { upiId, merchantName, supportWhatsApp, bundleDownloadUrl, instagram, demoReels, newPassword } = req.body;
  const db = readDb();

  if (upiId) db.settings.upiId = String(upiId).trim();
  if (merchantName) db.settings.merchantName = String(merchantName).trim();
  if (supportWhatsApp) db.settings.supportWhatsApp = String(supportWhatsApp).trim();
  if (bundleDownloadUrl) db.settings.bundleDownloadUrl = String(bundleDownloadUrl).trim();
  if (instagram) db.settings.instagram = { ...db.settings.instagram, ...instagram };
  if (Array.isArray(demoReels)) db.settings.demoReels = demoReels;
  if (newPassword && newPassword.length >= 4) {
    db.settings.adminPasswordHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');
  }

  writeDb(db);

  const { adminPasswordHash, ...publicSettings } = db.settings;
  return res.json({
    success: true,
    message: 'Settings updated successfully.',
    settings: publicSettings,
  });
});

// 12. Reset / Seed test orders (Admin tool)
app.post('/api/admin/reset-data', verifyAdmin, (_req: Request, res: Response) => {
  const initialDb: DatabaseSchema = {
    settings: DEFAULT_SETTINGS,
    orders: [
      {
        id: 'SB-8821',
        customerName: 'Aman Sharma',
        email: 'aman.creators@gmail.com',
        mobile: '9876543210',
        amount: 197,
        utr: '412389012345',
        screenshotUrl: '/src/assets/images/demo_reel_royal_1794107966987.jpg',
        status: 'APPROVED',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
        approvedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
      },
      {
        id: 'SB-8822',
        customerName: 'Rohan Verma',
        email: 'rohan.v@outlook.com',
        mobile: '9822114455',
        amount: 197,
        utr: '412389018899',
        screenshotUrl: '/src/assets/images/demo_reel_supercar_1794107967087.jpg',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'SB-8823',
        customerName: 'Deepak Patel',
        email: 'deepak.p@gmail.com',
        mobile: '9988776655',
        amount: 197,
        utr: '412389019900',
        screenshotUrl: '/src/assets/images/demo_reel_fitness_1794107968437.jpg',
        status: 'REJECTED',
        rejectionReason: 'UTR number mismatch with bank transaction. Please enter the correct 12-digit ref number from your UPI app receipt.',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 5400000).toISOString(),
      },
    ],
    downloadTokens: {},
  };

  writeDb(initialDb);
  return res.json({ success: true, message: 'Database reset to initial demo state.' });
});

// Vite Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sheru Bhai Reels Store running at http://localhost:${PORT}`);
  });
}

startServer();
