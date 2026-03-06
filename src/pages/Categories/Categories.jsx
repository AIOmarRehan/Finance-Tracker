import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../utils/firestore';
import { getDefaultCategories } from '../../utils/helpers';
import CategoryForm from '../../components/Categories/CategoryForm';
import CategoryList from '../../components/Categories/CategoryList';

export default function Categories() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
    if (!confirm('Are you sure? This category will be removed from all transactions.')) return;
    
    try {
      await deleteCategory(categoryId);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  }

  async function handleSetupDefaults() {
    try {
      const defaults = getDefaultCategories();
      for (const category of defaults) {
        await addCategory(currentUser.uid, category);
      }
      await fetchCategories();
      alert('Default categories added successfully!');
    } catch (error) {
      console.error('Error setting up defaults:', error);
      alert('Failed to set up default categories');
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
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your income and expenses</p>
        </div>
        <div className="flex space-x-3">
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
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
