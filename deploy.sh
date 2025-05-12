#!/bin/bash

# EasyCal Deployment Script
# This script deploys both the frontend and backend to Vercel

echo "🚀 Starting EasyCal deployment..."

# Build the frontend
echo "📦 Building frontend..."
cd easycal-ui-rebuild
npm run build
echo "✅ Frontend build complete"

# Deploy frontend to Vercel
echo "🌐 Deploying frontend to Vercel..."
vercel --prod
echo "✅ Frontend deployment complete"

# Deploy backend to Vercel
echo "🌐 Deploying backend to Vercel..."
cd ../easycal-backend

# Create a temporary .vercel directory with project.json if it doesn't exist
mkdir -p .vercel
if [ ! -f .vercel/project.json ]; then
  echo '{"projectId":"","orgId":""}' > .vercel/project.json
fi

# Import environment variables from .env.production
echo "📝 Importing environment variables from .env.production..."
while IFS='=' read -r key value || [[ -n "$key" ]]; do
  # Skip comments and empty lines
  [[ $key == \#* ]] && continue
  [[ -z "$key" ]] && continue
  
  # Remove leading/trailing whitespace
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  
  # Add environment variable to Vercel
  echo "Adding $key to Vercel environment variables..."
  vercel env add "$key" production <<< "$value"
done < .env.production

# Deploy to Vercel
vercel --prod
echo "✅ Backend deployment complete"

echo "🎉 Deployment complete! Your EasyCal application is now live."
