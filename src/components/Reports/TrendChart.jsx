import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TrendChart({ transactions }) {
  // Group transactions by date
  const transactionsByDate = {};
  
  transactions.forEach(t => {
    const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!transactionsByDate[dateKey]) {
      transactionsByDate[dateKey] = { income: 0, expenses: 0 };
    }
    
    if (t.type === 'income') {
      transactionsByDate[dateKey].income += t.amount;
    } else {
      transactionsByDate[dateKey].expenses += t.amount;
    }
  });

  // Sort dates and prepare data
  const dates = Object.keys(transactionsByDate).sort();
  const incomeData = dates.map(date => transactionsByDate[date].income);
  const expenseData = dates.map(date => transactionsByDate[date].expenses);

  const chartData = {
    labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Income vs Expenses Trend</h2>
      {dates.length > 0 ? (
        <div className="w-full h-80">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No trend data available</p>
      )}
    </div>
  );
}
