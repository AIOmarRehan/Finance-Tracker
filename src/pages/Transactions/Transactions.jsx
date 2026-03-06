import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction, getCategories } from '../../utils/firestore';
import { formatCurrency, formatDate, exportToCSV, downloadFile } from '../../utils/helpers';
import TransactionForm from '../../components/Transactions/TransactionForm';
import TransactionTable from '../../components/Transactions/TransactionTable';
import TransactionFilters from '../../components/Transactions/TransactionFilters';

export default function Transactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

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

  function applyFilters() {
    let filtered = [...transactions];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(t => {
        const tDate = t.date.toDate ? t.date.toDate() : new Date(t.date);
        return tDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => {
        const tDate = t.date.toDate ? t.date.toDate() : new Date(t.date);
        return tDate <= toDate;
      });
    }

    setFilteredTransactions(filtered);
  }

  async function handleAddTransaction(transactionData) {
    try {
      await addTransaction(currentUser.uid, transactionData);
      await fetchData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  }

  async function handleUpdateTransaction(transactionId, updates) {
    try {
      await updateTransaction(transactionId, updates);
      await fetchData();
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  }

  async function handleDeleteTransaction(transactionId) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteTransaction(transactionId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  }

  function handleEdit(transaction) {
    setEditingTransaction(transaction);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingTransaction(null);
  }

  function handleExport() {
    const csv = exportToCSV(filteredTransactions);
    downloadFile(csv, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage your income and expenses</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="btn-secondary"
            disabled={filteredTransactions.length === 0}
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Add Transaction
          </button>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          categories={categories}
          onSubmit={editingTransaction ? 
            (data) => handleUpdateTransaction(editingTransaction.id, data) : 
            handleAddTransaction
          }
          onCancel={handleCloseForm}
        />
      )}

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
      />

      {/* Transactions Table */}
      <div className="card">
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
