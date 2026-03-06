import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../utils/firestore';
import { getDefaultCategories } from '../../utils/helpers';
import CategoryForm from '../../components/Categories/CategoryForm';
import CategoryList from '../../components/Categories/CategoryList';
import './Categories.css'; // Import CSS for modal styling

export default function Categories() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [setupDefaultsMessage, setSetupDefaultsMessage] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, [currentUser]);

  async function fetchCategories() {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const data = await getCategories(currentUser.uid);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory(categoryData) {
    try {
      await addCategory(currentUser.uid, categoryData);
      await fetchCategories();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  }

  async function handleUpdateCategory(categoryId, updates) {
    try {
      await updateCategory(categoryId, updates);
      await fetchCategories();
      setEditingCategory(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  }

  async function handleDeleteCategory(categoryId) {
    try {
      await deleteCategory(categoryId);
      await fetchCategories();
      setItemToDelete(null); // Reset the confirmation state
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  }

  async function handleDeleteSelectedCategories(categoryIds) {
    if (!categoryIds.length) return;

    try {
      await Promise.all(categoryIds.map((categoryId) => deleteCategory(categoryId)));
      await fetchCategories();
      setSelectedCategoryIds([]);
      setSelectionMode(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting selected categories:', error);
      alert('Failed to delete selected categories');
    }
  }

  function confirmDeleteCategory(categoryId) {
    setItemToDelete({ mode: 'single', id: categoryId, sectionName: 'Category' });
  }

  function confirmDeleteSelectedCategories() {
    if (!selectedCategoryIds.length) return;
    setItemToDelete({ mode: 'bulk', ids: selectedCategoryIds, sectionName: 'Selected Categories' });
  }

  function cancelDelete() {
    setItemToDelete(null);
  }

  async function handleSetupDefaults() {
    try {
      const defaults = getDefaultCategories();
      for (const category of defaults) {
        await addCategory(currentUser.uid, category);
      }
      await fetchCategories();
      setSetupDefaultsMessage({
        type: 'success',
        text: 'Default categories added successfully!'
      });
    } catch (error) {
      console.error('Error setting up defaults:', error);
      setSetupDefaultsMessage({
        type: 'error',
        text: 'Failed to set up default categories'
      });
    }
  }

  function handleEdit(category) {
    setEditingCategory(category);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingCategory(null);
  }

  function handleToggleSelectionMode() {
    setSelectionMode((prev) => !prev);
    setSelectedCategoryIds([]);
  }

  function handleSelectAllCategories() {
    setSelectedCategoryIds(categories.map((category) => category.id));
  }

  function handleToggleCategorySelection(categoryId) {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
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
      {setupDefaultsMessage && (
        <div
          className={`rounded-lg px-4 py-3 border ${
            setupDefaultsMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {setupDefaultsMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your income and expenses</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleToggleSelectionMode} className="btn-secondary">
            {selectionMode ? 'Cancel Select' : 'Select'}
          </button>
          {selectionMode && (
            <>
              <button onClick={handleSelectAllCategories} className="btn-secondary">
                Select All
              </button>
              <button
                onClick={confirmDeleteSelectedCategories}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={selectedCategoryIds.length === 0}
              >
                Delete Selected
              </button>
            </>
          )}
          {categories.length === 0 && (
            <button onClick={handleSetupDefaults} className="btn-secondary">
              Setup Defaults
            </button>
          )}
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Category
          </button>
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? 
            (data) => handleUpdateCategory(editingCategory.id, data) : 
            handleAddCategory
          }
          onCancel={handleCloseForm}
        />
      )}

      {/* Categories List */}
      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={confirmDeleteCategory}
        selectionMode={selectionMode}
        selectedIds={selectedCategoryIds}
        onToggleSelect={handleToggleCategorySelection}
      />

      {itemToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="text-gray-900 mb-4">Are you sure you want to delete {itemToDelete.sectionName}?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  itemToDelete.mode === 'bulk'
                    ? handleDeleteSelectedCategories(itemToDelete.ids)
                    : handleDeleteCategory(itemToDelete.id)
                }
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
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
