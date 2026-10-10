import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { INITIAL_USERS, INITIAL_COURSES, INITIAL_SETTINGS, INITIAL_TRANSACTIONS } from './src/data/initialData';
import { User, Course, SiteSettings, Transaction } from './src/types';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE = path.resolve(__dirname, 'render-db-config.json');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory fallback caches initialized with rich initial data
let memoryUsers: User[] = [...INITIAL_USERS];
let memoryCourses: Course[] = [...INITIAL_COURSES];
let memorySettings: SiteSettings = { ...INITIAL_SETTINGS };
let memoryTransactions: Transaction[] = [...INITIAL_TRANSACTIONS];

// Load persisted database URL if user connected via UI or env
function loadPersistedDatabaseUrl(): string {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (parsed && parsed.databaseUrl) {
        return parsed.databaseUrl;
      }
    }
  } catch (e) {
    // Fall back to env
  }
  return process.env.DATABASE_URL || process.env.RENDER_POSTGRES_URL || '';
}

let currentDatabaseUrl = loadPersistedDatabaseUrl();
let dbPool: pg.Pool | null = null;
let isPostgresConnected = false;

async function connectToRenderPostgres(url: string) {
  if (!url || !url.trim()) {
    throw new Error('Connection string cannot be empty.');
  }
  const cleanUrl = url.trim();
  const isLocalhost = cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1');

  const newPool = new Pool({
    connectionString: cleanUrl,
    ssl: isLocalhost ? false : { rejectUnauthorized: false }, // Render PostgreSQL requires SSL
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  const testRes = await newPool.query('SELECT NOW() as current_time, version() as engine, current_database() as db_name');

  if (dbPool) {
    try { await dbPool.end(); } catch {}
  }

  dbPool = newPool;
  isPostgresConnected = true;
  currentDatabaseUrl = cleanUrl;

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ 
      databaseUrl: cleanUrl, 
      connectedAt: new Date().toISOString() 
    }, null, 2));
  } catch (err: any) {
    console.warn('Could not persist render-db-config.json:', err.message);
  }

  // Ensure tables and initial records exist on Render PostgreSQL
  await initPostgresSchema();

  let maskedHost = 'render-postgres';
  try {
    const parsed = new URL(cleanUrl);
    maskedHost = parsed.hostname;
  } catch {}

  return {
    success: true,
    message: 'Successfully connected to Render PostgreSQL database!',
    host: maskedHost,
    engine: testRes.rows[0].engine,
    time: testRes.rows[0].current_time,
    database: testRes.rows[0].db_name,
  };
}

if (currentDatabaseUrl) {
  connectToRenderPostgres(currentDatabaseUrl)
    .then(res => console.log('✅ Render PostgreSQL connected on startup:', res.host))
    .catch(err => {
      console.warn('⚠️ Render PostgreSQL initial connect notice:', err.message);
      console.log('ℹ️ Running in resilient local storage mode.');
    });
} else {
  console.log('ℹ️ Render PostgreSQL ready. Connect via UI or DATABASE_URL environment variable.');
}

