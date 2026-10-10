# CourseraX - Modern Learning & Academy Platform

[![CI & Production Deploy](https://github.com/placeholder/courserax/actions/workflows/ci-deploy.yml/badge.svg)](https://github.com)
[![Render Deploy](https://img.shields.io/badge/Deploy%20to-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-stack, enterprise-grade learning academy web platform featuring multi-role portals (Student, Instructor, and Admin), video lectures, interactive project assignments, grading matrix, enrollment payment gateways, and seamless **Render Cloud PostgreSQL** integration.

---

## 🌟 Key Features

- **🎓 Student Portal**: Browse curated architectural and technology curricula, enroll with instant mock/KES gateway, study interactive modules (video & long-form reading), write notes, and submit studio assignments.
- **👨‍🏫 Instructor Studio**: Author courses, publish rich modules, upload lecture media, review student submissions with rubrics, and issue letter grades with constructive feedback.
- **🛡️ Dean & Administrator Suite**: Full platform user oversight, automated 2-Admin invariant quota enforcement, transactions ledger with refunds, CMS branding editor, and live Render database synchronization.
- **🐘 Render Cloud PostgreSQL Integration**: Full support for Render's Free-tier managed PostgreSQL instances. Connect via one-click in the UI, environment variables (`DATABASE_URL`), or run in offline in-memory mode.
- **⚡ Full-Stack Architecture**: React 19 + TypeScript + Vite frontend with a high-performance Express backend, fully containerized with Docker and ready for 1-click Render deployment.

---

## 🌐 Deploy to GitHub & Host on GitHub Pages (Free Web Hosting)

You can use GitHub itself as your free, high-performance web host via **GitHub Pages**.

### Quick Automated Push:
```bash
# Run the automated deployment script with your GitHub repository URL:
./deploy-to-github.sh https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
```

### Manual Push & Setup:
```bash
# 1. Add your GitHub remote repository
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 2. Push to branch 'main'
git push -u origin main
```

### ⚙️ Activate GitHub Pages as your Live Host (1 Click in GitHub):
1. Open your repository on **GitHub.com**.
2. Go to **Settings** (gear icon) → **Pages** (left navigation menu).
3. Under **Build and deployment** → **Source**, select:
   👉 **GitHub Actions**
4. That's it! GitHub will immediately trigger the included `.github/workflows/deploy-pages.yml` workflow.
5. In ~60 seconds, your site is live at:
   ```
   https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/
   ```
   *(Features automatic SSL/HTTPS, instant CDN edge distribution, and PWA support).*

---

## 🚀 1-Click Deployment to Render (Full-Stack + PostgreSQL)

Render offers a 100% free tier for both web services and managed PostgreSQL databases.

### Method 1: Using Render Blueprint (`render.yaml`) — Recommended

1. Push this repository to your **GitHub** account (see instructions below).
2. Go to the [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically read `render.yaml` and provision:
   - **Web Service**: Node.js fullstack service running your app (`plan: free`).
   - **PostgreSQL Database**: Free managed database with automatic connection string wiring (`plan: free`).
6. Click **Apply**. Within minutes, your app is live on Render with an active HTTPS domain!

### Method 2: Manual Web Service Setup on Render

1. Click **New +** → **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx tsx server.ts`
   - **Plan**: `Free`
4. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: *(Your Render PostgreSQL connection string, or leave blank for local memory mode)*
5. Click **Create Web Service**.

---

## 🐙 Pushing to GitHub

To push this codebase to a new GitHub repository:

```bash
# 1. Initialize git in your project directory
git init

# 2. Add all files (all Android and temporary files have already been cleaned)
git add .

# 3. Create your initial commit
git commit -m "Initial commit: CourseraX learning academy platform ready for GitHub & Render"

# 4. Link your GitHub remote repository
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 5. Push to GitHub
git push -u origin main
```

---

## 💻 Local Development

### Prerequisites
- Node.js 20+ or 22+
- npm or pnpm or bun

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs full-stack Express + Vite with HMR)
npm run dev

# 3. Open your browser
# Navigate to http://localhost:3000
```

### Production Build & Preview
```bash
# Build Vite client production assets
npm run build

# Start production server
npm start
```

---

## 🐳 Docker Deployment

A multi-stage, production-ready `Dockerfile` is included:

```bash
# Build the Docker image
docker build -t courserax-academy .

# Run the container on port 3000
docker run -p 3000:3000 -e NODE_ENV=production courserax-academy
```

You can deploy this container directly to **Render**, **Railway**, **Fly.io**, **Google Cloud Run**, or **AWS ECS**.

---

## 🗄️ Database Architecture

The platform supports two complementary database engines:

1. **Render Cloud PostgreSQL**:
   - Connection via standard URI: `postgresql://user:password@dpg-xxxxxx.oregon-postgres.render.com/courserax`
   - Automatic tables bootstrap: `users`, `courses`, `transactions`, `site_settings`.
   - SSL encryption enabled by default (`ssl: { rejectUnauthorized: false }`).
   - Live query test and manual data synchronization via the admin console and UI modal.

2. **In-Memory / File Storage Fallback**:
   - When no `DATABASE_URL` is configured, the platform runs offline with mock persistent caches and initial seed data.

---

## 📁 Repository Structure

```
├── .github/workflows/       # GitHub Actions CI/CD pipeline
│   └── ci-deploy.yml        # Build, typecheck, and deploy automation
├── api/                     # PHP REST endpoints (for Apache/PHP hosting)
├── data/                    # Seed JSON databases
├── public/                  # Static assets, PWA icons, manifest
├── src/                     # React 19 + TypeScript frontend application
│   ├── assets/              # Course thumbnails & studio images
│   ├── components/          # Reusable UI components & modals
│   │   ├── admin/           # Dean / Admin dashboard & user management
│   │   ├── auth/            # Login, registration & password matrix
│   │   ├── instructor/      # Course creation & assignment grading
│   │   ├── landing/         # Front page, course catalog & hero section
│   │   ├── pwa/             # Web App install button & modal
│   │   ├── student/         # Student enrolled courses & study view
│   │   └── RenderDbModal.tsx# Render PostgreSQL database management modal
│   ├── context/             # Global AppContext & PostgreSQL client state
│   ├── hooks/               # Custom hooks (PWA install, responsive)
│   ├── types/               # TypeScript interfaces & domain models
│   ├── App.tsx              # Application root
│   └── main.tsx             # React entry point
├── .env.example             # Environment variables documentation
├── .gitignore               # Cleaned ignore configuration for GitHub
├── Dockerfile               # Multi-stage container definition
├── index.html               # Web HTML entry point with metadata
├── package.json             # NPM package scripts & dependencies
├── render.yaml              # Render 1-Click Blueprint specification
├── server.ts                # Full-stack Express server with Vite middleware
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite + Tailwind + PWA build configuration
```

---

## 🔑 Demo User Credentials

For testing purposes, the application includes pre-configured seed users:

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin (Dean)** | Dr. Sarah Lin | `registrar@hyclass.oxford.ac.uk` | `AdminPass123!` |
| **Instructor** | Prof. Julian Sterling | `julian@hyclass.oxford.ac.uk` | `Instructor123!` |
| **Student** | James Kiprono | `james@student.oxford.ac.ke` | `Student123!` |

*(You can also register any new student or instructor directly through the UI).*

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
