import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../../utils/firestore';
import GoalForm from '../../components/Goals/GoalForm';
import GoalCard from '../../components/Goals/GoalCard';
import './Goals.css'; // Import CSS for modal styling

export default function Goals() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedGoalIds, setSelectedGoalIds] = useState([]);

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
    try {
      await deleteGoal(goalId);
      await fetchGoals();
      setItemToDelete(null); // Reset the confirmation state
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal');
    }
  }

  async function handleDeleteSelectedGoals(goalIds) {
    if (!goalIds.length) return;

    try {
      await Promise.all(goalIds.map((goalId) => deleteGoal(goalId)));
      await fetchGoals();
      setSelectedGoalIds([]);
      setSelectionMode(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting selected goals:', error);
      alert('Failed to delete selected goals');
    }
  }

  function confirmDeleteGoal(goalId) {
    setItemToDelete({ mode: 'single', id: goalId, sectionName: 'Goal' });
  }

  function confirmDeleteSelectedGoals() {
    if (!selectedGoalIds.length) return;
    setItemToDelete({ mode: 'bulk', ids: selectedGoalIds, sectionName: 'Selected Goals' });
  }

  function cancelDelete() {
    setItemToDelete(null);
  }

  function handleEdit(goal) {
    setEditingGoal(goal);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingGoal(null);
  }

  function handleToggleSelectionMode() {
    setSelectionMode((prev) => !prev);
    setSelectedGoalIds([]);
  }

  function handleSelectAllGoals() {
    setSelectedGoalIds(goals.map((goal) => goal.id));
  }

  function handleToggleGoalSelection(goalId) {
    setSelectedGoalIds((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your financial goals</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleToggleSelectionMode} className="btn-secondary">
            {selectionMode ? 'Cancel Select' : 'Select'}
          </button>
          {selectionMode && (
            <>
              <button onClick={handleSelectAllGoals} className="btn-secondary">
                Select All
              </button>
              <button
                onClick={confirmDeleteSelectedGoals}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={selectedGoalIds.length === 0}
              >
                Delete Selected
              </button>
            </>
          )}
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Goal
          </button>
        </div>
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
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">No goals yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Set your first savings goal to start tracking</p>
        </div>
      ) : (
        <div className="max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={confirmDeleteGoal}
                onUpdate={handleUpdateGoal}
                selectionMode={selectionMode}
                isSelected={selectedGoalIds.includes(goal.id)}
                onToggleSelect={handleToggleGoalSelection}
              />
            ))}
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="text-gray-900 dark:text-white mb-4">Are you sure you want to delete {itemToDelete.sectionName}?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() =>
                  itemToDelete.mode === 'bulk'
                    ? handleDeleteSelectedGoals(itemToDelete.ids)
                    : handleDeleteGoal(itemToDelete.id)
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
