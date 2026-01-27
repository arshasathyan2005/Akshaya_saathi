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
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env` file

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Database Structure

The application uses a single `services` table in Supabase:

```sql
services {
  id: uuid (primary key)
  service_name: text
  category: text
  description: text
  documents_required: text[]
  procedure_steps: text[]
  fees: text
  processing_time: text
  notes: text
  created_at: timestamptz
  updated_at: timestamptz
}
```

## Admin Access

To access the admin dashboard:

1. Click the "Admin" button in the top-right corner
2. Sign in with admin credentials

### Creating an Admin User

Since this uses Supabase, you need to create an admin user:

**Option 1: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter email and password
5. Confirm the user

**Option 2: Using Supabase SQL Editor**
```sql
-- This creates a user via SQL
-- Note: You should use the Supabase Dashboard for proper user creation
```

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

- Row Level Security (RLS) enabled on all tables
- Public users can only read services
- Only authenticated admin users can create, update, or delete services
- Secure authentication using Supabase Auth

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
