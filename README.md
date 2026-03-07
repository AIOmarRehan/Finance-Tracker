# SpendMetra

SpendMetra is a web application for personal finance management. It helps users track income and expenses, manage categories, set goals, and view analytics through reports.

## Features

- Secure authentication with email and Google sign-in
- Transaction tracking with filtering and export
- Category management for income and expenses
- Financial goals tracking
- Reports and analytics with charts
- Responsive interface for desktop and mobile
- Light and dark theme support

## Technology Stack

- React
- Vite
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Chart.js

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A Firebase project

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_RECAPTCHA_SITE_KEY=
```

## Running the Project

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Firebase Configuration

1. Enable Email/Password and Google providers in Firebase Authentication.
2. Add deployment domains to Authorized domains in Firebase Authentication settings.
3. Create Firestore database and apply project security rules.

## Deployment Notes

For Vercel deployment, make sure environment variables are configured in the Vercel project settings.

This project includes a `vercel.json` file to:

- Support SPA routing rewrites to `index.html`
- Set cross-origin headers compatible with Firebase popup authentication

## Project Structure

```text
src/
  components/
  contexts/
  pages/
  config/
  utils/
public/
```

## License

This project is licensed under the terms described in the `LICENSE` file.
