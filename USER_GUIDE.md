# Personal Finance Tracker - User Guide

## Getting Started

### Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration values
   - See `FIREBASE_SETUP.md` for detailed instructions

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

## Features Overview

### 1. Authentication

**Sign Up**
- Navigate to the signup page
- Enter your name, email, and password
- Or use "Sign up with Google" for quick registration

**Login**
- Use email/password or Google sign-in
- Stay logged in across sessions

**Security**
- Passwords are securely encrypted
- Session tokens expire automatically
- All data is user-specific and private

### 2. Dashboard

The dashboard provides an at-a-glance view of your finances:

- **Total Balance**: Current balance (Income - Expenses)
- **Income**: Total income for the current month
- **Expenses**: Total expenses for the current month
- **Savings Progress**: Percentage of savings goals achieved

**Quick Actions**
- Add Transaction
- Set Goal
- View Reports
- Manage Categories

**Recent Transactions**
- Shows last 5 transactions
- Click "View All" to see complete list

### 3. Transactions

**Adding a Transaction**
1. Click "Add Transaction" button
2. Select type: Income or Expense
3. Enter description (e.g., "Grocery shopping")
4. Enter amount
5. Select category
6. Choose date
7. Add optional notes
8. Click "Add Transaction"

**Editing a Transaction**
1. Find the transaction in the list
2. Click "Edit"
3. Modify any fields
4. Click "Update Transaction"

**Deleting a Transaction**
1. Click "Delete" next to the transaction
2. Confirm deletion

**Filtering Transactions**
- Search by description
- Filter by type (Income/Expense)
- Filter by category
- Filter by date range

**Exporting**
- Click "Export CSV" to download transactions as spreadsheet

### 4. Categories

**Default Categories**
- Click "Setup Defaults" to add preset categories
- Income categories: Salary, Freelance, Investment
- Expense categories: Food, Transportation, Shopping, etc.

**Adding Custom Category**
1. Click "Add Category"
2. Enter category name
3. Select type (Income/Expense)
4. Choose a color
5. Preview your category
6. Click "Add Category"

**Managing Categories**
- Edit category details
- Delete unused categories
- Categories are color-coded in charts

⚠️ **Note**: Deleting a category won't delete associated transactions, but they'll show as "Uncategorized"

### 5. Goals & Savings

**Creating a Goal**
1. Click "Add Goal"
2. Enter goal name (e.g., "Emergency Fund")
3. Set target amount
4. Enter current amount (if any)
5. Set target date (optional)
6. Add description
7. Click "Add Goal"

**Tracking Progress**
- Each goal card shows progress bar
- See remaining amount and days left
- Goals completed show celebration message

**Adding Progress**
1. Click "Add Progress" on goal card
2. Enter amount to add
3. Click "Add"

**Managing Goals**
- Edit goal details anytime
- Delete achieved or cancelled goals

### 6. Reports & Analytics

**Date Range Selection**
- Week: Last 7 days
- Month: Current month
- Year: Current year
- Custom: Choose specific date range

**Available Charts**

1. **Expense Distribution (Pie Chart)**
   - Visual breakdown of spending by category
   - Shows percentages and amounts
   - Interactive hover tooltips

2. **Income vs Expenses Trend (Line Chart)**
   - Daily comparison of income and expenses
   - Identify spending patterns over time

3. **Expense Breakdown**
   - Detailed list with progress bars
   - Shows transaction count per category
   - Sorted by highest spending

4. **Income Breakdown**
   - Similar to expense breakdown for income
   - Track income sources

**Exporting Reports**
- **CSV Export**: Spreadsheet format for further analysis
- **PDF Export**: Printable report with summary and transactions

### 7. Profile Settings

**Profile Tab**
- Update your display name
- View current email

**Email Tab**
- Change your email address
- May require re-authentication

**Password Tab**
- Update your password
- Requires confirmation
- Minimum 6 characters

⚠️ **Important**: You may need to log in again after changing email or password

## Tips & Best Practices

### For Accurate Tracking
1. **Record transactions immediately** - Don't wait until end of day
2. **Use consistent categories** - Makes reports more meaningful
3. **Add notes for large expenses** - Remember why you spent
4. **Review monthly** - Check reports at end of each month

### For Better Budgeting
1. **Set realistic goals** - Start small and increase gradually
2. **Review spending patterns** - Use reports to identify over-spending
3. **Create category budgets** - Track spending in each category
4. **Regular updates** - Keep goals progress current

### For Data Security
1. **Use strong passwords** - Mix letters, numbers, symbols
2. **Enable 2FA** (if available in Firebase Console)
3. **Log out on shared devices** - Keep your data private
4. **Regular backups** - Export CSV periodically

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick search (future feature)
- `Esc` - Close modals/forms
- `Tab` - Navigate between form fields
- `Enter` - Submit forms

## Troubleshooting

### Cannot Login
- Check email and password spelling
- Ensure caps lock is off
- Try "Forgot Password" if available
- Check internet connection

### Transactions Not Appearing
- Refresh the page
- Check filter settings
- Verify transaction was saved
- Check browser console for errors

### Charts Not Loading
- Ensure you have transactions for selected period
- Try different date range
- Refresh the page
- Check internet connection

### Performance Issues
- Clear browser cache
- Reduce number of transactions shown
- Use date filters to limit data
- Close other browser tabs

## Data Privacy

- All data is stored securely in Firebase
- Only you can access your data
- No data is shared with third parties
- Data is encrypted in transit and at rest

## Mobile Usage

The app is fully responsive:
- Touch-friendly buttons
- Optimized layouts for small screens
- Swipe gestures (where applicable)
- Works offline (with limitations)

## Accessibility

- Screen reader compatible
- Keyboard navigation support
- High contrast mode support
- ARIA labels on all interactive elements
- Focus indicators visible

## Support

For issues or questions:
1. Check this guide first
2. Review Firebase setup guide
3. Check browser console for errors
4. Refer to Firebase documentation

## Future Enhancements

Planned features:
- Budget planning
- Recurring transactions
- Multiple accounts
- Bill reminders
- Mobile app
- Dark mode
- Multi-currency support

---

**Version**: 1.0.0
**Last Updated**: March 2026

Enjoy tracking your finances! 💰📊
