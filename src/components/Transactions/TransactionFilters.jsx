export default function TransactionFilters({ filters, onFilterChange, categories }) {
  function handleChange(field, value) {
    onFilterChange({ ...filters, [field]: value });
  }

  function clearFilters() {
    onFilterChange({
      search: '',
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: ''
    });
  }

  return (
    <div className="card overflow-x-hidden">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm whitespace-nowrap text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 min-w-0">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by description..."
            className="input-field"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Date
          </label>
          <input
            type="date"
            id="dateFrom"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Date To */}
        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To Date
          </label>
          <input
            type="date"
            id="dateTo"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}
