import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../../utils/firestore';
import GoalForm from '../../components/Goals/GoalForm';
import GoalCard from '../../components/Goals/GoalCard';

export default function Goals() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, [currentUser]);

  async function fetchGoals() {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const data = await getGoals(currentUser.uid);
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGoal(goalData) {
    try {
      await addGoal(currentUser.uid, goalData);
      await fetchGoals();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Failed to add goal');
    }
  }

  async function handleUpdateGoal(goalId, updates) {
    try {
      await updateGoal(goalId, updates);
      await fetchGoals();
      setEditingGoal(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('Failed to update goal');
    }
  }

  async function handleDeleteGoal(goalId) {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await deleteGoal(goalId);
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal');
    }
  }

  function handleEdit(goal) {
    setEditingGoal(goal);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingGoal(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600 mt-1">Track your financial goals</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add Goal
        </button>
      </div>

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onSubmit={editingGoal ? 
            (data) => handleUpdateGoal(editingGoal.id, data) : 
            handleAddGoal
          }
          onCancel={handleCloseForm}
        />
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="mt-2 text-gray-500">No goals yet</p>
          <p className="text-sm text-gray-400">Set your first savings goal to start tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDeleteGoal}
              onUpdate={handleUpdateGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
