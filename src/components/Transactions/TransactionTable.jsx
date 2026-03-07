import { formatCurrency, formatDate } from '../../utils/helpers';

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  selectionMode = false,
  selectedIds = [],
  onToggleSelect
}) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-2 text-gray-500 dark:text-gray-400">No transactions found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters or add a new transaction</p>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden space-y-3 max-h-[60vh] overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{transaction.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(transaction.date)}</p>
              </div>
              {selectionMode && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(transaction.id)}
                  onChange={() => onToggleSelect?.(transaction.id)}
                  aria-label={`Select ${transaction.description}`}
                  className="h-4 w-4 mt-0.5 shrink-0"
                />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {transaction.category}
              </span>
              <span className={`px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full ${
                transaction.type === 'income'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                <img
                  src={transaction.type === 'income' ? '/icons/income.svg' : '/icons/expenses.svg'}
                  alt={transaction.type}
                  className="w-3 h-3"
                />
                <span>{transaction.type === 'income' ? 'Income' : 'Expense'}</span>
              </span>
            </div>

            {transaction.notes && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 break-words">{transaction.notes}</p>
            )}

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className={`text-sm font-semibold ${
                transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                  aria-label="Edit transaction"
                  disabled={selectionMode}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  aria-label="Delete transaction"
                  disabled={selectionMode}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto max-h-[60vh] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {selectionMode && (
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Select
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              {selectionMode && (
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(transaction.id)}
                    onChange={() => onToggleSelect?.(transaction.id)}
                    aria-label={`Select ${transaction.description}`}
                    className="h-4 w-4"
                  />
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  {transaction.notes && (
                    <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">{transaction.notes}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  <img 
                    src={transaction.type === 'income' ? '/icons/income.svg' : '/icons/expenses.svg'} 
                    alt={transaction.type} 
                    className="w-3 h-3" 
                  />
                  <span>{transaction.type === 'income' ? 'Income' : 'Expense'}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4"
                  aria-label="Edit transaction"
                  disabled={selectionMode}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  aria-label="Delete transaction"
                  disabled={selectionMode}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
