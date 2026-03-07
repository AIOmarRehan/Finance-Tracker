import { useState, useEffect } from 'react';

const PRESET_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
];

export default function CategoryForm({ category, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: PRESET_COLORS[0]
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        type: category.type || 'expense',
        color: category.color || PRESET_COLORS[0]
      });
    }
  }, [category]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                placeholder="e.g., Groceries"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                  className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                    formData.type === 'income'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-300'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <img src="/icons/income.svg" alt="" className="w-5 h-5" />
                    <span>Income</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                  className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                    formData.type === 'expense'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-300'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <img src="/icons/expenses.svg" alt="" className="w-5 h-5" />
                    <span>Expense</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color *
              </label>
              <div className="grid grid-cols-5 gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-full h-12 rounded-lg border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-800 dark:border-gray-300 scale-110'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="font-medium dark:text-white">{formData.name || 'Category Name'}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({formData.type})</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-2">
              <button type="submit" className="flex-1 btn-primary">
                {category ? 'Update' : 'Add'} Category
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
