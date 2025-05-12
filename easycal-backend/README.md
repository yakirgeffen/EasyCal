# EasyCal Backend

Backend API for the EasyCal application, providing user authentication and event management functionality.

## Features

- User authentication (register, login)
- Google OAuth authentication
- Event creation and management
- JWT-based authentication
- MongoDB database integration
- In-memory fallback when MongoDB is unavailable

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/easycal
   JWT_SECRET=your_jwt_secret_key_change_in_production
   SESSION_SECRET=your_session_secret_key_change_in_production
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. Make sure MongoDB is running on your system (optional, as the system will fall back to in-memory storage if MongoDB is unavailable)

## OAuth Setup

### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add "http://localhost:5000/api/auth/google/callback" as an authorized redirect URI
7. Copy the Client ID and Client Secret to your `.env` file

### Apple OAuth

1. Go to the [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Register a new App ID with "Sign In with Apple" capability
4. Create a Services ID for your web application
5. Configure the domain and return URL (http://localhost:5000/api/auth/apple/callback)
6. Create a private key for Sign In with Apple
7. Update your `.env` file with the required credentials

### Microsoft OAuth

1. Go to the [Microsoft Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Register a new application
4. Configure the redirect URI (http://localhost:5000/api/auth/microsoft/callback)
5. Under "Certificates & secrets", create a new client secret
6. Copy the Application (client) ID and client secret to your `.env` file

## Running the Server

### Development mode
```
npm run dev
```

### Production mode
```
npm start
```

## API Endpoints

### Authentication

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/auth/google` - Initiate Google OAuth authentication
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user (protected)

### Events

- `GET /api/events` - Get all events for the logged-in user (protected)
- `POST /api/events` - Create a new event (protected)
- `GET /api/events/:id` - Get a specific event (protected)
- `PUT /api/events/:id` - Update an event (protected)
- `DELETE /api/events/:id` - Delete an event (protected)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained upon successful login, registration, or Google OAuth authentication.
