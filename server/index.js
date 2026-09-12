const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── JSON "database" helpers ─────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB = {
      users: [
        {
          id: 1,
          email: 'superadmin@slt.lk',
          password: 'admin123',
          name: 'Super Admin',
          role: 'superadmin',
        },
      ],
      registrations: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  if (!data.users) {
    data.users = [
      {
        id: 1,
        email: 'superadmin@slt.lk',
        password: 'admin123',
        name: 'Super Admin',
        role: 'superadmin',
      },
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }
  return data;
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ── Routes ──────────────────────────────────────────────────

// AUTH: Login (Super Admin & Company Admin)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDB();

  // 1. Check in users table (Super Admins)
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) {
    return res.json({
      success: true,
      token: `token-user-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'superadmin',
      },
    });
  }

  // 2. Check in approved registrations (Company Admins)
  const approvedComp = db.registrations.find(
    (r) =>
      r.status === 'approved' &&
      ((r.adminEmail && r.adminEmail.toLowerCase() === email.toLowerCase()) ||
        (r.companyEmail && r.companyEmail.toLowerCase() === email.toLowerCase()))
  );

  if (approvedComp) {
    return res.json({
      success: true,
      token: `token-company-${approvedComp.id}-${Date.now()}`,
      user: {
        id: approvedComp.id,
        name: approvedComp.adminName || approvedComp.companyName,
        email: approvedComp.adminEmail || approvedComp.companyEmail,
        role: 'company',
        companyName: approvedComp.companyName,
      },
    });
  }

  return res.status(401).json({ error: 'Invalid email or password' });
});

// AUTH: Register Super Admin
app.post('/api/auth/register-admin', (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: Date.now(),
    name: fullName || 'Super Admin',
    email,
    password,
    role: 'superadmin',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  });
});

// GET dynamic platform stats
app.get('/api/stats', (req, res) => {
  const db = readDB();
  const activeCount = db.registrations.filter((r) => r.status === 'approved').length;
  const pendingCount = db.registrations.filter((r) => r.status === 'pending').length;

  res.json({
    totalAvailability: activeCount,
    activeConnections: activeCount,
    pendingRequests: pendingCount,
  });
});

// GET all registrations (optionally filter by status)
app.get('/api/registrations', (req, res) => {
  const db = readDB();
  const { status } = req.query;
  const list = status
    ? db.registrations.filter((r) => r.status === status)
    : db.registrations;
  res.json(list);
});

// POST — new company registration
app.post('/api/registrations', (req, res) => {
  const db = readDB();
  const newReg = {
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.registrations.push(newReg);
  writeDB(db);
  res.status(201).json(newReg);
});

// PATCH — approve or reject
app.patch('/api/registrations/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const idx = db.registrations.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.registrations[idx] = { ...db.registrations[idx], ...req.body };
  writeDB(db);
  res.json(db.registrations[idx]);
});

// DELETE
app.delete('/api/registrations/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.registrations = db.registrations.filter((r) => r.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 OmniAI Backend running → http://localhost:${PORT}\n`);
});
