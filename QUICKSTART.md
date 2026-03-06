# Personal Finance Tracker - Quick Start

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase

**Option A: Use Your Own Firebase Project (Recommended)**

1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password + Google)
3. Create Firestore Database
4. Copy configuration and create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Deploy security rules:
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules
```

**Option B: Testing Mode (Quick Demo)**
- Use Firebase Test Mode (NOT for production!)
- See `FIREBASE_SETUP.md` for details

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📦 Build for Production
```bash
npm run build
```

## 🚀 Deploy to Firebase
```bash
npm run build
firebase deploy
```

## 📁 Project Structure

```
FinanceTracker/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Common/          # Shared components (Loading, etc.)
│   │   ├── Dashboard/       # Dashboard specific components
│   │   ├── Transactions/    # Transaction management components
│   │   ├── Categories/      # Category management components
│   │   ├── Goals/           # Goals tracking components
│   │   ├── Reports/         # Charts and analytics components
│   │   └── Layout/          # Navigation and layout components
│   │
│   ├── pages/               # Main application pages
│   │   ├── Auth/            # Login & Signup pages
│   │   ├── Dashboard/       # Dashboard page
│   │   ├── Transactions/    # Transactions page
│   │   ├── Categories/      # Categories page
│   │   ├── Goals/           # Goals page
│   │   ├── Reports/         # Reports page
│   │   └── Profile/         # Profile settings page
│   │
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.jsx  # Authentication context
│   │
│   ├── config/              # Configuration files
│   │   └── firebase.js      # Firebase initialization
│   │
│   ├── utils/               # Utility functions
│   │   ├── firestore.js     # Firestore CRUD operations
│   │   └── helpers.js       # Helper functions (formatting, calculations)
│   │
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles (Tailwind imports)
│
├── public/                  # Static assets
├── dist/                    # Production build (generated)
│
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── firebase.json            # Firebase hosting configuration
│
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
│
├── README.md                # Project overview
├── USER_GUIDE.md            # Comprehensive user guide
├── FIREBASE_SETUP.md        # Firebase setup instructions
└── .env.example             # Environment variables template
```

## 🎨 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Backend**: Firebase
  - Authentication (Email/Password, Google)
  - Firestore Database
  - Hosting
- **Charts**: Chart.js + react-chartjs-2
- **PDF Export**: jsPDF + jspdf-autotable
- **Date Handling**: date-fns

## 🔑 Key Features

✅ User Authentication (Email & Google)
✅ Dashboard with Summary Cards
✅ Transaction Management (CRUD)
✅ Custom Categories
✅ Savings Goals Tracking
✅ Visual Reports & Charts
✅ CSV & PDF Export
✅ Advanced Filtering
✅ Responsive Design
✅ Accessibility Features
✅ Firebase Security Rules
✅ Performance Optimized

## 📊 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Firebase
firebase deploy      # Deploy to hosting
firebase serve       # Test locally
```

## 🔒 Security Features

- Firebase Authentication with JWT tokens
- Firestore security rules (user data isolation)
- Input validation on all forms
- HTTPS enforced (Firebase Hosting)
- Environment variables for sensitive data
- XSS protection built into React

## ⚡ Performance Optimizations

- Code splitting (separate vendor chunks)
- Lazy loading for routes
- Optimized Firebase queries
- Indexed Firestore queries
- Image optimization ready
- CDN delivery via Firebase Hosting
- Minimal CSS with Tailwind

## ♿ Accessibility Features

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- Semantic HTML
- Screen reader compatible
- High contrast support

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Collapsible sidebar on mobile

## 🐛 Common Issues

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase auth not working?**
- Check `.env` file exists with correct values
- Verify Firebase Authentication is enabled
- Check browser console for errors

**Database access denied?**
```bash
firebase deploy --only firestore:rules
```

## 📚 Documentation

- [README.md](README.md) - Project overview
- [USER_GUIDE.md](USER_GUIDE.md) - Detailed user instructions
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase configuration guide

## 🤝 Contributing

This is a personal project, but feel free to:
1. Fork the repository
2. Create your feature branch
3. Make improvements
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - Feel free to use this project for learning or personal use.

## 🎯 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Start development server
4. ✅ Create your account
5. ✅ Add some transactions
6. ✅ Set savings goals
7. ✅ Explore reports

## 💡 Tips

- Add transactions daily for accurate tracking
- Review reports weekly
- Set realistic savings goals
- Use categories consistently
- Export data regularly as backup

**Happy Tracking! 💰📊**

---

Need help? Check [USER_GUIDE.md](USER_GUIDE.md) or [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
