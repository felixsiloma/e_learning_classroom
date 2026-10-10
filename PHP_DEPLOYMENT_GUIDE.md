# 🐘 HYCLASS Studio Academy - PHP, JSON, CSS & HTML Architecture Guide

This project is a multi-tier web application structured with **JSON databases**, **CSS stylesheets**, **HTML templates**, and **PHP server-side scripts**.

---

## 📁 File Structure & Assets

```
├── data/                       # JSON Database Storage Engine
│   ├── users.json              # User profiles & strict 2-Admin quota
│   ├── courses.json            # Studio curricula, modules, video URLs & KES pricing
│   ├── settings.json           # Live platform branding, taglines, hero texts
│   └── transactions.json       # Kenya Shillings (KES) M-Pesa receipts
│
├── config.php                  # Central PHP configuration & Render PostgreSQL credentials
├── database.php                # PHP Database class (reads/writes JSON & PDO PostgreSQL)
├── index.php                   # Full-featured PHP web application (HTML5 + CSS + JS)
│
├── api/                        # PHP REST API Endpoints
│   ├── users.php               # GET / POST / PUT user management (2-admin rule check)
│   ├── reset_password.php      # Password Matrix self-reset & Admin Priority override
│   ├── courses.php             # Courses catalog & creation
│   ├── settings.php            # CMS site configuration
│   └── transactions.php        # M-Pesa STK push & transactions ledger
│
├── public/css/style.css        # Pure CSS stylesheet with Oxford Blue, Amber & HS animations
├── css/style.css               # Web root stylesheet re-export
│
├── render.yaml                 # 1-Click Render.com Blueprint (Web Service + Free PostgreSQL)
└── server.ts                   # Express fullstack server with Vite middleware & PHP API routes
```

---

## 🛡️ Core Rules & Invariants

1. **Strict 2-Admin Quota**:
   - Both `api/users.php` and `database.php` actively enforce `MAX_ADMIN_COUNT = 2`.
   - Any registration attempt or role upgrade to `admin` when 2 admins already exist returns `HTTP 403 Forbidden`:
     `"Admin Quota Exceeded: Only two administrators are allowed in HYCLASS Studio Academy."`
   - Active default Dean: `Dr. Sarah Lin` (`registrar@hyclass.oxford.ac.uk`).

2. **Forgot Password Matrix & Admin Priority Override**:
   - Users can reset their password via `api/reset_password.php` using their registered email.
   - Administrators can reset **any user's password** directly with priority override authorization.

3. **High-Class Studio (HS) Scanning Animation**:
   - Styled in `public/css/style.css` via `.hs-matrix-scanner`, `.hs-matrix-pulse`, and `.hs-matrix-beam`.
   - Shows active matrix scanning beam and pulses during authentication.

---

## 🚀 How to Run & Deploy

### Option 1: Live on Render (100% Free Subscription)
1. Push this repo to GitHub.
2. Sign in to [https://dashboard.render.com](https://dashboard.render.com).
3. Click **New +** → **Blueprint** and select your repository.
4. Render automatically reads `render.yaml` and launches both the Web Service and Free PostgreSQL Database at $0/month.

### Option 2: Run with Standard PHP (Apache, Nginx, or Local)
```bash
# Start local PHP built-in server with JSON database:
php -S 0.0.0.0:8000 index.php
```

### Option 3: Run with Node.js Fullstack Server (Dev & Live Preview)
```bash
# Starts Node 22 / Express server on port 3000:
npm run dev
```
Both the React website and all PHP endpoints (`/api/users.php`, `/api/reset_password.php`, `/api/courses.php`, `/api/settings.php`, `/api/transactions.php`, `/data/*.json`) run together concurrently on the same port!
