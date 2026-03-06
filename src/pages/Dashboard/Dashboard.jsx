import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactions, getGoals } from '../../utils/firestore';
import { calculateTotals, formatCurrency, getMonthTransactions } from '../../utils/helpers';
import SummaryCard from '../../components/Dashboard/SummaryCard';
import QuickActions from '../../components/Dashboard/QuickActions';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ income: 0, expenses: 0, balance: 0 });

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const [transactionsData, goalsData] = await Promise.all([
          getTransactions(currentUser.uid),
          getGoals(currentUser.uid)
        ]);
        
        setTransactions(transactionsData);
        setGoals(goalsData);
        
        // Calculate monthly totals
        const monthTransactions = getMonthTransactions(transactionsData);
        const monthTotals = calculateTotals(monthTransactions);
        setTotals(monthTotals);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUser]);

  // Calculate savings progress
  const totalSavingsGoal = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
  const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
  const savingsProgress = totalSavingsGoal > 0 ? (totalSaved / totalSavingsGoal) * 100 : 0;

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.displayName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your financial overview for this month</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(totals.balance)}
          icon={<img src="/icons/total-balance.svg" alt="Total Balance" className="h-8 w-8" />}
          color="blue"
          trend={totals.balance >= 0 ? 'up' : 'down'}
        />
        <SummaryCard
          title="Income"
          value={formatCurrency(totals.income)}
          icon={<img src="/icons/income.svg" alt="Income" className="h-8 w-8" />}
          color="green"
          trend="up"
        />
        <SummaryCard
          title="Expenses"
          value={formatCurrency(totals.expenses)}
          icon={<img src="/icons/expenses.svg" alt="Expenses" className="h-8 w-8" />}
          color="red"
          trend="down"
        />
        <SummaryCard
          title="Savings Progress"
          value={`${savingsProgress.toFixed(1)}%`}
          icon={<img src="/icons/savings-progress.svg" alt="Savings Progress" className="h-8 w-8" />}
          color="purple"
          subtitle={`${formatCurrency(totalSaved)} of ${formatCurrency(totalSavingsGoal)}`}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions.slice(0, 5)} />
    </div>
  );
}