async function initPostgresSchema() {
  if (!dbPool) return;
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        role TEXT NOT NULL,
        avatar TEXT,
        phone TEXT,
        title TEXT,
        bio TEXT,
        institution TEXT,
        enrolled_course_ids JSONB DEFAULT '[]'::jsonb,
        completed_course_ids JSONB DEFAULT '[]'::jsonb,
        learning_hours INT DEFAULT 0,
        streak_days INT DEFAULT 0,
        status TEXT DEFAULT 'active',
        registered_at TEXT
      );

      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        instructor_id TEXT,
        instructor_name TEXT,
        instructor_title TEXT,
        instructor_avatar TEXT,
        institution TEXT,
        category TEXT,
        level TEXT,
        duration TEXT,
        price INT,
        original_price INT,
        rating NUMERIC DEFAULT 5.0,
        reviews_count INT DEFAULT 0,
        enrolled_count INT DEFAULT 0,
        thumbnail TEXT,
        skills JSONB DEFAULT '[]'::jsonb,
        learning_outcomes JSONB DEFAULT '[]'::jsonb,
        prerequisites JSONB DEFAULT '[]'::jsonb,
        modules JSONB DEFAULT '[]'::jsonb,
        published BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        receipt_number TEXT UNIQUE NOT NULL,
        student_id TEXT,
        student_name TEXT,
        student_email TEXT,
        course_id TEXT,
        course_title TEXT,
        amount INT,
        currency TEXT DEFAULT 'KES',
        payment_method TEXT,
        payment_details JSONB,
        status TEXT DEFAULT 'completed',
        timestamp TEXT
      );
    `);

    // Seed default settings if empty
    const settingsCheck = await dbPool.query('SELECT id FROM site_settings WHERE id = $1', ['primary_config']);
    if (settingsCheck.rowCount === 0) {
      await dbPool.query('INSERT INTO site_settings (id, data) VALUES ($1, $2)', [
        'primary_config',
        JSON.stringify(INITIAL_SETTINGS),
      ]);
    }

    // Seed users if empty
    const usersCheck = await dbPool.query('SELECT COUNT(*) FROM users');
    if (Number(usersCheck.rows[0].count) === 0) {
      for (const u of INITIAL_USERS) {
        await dbPool.query(`
          INSERT INTO users (id, name, email, password, role, avatar, phone, title, bio, institution, enrolled_course_ids, completed_course_ids, learning_hours, streak_days, status, registered_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [
          u.id, u.name, u.email, u.password || 'password123', u.role, u.avatar,
          u.phone || null, u.title || null, u.bio || null, u.institution || null,
          JSON.stringify(u.enrolledCourseIds || []), JSON.stringify(u.completedCourseIds || []),
          u.learningHours || 0, u.streakDays || 0, u.status || 'active', u.registeredAt || new Date().toISOString()
        ]);
      }
      console.log('✅ Seeded initial users into Render PostgreSQL');
    }

    console.log('✅ Render PostgreSQL schema verified and ready.');
  } catch (err: any) {
    console.warn('⚠️ Error during Render PostgreSQL schema init:', err.message);
  }
}

// -------------------------------------------------------------
// API ENDPOINTS FOR RENDER WEBSITE & DATABASE
// -------------------------------------------------------------

// 1. Health & Database Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    postgresConfigured: Boolean(currentDatabaseUrl),
    postgresConnected: isPostgresConnected,
    databaseEngine: isPostgresConnected ? 'Render PostgreSQL (Cloud Managed)' : 'Render Cloud Ready (Free Tier)',
    port: PORT,
  });
});

