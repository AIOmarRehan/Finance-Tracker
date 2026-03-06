<<<<<<< HEAD
# Personal Finance Tracker

A modern web application to track your finances, manage transactions, set savings goals, and view visual reports.

## Features

- 🔐 **Authentication** - Secure login with Firebase (Email/Password & Google OAuth)
- 📊 **Dashboard** - Overview of balance, income, expenses, and savings
- 💰 **Transactions** - Add, edit, delete, and filter transactions
- 🏷️ **Categories** - Manage custom income and expense categories
- 🎯 **Goals** - Set and track savings goals with progress visualization
- 📈 **Reports** - Visual charts and insights with export options (CSV/PDF)
- ⚡ **Performance** - Optimized for speed with code splitting and lazy loading
- ♿ **Accessibility** - ARIA labels, keyboard navigation, and high contrast

## Tech Stack

- **Frontend:** React.js + Vite
- **Styling:** TailwindCSS
- **Backend:** Firebase (Firestore + Authentication)
- **Charts:** Chart.js + react-chartjs-2
- **Routing:** React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Deploy the security rules from `firestore.rules`

## Building for Production

```bash
npm run build
```

## Deployment

Deploy to Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## Security

- Firebase Authentication with secure JWT tokens
- Firestore security rules ensuring users can only access their own data
- Input validation on all forms
- HTTPS enabled by default with Firebase Hosting

## Performance

- Code splitting and lazy loading
- Optimized Firebase queries
- Image optimization (WebP format)
- CDN delivery via Firebase Hosting
- Target: <2s dashboard load time

## License

MIT
=======
# Finance-Tracker
>>>>>>> 70b78d5193a65fc12d3843919d0e6d73e34bd2c2
