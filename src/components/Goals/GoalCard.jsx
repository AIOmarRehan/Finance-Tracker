import { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onUpdate,
  selectionMode = false,
  isSelected = false,
  onToggleSelect
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateAmount, setUpdateAmount] = useState('');

  const progress = goal.targetAmount > 0 
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) 
    : 0;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  async function handleQuickUpdate() {
    if (!updateAmount || parseFloat(updateAmount) <= 0) return;
    
    const newAmount = goal.currentAmount + parseFloat(updateAmount);
    await onUpdate(goal.id, { currentAmount: newAmount });
    setUpdateAmount('');
    setIsUpdating(false);
  }

  // Calculate days remaining
  let daysRemaining = null;
  if (goal.targetDate) {
    const targetDate = goal.targetDate.toDate ? goal.targetDate.toDate() : new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate - today;
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className={`card ${isCompleted ? 'border-2 border-green-500' : ''}`}>
      {isCompleted && (
        <div className="mb-3 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium flex items-center">
          <span className="mr-2">🎉</span>
          Goal Achieved!
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{goal.name}</h3>
          {goal.description && (
            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {selectionMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect?.(goal.id)}
              aria-label={`Select ${goal.name}`}
              className="h-4 w-4"
            />
          )}
          <button
            onClick={() => onEdit(goal)}
            className="text-primary-600 hover:text-primary-800"
            aria-label="Edit goal"
            disabled={selectionMode}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete goal"
            disabled={selectionMode}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{formatCurrency(goal.currentAmount)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-primary-600'
            }`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center font-medium">
          {progress.toFixed(1)}% Complete
        </p>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        {!isCompleted && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(remaining)}</span>
          </div>
        )}
        {goal.targetDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target Date:</span>
            <span className={`font-semibold ${
              daysRemaining !== null && daysRemaining < 30 && !isCompleted ? 'text-red-600' : 'text-gray-900'
            }`}>
              {formatDate(goal.targetDate)}
              {daysRemaining !== null && !isCompleted && (
                <span className="ml-1">({daysRemaining} days)</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Quick Update */}
      {!isCompleted && (
        <div className="border-t pt-4">
          {isUpdating ? (
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={updateAmount}
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  className="input-field pl-8"
                  placeholder="Amount to add"
                  autoFocus
                />
              </div>
              <div className="flex space-x-2">
                <button onClick={handleQuickUpdate} className="flex-1 btn-primary text-sm py-2">
                  Add
                </button>
                <button onClick={() => setIsUpdating(false)} className="flex-1 btn-secondary text-sm py-2">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsUpdating(true)}
              className="w-full btn-primary text-sm py-2"
            >
              Add Progress
            </button>
          )}
        </div>
      )}
    </div>
  );
}