app.get('/api/db/status', async (req: Request, res: Response) => {
  try {
    let usersCount = memoryUsers.length;
    let coursesCount = memoryCourses.length;
    let transactionsCount = memoryTransactions.length;
    let pgTime = null;
    let pgVersion = null;

    if (dbPool && isPostgresConnected) {
      try {
        const timeRes = await dbPool.query('SELECT NOW() as now, version() as version');
        pgTime = timeRes.rows[0].now;
        pgVersion = timeRes.rows[0].version;

        const uRes = await dbPool.query('SELECT COUNT(*) FROM users');
        const cRes = await dbPool.query('SELECT COUNT(*) FROM courses');
        const tRes = await dbPool.query('SELECT COUNT(*) FROM transactions');
        usersCount = Number(uRes.rows[0].count);
        coursesCount = Number(cRes.rows[0].count);
        transactionsCount = Number(tRes.rows[0].count);
      } catch (e) {
        // Fallback to memory counts
      }
    }

    const currentAdmins = memoryUsers.filter(u => u.role === 'admin');

    // Parse host safely from currentDatabaseUrl if exists
    let maskedHost = 'render-postgres-cloud-ready';
    if (currentDatabaseUrl) {
      try {
        const parsed = new URL(currentDatabaseUrl);
        maskedHost = parsed.hostname;
      } catch {
        maskedHost = 'render.com-managed-instance';
      }
    }

    res.json({
      connected: isPostgresConnected,
      databaseUrlConfigured: Boolean(currentDatabaseUrl),
      databaseEngine: isPostgresConnected ? 'Render PostgreSQL (Cloud Managed)' : 'Render Cloud Ready (Free Tier)',
      maskedHost,
      pgTime,
      pgVersion,
      tables: {
        users: usersCount,
        courses: coursesCount,
        transactions: transactionsCount,
        site_settings: 1,
      },
      adminQuota: {
        current: currentAdmins.length,
        max: 2,
        seatsRemaining: Math.max(0, 2 - currentAdmins.length),
        adminEmails: currentAdmins.map(a => a.email),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Interactive Render PostgreSQL Connection API
app.post('/api/render/connect', async (req: Request, res: Response) => {
  try {
    const { connectionString } = req.body;
    if (!connectionString || typeof connectionString !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid Render PostgreSQL connection string (e.g. postgresql://user:pass@dpg-xxxxx.frankfurt-postgres.render.com/hyclass_academy)' 
      });
    }
    const result = await connectToRenderPostgres(connectionString);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      message: `Failed to connect to Render PostgreSQL: ${err.message}` 
    });
  }
});

// Full Connect & Deploy schema to Render PostgreSQL endpoint
app.post('/api/render/deploy', async (req: Request, res: Response) => {
  try {
    const { connectionString } = req.body;
    const targetUrl = connectionString || currentDatabaseUrl;

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a Render PostgreSQL connection string to deploy the schema.',
      });
    }

    const connRes = await connectToRenderPostgres(targetUrl);
    let tableNames: string[] = [];
    if (dbPool) {
      const tablesRes = await dbPool.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
      `);
      tableNames = tablesRes.rows.map(r => r.table_name);
    }

    res.json({
      success: true,
      message: '🎉 Successfully connected and verified database schema on Render PostgreSQL!',
      host: connRes.host,
      engine: connRes.engine,
      time: connRes.time,
      tables: tableNames,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: `Deployment to Render PostgreSQL failed: ${err.message}`,
    });
  }
});

app.post('/api/render/disconnect', async (req: Request, res: Response) => {
  try {
    if (dbPool) {
      try { await dbPool.end(); } catch {}
    }
    dbPool = null;
    isPostgresConnected = false;
    currentDatabaseUrl = '';
    if (fs.existsSync(CONFIG_FILE)) {
      try { fs.unlinkSync(CONFIG_FILE); } catch {}
    }
    res.json({ 
      success: true, 
      message: 'Disconnected from Render database. Switched back to local database engine.' 
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/render/sync', async (req: Request, res: Response) => {
  try {
    if (!dbPool || !isPostgresConnected) {
      return res.status(400).json({ success: false, message: 'Render PostgreSQL is not connected.' });
    }
    await initPostgresSchema();
    res.json({ success: true, message: 'Successfully synced schema and data with Render PostgreSQL!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Test query execution endpoint for Admin Dashboard Render Console
app.post('/api/db/test-query', async (req: Request, res: Response) => {
  const start = Date.now();
  if (dbPool && isPostgresConnected) {
    try {
      const result = await dbPool.query('SELECT NOW() as current_timestamp, current_database() as db_name, version() as engine');
      const duration = Date.now() - start;
      res.json({
        success: true,
        source: 'Render PostgreSQL',
        durationMs: duration,
        data: result.rows[0],
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, durationMs: Date.now() - start });
    }
  } else {
    res.json({
      success: true,
      source: 'Local Memory Engine (Simulated PostgreSQL)',
      durationMs: Date.now() - start,
      data: {
        current_timestamp: new Date().toISOString(),
        db_name: 'courserax_academy_local',
        engine: 'PostgreSQL 16 Compatible (Ready for Render)',
      },
    });
  }
});

// 2. Users Management with Strict 2-Admin Quota
app.get('/api/users', async (req: Request, res: Response) => {
  if (dbPool && isPostgresConnected) {
    try {
      const result = await dbPool.query('SELECT * FROM users ORDER BY registered_at DESC');
      const formatted: User[] = result.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        password: r.password,
        role: r.role,
        avatar: r.avatar,
        phone: r.phone,
        title: r.title,
        bio: r.bio,
        institution: r.institution,
        enrolledCourseIds: r.enrolled_course_ids || [],
        completedCourseIds: r.completed_course_ids || [],
        learningHours: r.learning_hours || 0,
        streakDays: r.streak_days || 0,
        status: r.status || 'active',
        registeredAt: r.registered_at,
      }));
      return res.json(formatted);
    } catch (err) {
      console.warn('Error reading users from PostgreSQL, falling back to memory:', err);
    }
  }
  res.json(memoryUsers);
});

// Create User / Registration (enforces 2-admin rule)
app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, avatar, title, institution, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    // Check duplicate email
    const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // ENFORCE TWO-ADMIN RULE
    if (role === 'admin') {
      const currentAdminCount = memoryUsers.filter(u => u.role === 'admin').length;
      if (currentAdminCount >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Admin Quota Exceeded: Only 2 administrators can be registered on HYCLASS Studio Academy.',
        });
      }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      password: password || 'password123',
      role: role || 'student',
      avatar: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      title: title || (role === 'instructor' ? 'Visiting Studio Lecturer' : 'Studio Scholar'),
      institution: institution || 'Oxford School of Architecture',
      phone: phone || '',
      enrolledCourseIds: [],
      completedCourseIds: [],
      learningHours: 0,
      streakDays: 1,
      status: role === 'instructor' ? 'pending_approval' : 'active',
      registeredAt: new Date().toISOString().split('T')[0],
    };

    memoryUsers.push(newUser);

    if (dbPool && isPostgresConnected) {
      try {
        await dbPool.query(`
          INSERT INTO users (id, name, email, password, role, avatar, phone, title, bio, institution, enrolled_course_ids, completed_course_ids, learning_hours, streak_days, status, registered_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, [
          newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.avatar,
          newUser.phone, newUser.title, newUser.bio || '', newUser.institution,
          JSON.stringify([]), JSON.stringify([]), 0, 1, newUser.status, newUser.registeredAt
        ]);
      } catch (err: any) {
        console.warn('Postgres user insert warning:', err.message);
      }
    }

    res.status(201).json({ success: true, user: newUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update User (role change, profile update, etc.)
app.put('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const index = memoryUsers.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // If changing role to admin, check 2-admin rule
  if (updates.role === 'admin' && memoryUsers[index].role !== 'admin') {
    const adminCount = memoryUsers.filter(u => u.role === 'admin').length;
    if (adminCount >= 2) {
      return res.status(403).json({
        success: false,
        message: 'Admin Quota Full: Only two administrators are allowed on the platform.',
      });
    }
  }

  memoryUsers[index] = { ...memoryUsers[index], ...updates };

  if (dbPool && isPostgresConnected) {
    try {
      const u = memoryUsers[index];
      await dbPool.query(`
        UPDATE users SET 
          name = $1, email = $2, role = $3, avatar = $4, phone = $5,
          title = $6, bio = $7, institution = $8, status = $9, password = $10
        WHERE id = $11
      `, [
        u.name, u.email, u.role, u.avatar, u.phone || null,
        u.title || null, u.bio || null, u.institution || null, u.status, u.password, u.id
      ]);
    } catch (err: any) {
      console.warn('Postgres user update warning:', err.message);
    }
  }

  res.json({ success: true, user: memoryUsers[index] });
});

// Reset Password (matrix self-service or admin priority override)
app.post('/api/users/reset-password', async (req: Request, res: Response) => {
  const { email, userId, newPassword, adminInitiated } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  let user = memoryUsers.find(u => {
    if (userId) return u.id === userId;
    if (email) return u.email.toLowerCase() === email.toLowerCase().trim();
    return false;
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found.' });
  }

  user.password = newPassword;

  if (dbPool && isPostgresConnected) {
    try {
      await dbPool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, user.id]);
    } catch (err: any) {
      console.warn('Postgres password update warning:', err.message);
    }
  }

  res.json({
    success: true,
    message: adminInitiated
      ? `Admin override applied: Password successfully reset for ${user.name} (${user.email}).`
      : `Password successfully updated. You may now sign in with your new password.`,
  });
});

// 3. Courses API
app.get('/api/courses', (req: Request, res: Response) => {
  res.json(memoryCourses);
});

app.post('/api/courses', (req: Request, res: Response) => {
  const newCourse: Course = req.body;
  if (!newCourse.id) {
    newCourse.id = `course-${Date.now()}`;
  }
  memoryCourses.push(newCourse);
  res.status(201).json({ success: true, course: newCourse });
});

app.put('/api/courses/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const index = memoryCourses.findIndex(c => c.id === id);
  if (index !== -1) {
    memoryCourses[index] = { ...memoryCourses[index], ...updates };
    return res.json({ success: true, course: memoryCourses[index] });
  }
  res.status(404).json({ success: false, message: 'Course not found' });
});

app.delete('/api/courses/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  memoryCourses = memoryCourses.filter(c => c.id !== id);
  res.json({ success: true, message: 'Course deleted successfully' });
});

