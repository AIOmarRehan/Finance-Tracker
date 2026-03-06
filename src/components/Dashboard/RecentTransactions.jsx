import { formatCurrency, formatDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function RecentTransactions({ transactions }) {
  const navigate = useNavigate();

  if (transactions.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2 text-gray-500">No transactions yet</p>
          <button
            onClick={() => navigate('/app/transactions')}
            className="mt-4 btn-primary"
          >
            Add Your First Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        <button
          onClick={() => navigate('/transactions')}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All →
        </button>
      </div>
      
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-lg" aria-hidden="true">
                  {transaction.type === 'income' ? '📈' : '📉'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {transaction.category} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            
            <span className={`font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
