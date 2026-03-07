# FinanceTracker

FinanceTracker is a modern web application designed to help users manage their personal finances effectively. With features like transaction tracking, goal setting, and detailed reports, FinanceTracker provides a comprehensive solution for financial management.

---

## Features

### Authentication
- **Email/Password Authentication**: Secure user registration and login.
- **Google OAuth Integration**: Sign in with Google accounts.
- **Forgot Password**: Password reset functionality with email verification.
- **Email Change**: Update email with verification and provider linking.

### Dashboard
- **Summary Cards**: Overview of income, expenses, and balance.
- **Recent Transactions**: Quick access to the latest transactions.
- **Quick Actions**: Add transactions, categories, or goals directly from the dashboard.

### Transactions
- **Add/Edit/Delete Transactions**: Manage income and expenses.
- **Categorization**: Assign categories to transactions for better organization.

### Goals
- **Set Financial Goals**: Define savings or spending targets.
- **Track Progress**: Monitor goal completion over time.

### Reports
- **Expense Breakdown**: Visualize spending by category.
- **Trends**: Analyze income and expense trends over time.
- **Export Data**: Download reports as CSV or PDF.

### Mobile-Friendly Design
- Fully responsive UI optimized for mobile, tablet, and desktop.

---

## Tech Stack

### Frontend
- **React**: Component-based UI development.
- **React Router**: Client-side routing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Chart.js**: Data visualization with charts.

### Backend
- **Firebase Authentication**: Secure user authentication.
- **Cloud Firestore**: Real-time NoSQL database for storing user data.
- **Firebase Analytics**: Track user interactions.

### Build Tools
- **Vite**: Fast build tool for modern web apps.
- **ESLint**: Code linting for consistent style.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/FinanceTracker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd FinanceTracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_firebase_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
     ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

---

## Project Structure

```
FinanceTracker/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Context providers for global state
│   ├── pages/            # Application pages (Dashboard, Reports, etc.)
│   ├── utils/            # Helper functions and Firestore utilities
│   ├── App.jsx           # Main application component
│   └── index.jsx         # Entry point
├── public/               # Static assets
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── package.json          # Project metadata and dependencies
```

---

## Tools Used

![](https://img.shields.io/badge/React-18.2.0-blue)
![](https://img.shields.io/badge/Firebase-10.7.1-orange)
![](https://img.shields.io/badge/TailwindCSS-3.4.0-teal)
![](https://img.shields.io/badge/Vite-5.0.8-yellow)
![](https://img.shields.io/badge/Chart.js-4.4.1-green)

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

---

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com).