// 4. Site Settings (CMS)
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(memorySettings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  memorySettings = { ...memorySettings, ...req.body };
  res.json({ success: true, settings: memorySettings });
});

// 5. Transactions
app.get('/api/transactions', (req: Request, res: Response) => {
  res.json(memoryTransactions);
});

app.post('/api/transactions', (req: Request, res: Response) => {
  const newTxn: Transaction = req.body;
  memoryTransactions.unshift(newTxn);
  res.status(201).json({ success: true, transaction: newTxn });
});

// -------------------------------------------------------------
// PHP & JSON COMPATIBILITY ENDPOINTS
// -------------------------------------------------------------
app.all('/api/users.php', (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res.json({
      success: true,
      total: memoryUsers.length,
      adminCount: memoryUsers.filter(u => u.role === 'admin').length,
      maxAdmins: 2,
      users: memoryUsers,
    });
  } else if (req.method === 'POST') {
    const { name, email, password, role } = req.body;
    if (role === 'admin' && memoryUsers.filter(u => u.role === 'admin').length >= 2) {
      return res.status(403).json({
        success: false,
        message: 'Admin Quota Exceeded: Only 2 administrators can be registered on HYCLASS Studio Academy.',
      });
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: (email || '').toLowerCase().trim(),
      password: password || 'password123',
      role: role || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: role === 'instructor' ? 'Visiting Studio Lecturer' : 'Studio Scholar',
      institution: 'Oxford School of Architecture',
      enrolledCourseIds: [],
      completedCourseIds: [],
      learningHours: 0,
      streakDays: 1,
      status: role === 'instructor' ? 'pending_approval' : 'active',
      registeredAt: new Date().toISOString().split('T')[0],
    };
    memoryUsers.push(newUser);
    return res.status(201).json({ success: true, user: newUser });
  }
  res.status(405).json({ success: false, message: 'Method not allowed' });
});

