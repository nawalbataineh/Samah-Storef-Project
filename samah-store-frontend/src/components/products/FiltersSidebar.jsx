import { useState, useEffect } from 'react';
import { productsApi } from '../../services/productsApi';
import { useToast } from '../../context/ToastContext';

const FiltersSidebar = ({ searchParams, setSearchParams, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const { error } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productsApi.getCategories();
        setCategories(data.filter(cat => cat.active !== false));
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    if (categoryId) {
      searchParams.set('categoryId', categoryId);
    } else {
      searchParams.delete('categoryId');
    }
    setSearchParams(searchParams);
    onFilterChange();
  };

  const handlePriceFilter = () => {
    if (minPrice) {
      searchParams.set('minPrice', minPrice);
    } else {
      searchParams.delete('minPrice');
    }
    if (maxPrice) {
      searchParams.set('maxPrice', maxPrice);
    } else {
      searchParams.delete('maxPrice');
    }
    setSearchParams(searchParams);
    onFilterChange();
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
    onFilterChange();
  };

  return (
    <div className="card p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-6">الفلاتر</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block font-semibold mb-3">الفئة</label>
        <select
          value={searchParams.get('categoryId') || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">جميع الفئات</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block font-semibold mb-3">السعر (JOD)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="من"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            min="0"
          />
          <input
            type="number"
            placeholder="إلى"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            min="0"
          />
        </div>
        <button
          onClick={handlePriceFilter}
          className="w-full btn-secondary py-2 text-sm"
        >
          تطبيق
        </button>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full text-red-500 hover:text-red-700 font-semibold py-2"
      >
        مسح الفلاتر
      </button>
    </div>
  );
};

export default FiltersSidebar;

