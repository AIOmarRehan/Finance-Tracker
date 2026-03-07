import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ data }) {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [{
      data: data.map(item => item.amount),
      backgroundColor: [
        '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
        '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
      ],
      borderWidth: 2,
      borderColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          },
          color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Expense Distribution</h2>
      {data.length > 0 ? (
        <div className="w-full h-80 flex items-center justify-center">
          <Pie data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No expense data available</p>
      )}
    </div>
  );
}
