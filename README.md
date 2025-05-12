# EasyCal - Event Management Made Easy

EasyCal is a comprehensive event management application that allows users to create, manage, and share events. The application consists of a frontend UI built with HTML, CSS, and JavaScript, and a backend API built with Node.js, Express, and MongoDB.

## Features

- User authentication with multiple providers:
  - Traditional email/password
  - Google OAuth
  - Apple OAuth
  - Microsoft OAuth
- Event creation and management
- User dashboard with event history
- Generate embeddable "Add to Calendar" buttons or links
- Support for multiple calendar platforms (Google, Apple, Outlook, Yahoo, etc.)
- Smart description editor with formatting options
- Live preview of the event and generated code
- Button customization options
- Copy to clipboard functionality
- Responsive design for all devices

## Project Structure

- `easycal-ui-rebuild/` - Frontend application
  - `index.html` - Main HTML file
  - `style.css` - Custom CSS styles
  - `script.js` - JavaScript functionality
  - `src/input.css` - Tailwind CSS input file
  - `dist/output.css` - Compiled Tailwind CSS output
  - `tailwind.config.js` - Tailwind CSS configuration
- `easycal-backend/` - Backend API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (for backend functionality)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd easycal-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/easycal
   JWT_SECRET=your_jwt_secret_key
   SESSION_SECRET=your_session_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   APPLE_CLIENT_ID=your_apple_client_id
   APPLE_TEAM_ID=your_apple_team_id
   APPLE_KEY_ID=your_apple_key_id
   APPLE_PRIVATE_KEY_LOCATION=path/to/your/private/key.p8
   MICROSOFT_CLIENT_ID=your_microsoft_client_id
   MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd easycal-ui-rebuild
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Tailwind CSS build process:
   ```
   npm run dev
   ```

4. In a separate terminal, start the HTTP server:
   ```
   npx http-server -p 8080 -c-1 --cors -a localhost .
   ```

5. Open your browser and navigate to `http://localhost:8080`

## Deployment

The application is configured for deployment to Vercel. To deploy both the frontend and backend:

1. Make sure you have the Vercel CLI installed:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Configure your production environment variables in `easycal-backend/.env.production`

4. Run the deployment script:
   ```
   ./deploy.sh
   ```

The deployment script will:
- Build the frontend
- Deploy the frontend to Vercel
- Import environment variables from `.env.production` to Vercel
- Deploy the backend to Vercel

After deployment, your application will be available at the Vercel-provided URLs or your custom domain if configured.

## OAuth Configuration

To enable OAuth authentication, you need to configure the following:

### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the OAuth consent screen
6. Add the appropriate redirect URIs:
   - For local development: `http://localhost:5000/api/auth/google/callback`
   - For production: `https://easycal-backend.vercel.app/api/auth/google/callback`

### Apple OAuth

1. Go to the [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Register a new App ID with "Sign In with Apple" capability
4. Create a Services ID for your web application
5. Configure the domain and return URLs:
   - For local development: `http://localhost:5000/api/auth/apple/callback`
   - For production: `https://easycal-backend.vercel.app/api/auth/apple/callback`

### Microsoft OAuth

1. Go to the [Microsoft Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Register a new application
4. Configure the redirect URIs:
   - For local development: `http://localhost:5000/api/auth/microsoft/callback`
   - For production: `https://easycal-backend.vercel.app/api/auth/microsoft/callback`

## Technologies Used

- HTML5
- CSS3
- JavaScript (vanilla)
- Tailwind CSS
- Node.js
- Express
- MongoDB
- OAuth 2.0

## License

This project is licensed under the MIT License.

## Acknowledgments

- Nunito font from Google Fonts
- Icons from Heroicons
