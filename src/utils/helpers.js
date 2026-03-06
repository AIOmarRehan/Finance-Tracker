// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
export function formatDate(date) {
  if (!date) return '';
  
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
}

// Calculate totals from transactions
export function calculateTotals(transactions) {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.income += transaction.amount;
    } else {
      acc.expenses += transaction.amount;
    }
    acc.balance = acc.income - acc.expenses;
    return acc;
  }, { income: 0, expenses: 0, balance: 0 });
}

// Group transactions by category
export function groupByCategory(transactions) {
  const grouped = {};
  
  transactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = {
        name: category,
        amount: 0,
        count: 0,
        type: transaction.type
      };
    }
    grouped[category].amount += transaction.amount;
    grouped[category].count += 1;
  });
  
  return Object.values(grouped);
}

// Filter transactions by date range
export function filterByDateRange(transactions, startDate, endDate) {
  return transactions.filter(transaction => {
    const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
    return date >= startDate && date <= endDate;
  });
}

// Get month transactions
export function getMonthTransactions(transactions) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return filterByDateRange(transactions, startOfMonth, endOfMonth);
}

// Generate default categories
export function getDefaultCategories() {
  return [
    // Income categories
    { name: 'Salary', type: 'income', color: '#10b981' },
    { name: 'Freelance', type: 'income', color: '#14b8a6' },
    { name: 'Investment', type: 'income', color: '#06b6d4' },
    { name: 'Other Income', type: 'income', color: '#3b82f6' },
    
    // Expense categories
    { name: 'Food & Dining', type: 'expense', color: '#f59e0b' },
    { name: 'Transportation', type: 'expense', color: '#ef4444' },
    { name: 'Shopping', type: 'expense', color: '#ec4899' },
    { name: 'Entertainment', type: 'expense', color: '#8b5cf6' },
    { name: 'Bills & Utilities', type: 'expense', color: '#6366f1' },
    { name: 'Healthcare', type: 'expense', color: '#84cc16' },
    { name: 'Education', type: 'expense', color: '#22c55e' },
    { name: 'Other Expense', type: 'expense', color: '#64748b' }
  ];
}

// Export to CSV
export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    formatDate(t.date),
    t.description,
    t.category,
    t.type,
    t.amount
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

// Download file
export function downloadFile(content, filename, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
