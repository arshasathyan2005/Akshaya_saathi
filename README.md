# Akshaya Services Guide

A comprehensive web application that helps users understand the procedures and required documents for government and online services offered at Akshaya centers and similar service centers.

## Features

### Public User Features
- Browse all available services without login
- Search services by name or description
- Filter services by category:
  - Certificates (Birth, Death, Income, Caste, etc.)
  - ID Services (Aadhaar, PAN, Voter ID, Driving License)
  - Education Services
  - Pension & Welfare Schemes
  - Utility Services
- View detailed information for each service:
  - Service description
  - Required documents checklist
  - Step-by-step procedure
  - Fees information
  - Processing time
  - Important notes and tips
- Mobile-responsive design
- Clean, easy-to-read interface

### Admin Features
- Secure admin login with Supabase Authentication
- Admin dashboard to manage all services
- Add new services with comprehensive details
- Edit existing services
- Delete services
- View all services in a table format

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Copy your Firebase config from Project Settings

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Firebase credentials to `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Database Structure

The application uses Firestore with a `services` collection:

```typescript
services {
  id: string (auto-generated)
  service_name: string
  category: string
  description: string
  documents_required: string[]
  procedure_steps: string[]
  fees: string
  processing_time: string
  notes: string
  created_at: Timestamp
  updated_at: Timestamp
}
```

## Admin Access

To access the admin dashboard:

1. Click the "Admin" button in the top-right corner
2. Sign in with admin credentials

### Creating an Admin User

**Using Firebase Console:**
1. Go to your Firebase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter email and password
5. The user will be created and can immediately log in

Once created, use those credentials to log in to the admin panel.

## Sample Data

The application comes pre-loaded with sample services including:
- Birth Certificate
- Aadhaar Card Enrollment
- Income Certificate
- PAN Card Application
- Voter ID Card (EPIC)
- Caste Certificate
- Ration Card
- Driving License

## Project Structure

```
src/
├── components/
│   ├── AdminDashboard.tsx    # Admin panel with service management
│   ├── AdminLogin.tsx         # Admin login page
│   ├── CategoryFilter.tsx     # Category filter component
│   ├── HomePage.tsx           # Main public homepage
│   ├── ServiceCard.tsx        # Service card component
│   ├── ServiceDetails.tsx     # Detailed service view
│   └── ServiceForm.tsx        # Form for adding/editing services
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── lib/
│   ├── database.types.ts      # TypeScript types for database
│   └── supabase.ts           # Supabase client configuration
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles with Tailwind
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Security Features

- Firestore Security Rules control data access
- Public users can read services (configure in Firebase Console)
- Only authenticated users can create, update, or delete services
- Secure authentication using Firebase Auth

### Firestore Security Rules

Add these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /services/{serviceId} {
      // Anyone can read services
      allow read: if true;
      
      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service of choice:
   - Vercel
   - Netlify
   - Firebase Hosting
   - Any static hosting service

3. Ensure environment variables are set in your hosting platform

## Future Enhancements

- Multi-language support (English + Malayalam)
- Download service checklist as PDF
- Print-friendly service details
- Bookmark favorite services
- Service comparison feature
- Feedback and ratings for services
- Search history
- Recently viewed services

## Contributing

This is a template project. Feel free to customize and extend it according to your needs.

## Important Note

The information provided in this application is for guidance purposes only. Users are advised to confirm the latest requirements, procedures, and fees with their local Akshaya center or relevant government office before proceeding with any service application.

## License

MIT License - Feel free to use this project for any purpose.