app.post('/api/reset_password.php', (req: Request, res: Response) => {
  const { email, userId, newPassword, adminInitiated } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }
  const user = memoryUsers.find(u => {
    if (userId) return u.id === userId;
    if (email) return u.email.toLowerCase() === email.toLowerCase().trim();
    return false;
  });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found.' });
  }
  user.password = newPassword;
  res.json({
    success: true,
    message: adminInitiated
      ? `Admin override applied: Password successfully reset for ${user.name} (${user.email}).`
      : 'Password successfully updated. You may now sign in with your new password.',
  });
});

app.get('/api/courses.php', (req: Request, res: Response) => {
  res.json({ success: true, total: memoryCourses.length, courses: memoryCourses });
});

app.all('/api/settings.php', (req: Request, res: Response) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    memorySettings = { ...memorySettings, ...req.body };
  }
  res.json({ success: true, settings: memorySettings });
});

app.all('/api/transactions.php', (req: Request, res: Response) => {
  if (req.method === 'POST') {
    const newTxn: Transaction = req.body;
    memoryTransactions.unshift(newTxn);
    return res.status(201).json({ success: true, transaction: newTxn });
  }
  res.json({ success: true, transactions: memoryTransactions });
});

app.all('/api/users.php', (req: Request, res: Response) => {
  if (req.method === 'POST') {
    const { name, email, role, password, avatar, phone, title, institution, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Full Name and Email are required.' });
    }
    const targetRole = role || 'student';
    if (targetRole === 'admin') {
      const currentAdmins = memoryUsers.filter(u => u.role === 'admin').length;
      if (currentAdmins >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Admin Quota Exceeded: Only two (2) administrators are allowed in CourseraX Academy.'
        });
      }
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password || 'password123',
      role: targetRole,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: phone || '+254 7',
      title: title || (targetRole === 'instructor' ? 'Studio Faculty' : 'Architecture Scholar'),
      institution: institution || 'CourseraX Academy',
      bio: bio || '',
      enrolledCourseIds: [],
      completedCourseIds: [],
      learningHours: 0,
      streakDays: 1,
      status: targetRole === 'instructor' ? 'pending_approval' : 'active',
      registeredAt: new Date().toISOString().split('T')[0]
    };
    memoryUsers.push(newUser);
    return res.status(201).json({ success: true, user: newUser });
  }
  const adminCount = memoryUsers.filter(u => u.role === 'admin').length;
  res.json({
    success: true,
    total: memoryUsers.length,
    adminCount,
    maxAdmins: 2,
    users: memoryUsers
  });
});

// Serve raw JSON data and CSS files
app.use('/data', express.static(path.resolve(__dirname, 'data')));
app.use('/public/css', express.static(path.resolve(__dirname, 'public/css')));
app.use('/css', express.static(path.resolve(__dirname, 'public/css')));


// -------------------------------------------------------------
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // In dev mode, attach Vite as middleware with hmr disabled to avoid Cloud Run WebSocket errors
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite development middlewares attached (HMR WebSockets disabled).');
  } else {
    // In production (e.g. Render live deployment), serve built dist directory
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('📦 Serving production build from /dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 HYCLASS Studio Academy Website running at http://0.0.0.0:${PORT}`);
    console.log(`🚀 Render PostgreSQL Support: ${currentDatabaseUrl ? 'Configured' : 'Ready (Free Tier)'}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
});
