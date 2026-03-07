import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction, getCategories } from '../../utils/firestore';
import { formatCurrency, formatDate, exportToCSV, downloadFile } from '../../utils/helpers';
import TransactionForm from '../../components/Transactions/TransactionForm';
import TransactionTable from '../../components/Transactions/TransactionTable';
import TransactionFilters from '../../components/Transactions/TransactionFilters';
import './Transactions.css'; // Import CSS for modal styling

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
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState([]);

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
    try {
      await deleteTransaction(transactionId);
      await fetchData();
      setItemToDelete(null); // Reset the confirmation state
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  }

  async function handleDeleteSelectedTransactions(transactionIds) {
    if (!transactionIds.length) return;

    try {
      await Promise.all(transactionIds.map((transactionId) => deleteTransaction(transactionId)));
      await fetchData();
      setSelectedTransactionIds([]);
      setSelectionMode(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting selected transactions:', error);
      alert('Failed to delete selected transactions');
    }
  }

  function confirmDeleteTransaction(transactionId) {
    setItemToDelete({ mode: 'single', id: transactionId, sectionName: 'Transaction' });
  }

  function confirmDeleteSelectedTransactions() {
    if (!selectedTransactionIds.length) return;
    setItemToDelete({ mode: 'bulk', ids: selectedTransactionIds, sectionName: 'Selected Transactions' });
  }

  function cancelDelete() {
    setItemToDelete(null);
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

  function handleToggleSelectionMode() {
    setSelectionMode((prev) => !prev);
    setSelectedTransactionIds([]);
  }

  function handleSelectAllTransactions() {
    setSelectedTransactionIds(filteredTransactions.map((transaction) => transaction.id));
  }

  function handleToggleTransactionSelection(transactionId) {
    setSelectedTransactionIds((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your income and expenses</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleToggleSelectionMode} className="btn-secondary text-sm">
            {selectionMode ? 'Cancel Select' : 'Select'}
          </button>
          {selectionMode && (
            <>
              <button onClick={handleSelectAllTransactions} className="btn-secondary text-sm">
                Select All
              </button>
              <button
                onClick={confirmDeleteSelectedTransactions}
                className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
                disabled={selectedTransactionIds.length === 0}
              >
                Delete Selected
              </button>
            </>
          )}
          <button
            onClick={handleExport}
            className="btn-secondary text-sm"
            disabled={filteredTransactions.length === 0}
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Transaction</span>
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
          onDelete={confirmDeleteTransaction}
          selectionMode={selectionMode}
          selectedIds={selectedTransactionIds}
          onToggleSelect={handleToggleTransactionSelection}
        />
      </div>

      {itemToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="text-gray-900 dark:text-white mb-4">Are you sure you want to delete {itemToDelete.sectionName}?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() =>
                  itemToDelete.mode === 'bulk'
                    ? handleDeleteSelectedTransactions(itemToDelete.ids)
                    : handleDeleteTransaction(itemToDelete.id)
                }
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
