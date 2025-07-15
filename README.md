# Sarkari Net Admin Panel

A React-based admin panel for managing Sarkari Net content with real API integration.

## Features

- 🔐 **Real API Authentication**: Integrated with backend authentication system
- 📱 **Responsive Design**: Built with Tailwind CSS for mobile-first design
- 🎨 **Modern UI**: Clean and intuitive admin interface
- 🔒 **Protected Routes**: Secure admin-only access
- 📊 **Dashboard**: Comprehensive admin dashboard
- 👥 **Employee Management**: Manage admin users
- 📰 **Content Management**: Manage jobs, results, admit cards, and more

## API Integration

The application is integrated with a real backend API running on `http://localhost:3110`.

### Authentication

- **Login Endpoint**: `POST /admin/login`
- **Credentials**: 
  - Email: `admin@example.com`
  - Password: `admin123`

### API Response Format

```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "68750a58cd80edc2a4fc804f",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend API running on `http://localhost:3110`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Login

Use the following credentials to access the admin panel:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## Project Structure

```
src/
├── api.ts              # API service and configuration
├── components/         # Reusable UI components
│   ├── AdminLayout.tsx # Main admin layout
│   └── LoginPage.tsx   # Login form
├── pages/             # Page components
│   ├── Dashboard.tsx   # Admin dashboard
│   ├── Employees.tsx   # Employee management
│   └── ...            # Other admin pages
└── App.tsx            # Main application component
```

## API Service

The `src/api.ts` file contains:

- **Base URL Configuration**: `API_BASE_URL = 'http://localhost:3110'`
- **Authentication Methods**: Login, logout, token management
- **Employee Management**: Create and fetch employees
- **Type Definitions**: TypeScript interfaces for API requests/responses
- **Error Handling**: Comprehensive error handling for API calls

### Key Features

- **Token Management**: Automatic token storage and retrieval
- **Authentication State**: Persistent login state across sessions
- **Protected Requests**: Automatic authorization headers for authenticated requests
- **Error Handling**: User-friendly error messages
- **Employee CRUD**: Create and manage employee accounts

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Lucide React** - Icons

## Development

The application uses modern React patterns:

- **Functional Components** with hooks
- **TypeScript** for type safety
- **ES Modules** for clean imports
- **Tailwind CSS** for styling
- **React Router** for navigation

## Security

- **JWT Token Storage**: Secure token management in localStorage
- **Protected Routes**: Automatic redirection for unauthenticated users
- **API Error Handling**: Comprehensive error handling for failed requests
- **Logout Functionality**: Proper token cleanup on logout 