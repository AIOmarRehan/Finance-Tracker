import { formatCurrency } from '../../utils/helpers';

export default function CategoryBreakdown({ title, data, type }) {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);
  const total = sortedData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {sortedData.length > 0 ? (
        <div className="space-y-3">
          {sortedData.map((item, index) => {
            const percentage = total > 0 ? (item.amount / total) * 100 : 0;
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className={`font-semibold ${
                    type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.count} transaction{item.count !== 1 ? 's' : ''}</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t mt-4">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className={type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No {type} data available</p>
      )}
    </div>
  );
}
