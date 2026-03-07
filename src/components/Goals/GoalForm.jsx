import { useState, useEffect } from 'react';

export default function GoalForm({ goal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    targetDate: '',
    description: ''
  });

  useEffect(() => {
    if (goal) {
      const date = goal.targetDate?.toDate ? goal.targetDate.toDate() : goal.targetDate ? new Date(goal.targetDate) : null;
      setFormData({
        name: goal.name || '',
        targetAmount: goal.targetAmount || '',
        currentAmount: goal.currentAmount || 0,
        targetDate: date ? date.toISOString().split('T')[0] : '',
        description: goal.description || ''
      });
    }
  }, [goal]);

  function handleSubmit(e) {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      targetDate: formData.targetDate ? new Date(formData.targetDate) : null
    };
    
    onSubmit(submitData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {goal ? 'Edit Goal' : 'Add Goal'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                placeholder="e.g., Emergency Fund"
              />
            </div>

            {/* Target Amount */}
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  id="targetAmount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="input-field pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Current Amount */}
            <div>
              <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  id="currentAmount"
                  min="0"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                  className="input-field pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                id="targetDate"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                className="input-field"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="input-field"
                placeholder="Why is this goal important to you?"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-2">
              <button type="submit" className="flex-1 btn-primary">
                {goal ? 'Update' : 'Add'} Goal
              </button>
              <button type="button" onClick={onCancel} className="flex-1 btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
