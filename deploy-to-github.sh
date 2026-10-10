#!/usr/bin/env bash
# ==============================================================================
# CourseraX / HYCLASS Academy - Push & Deploy to GitHub (Hosted on GitHub Pages)
# ==============================================================================
set -e

REPO_URL="$1"

echo "========================================================"
echo "🚀 Deploy CourseraX to GitHub & Host on GitHub Pages"
echo "========================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing local git repository..."
  git init
  git branch -m main
fi

# Ensure all files are staged and committed
git add .
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "💾 Committing local changes..."
  git commit -m "feat: deploy to GitHub Pages with automated CI/CD"
fi

# Handle remote repository URL
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || true)

if [ -n "$REPO_URL" ]; then
  if [ -n "$CURRENT_REMOTE" ]; then
    echo "🔄 Updating git remote origin to: $REPO_URL"
    git remote set-url origin "$REPO_URL"
  else
    echo "🔗 Adding git remote origin: $REPO_URL"
    git remote add origin "$REPO_URL"
  fi
elif [ -z "$CURRENT_REMOTE" ]; then
  echo ""
  echo "⚠️  No GitHub remote URL provided!"
  echo "Usage: ./deploy-to-github.sh https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git"
  echo ""
  echo "Or manually run:"
  echo "  git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git"
  echo "  git push -u origin main"
  echo ""
  exit 1
fi

echo "📤 Pushing code to GitHub (branch: main)..."
git push -u origin main

echo ""
echo "========================================================"
echo "🎉 Code successfully pushed to GitHub!"
echo "========================================================"
echo ""
echo "👉 To activate GitHub as your live web host (GitHub Pages):"
echo "1. Go to your repository on GitHub."
echo "2. Click 'Settings' (gear icon) -> 'Pages' (left sidebar)."
echo "3. Under 'Build and deployment' -> 'Source', select:"
echo "      'GitHub Actions'"
echo "4. GitHub will automatically trigger the 'Deploy to GitHub Pages' workflow!"
echo "5. Your website will be live in ~60 seconds at:"
echo "      https://<your-username>.github.io/<your-repo-name>/"
echo ""
