import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactions, getCategories } from '../../utils/firestore';
import { groupByCategory, calculateTotals, getMonthTransactions, filterByDateRange, exportToCSV, downloadFile, formatCurrency } from '../../utils/helpers';
import ExpenseChart from '../../components/Reports/ExpenseChart';
import TrendChart from '../../components/Reports/TrendChart';
import CategoryBreakdown from '../../components/Reports/CategoryBreakdown';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Reports() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  async function fetchData() {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions(currentUser.uid),
        getCategories(currentUser.uid)
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter transactions based on date range
  function getFilteredTransactions() {
    const now = new Date();
    let filtered = transactions;

    if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filterByDateRange(transactions, weekAgo, now);
    } else if (dateRange === 'month') {
      filtered = getMonthTransactions(transactions);
    } else if (dateRange === 'year') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      filtered = filterByDateRange(transactions, yearStart, now);
    } else if (dateRange === 'custom' && customRange.start && customRange.end) {
      filtered = filterByDateRange(
        transactions,
        new Date(customRange.start),
        new Date(customRange.end)
      );
    }

    return filtered;
  }

  const filteredTransactions = getFilteredTransactions();
  const totals = calculateTotals(filteredTransactions);
  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
  const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
  const expenseByCategory = groupByCategory(expenseTransactions);
  const incomeByCategory = groupByCategory(incomeTransactions);

  function handleExportCSV() {
    const csv = exportToCSV(filteredTransactions);
    downloadFile(csv, `report_${new Date().toISOString().split('T')[0]}.csv`);
  }

  function handleExportPDF() {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Finance Report', 14, 22);
    
    // Summary
    doc.setFontSize(12);
    doc.text(`Period: ${dateRange}`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 40);
    
    doc.text(`Total Income: ${formatCurrency(totals.income)}`, 14, 50);
    doc.text(`Total Expenses: ${formatCurrency(totals.expenses)}`, 14, 58);
    doc.text(`Net Balance: ${formatCurrency(totals.balance)}`, 14, 66);
    
    // Transactions table
    const tableData = filteredTransactions.map(t => [
      t.date.toDate ? t.date.toDate().toLocaleDateString() : new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      formatCurrency(t.amount)
    ]);
    
    doc.autoTable({
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: tableData,
      startY: 75
    });
    
    doc.save(`report_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Visualize your financial data</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExportCSV} className="btn-secondary">
            Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn-secondary">
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <div className="flex space-x-2">
              {['week', 'month', 'year', 'custom'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-end space-x-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Total Income</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totals.income)}</p>
        </div>
        <div className="card border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(totals.expenses)}</p>
        </div>
        <div className="card border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">Net Balance</p>
          <p className={`text-2xl font-bold mt-2 ${totals.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(totals.balance)}
          </p>
        </div>
      </div>

      {/* Charts */}
      {filteredTransactions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseChart data={expenseByCategory} />
            <TrendChart transactions={filteredTransactions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdown title="Expense Breakdown" data={expenseByCategory} type="expense" />
            <CategoryBreakdown title="Income Breakdown" data={incomeByCategory} type="income" />
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2 text-gray-500">No data for selected period</p>
          <p className="text-sm text-gray-400">Add transactions to see reports</p>
        </div>
      )}
    </div>
  );
}
