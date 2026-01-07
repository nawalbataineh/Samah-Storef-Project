const VariantPicker = ({ variants, selectedVariant, onSelect }) => {
  const activeVariants = variants.filter(v => v.active !== false && v.deleted !== true);

  if (!activeVariants || activeVariants.length === 0) {
    return null;
  }

  // Group by size and color
  const sizes = [...new Set(activeVariants.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(activeVariants.map(v => v.color).filter(Boolean))];

  const getVariantByAttributes = (size, color) => {
    return activeVariants.find(v =>
      (!size || v.size === size) &&
      (!color || v.color === color)
    );
  };

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="block font-semibold mb-3">المقاس</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const variant = getVariantByAttributes(size, selectedVariant?.color);
              const isSelected = selectedVariant?.size === size;
              const isAvailable = variant && variant.stockQuantity > 0;

              return (
                <button
                  key={size}
                  onClick={() => variant && onSelect(variant)}
                  disabled={!isAvailable}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-primary text-white'
                      : isAvailable
                      ? 'bg-white border-2 border-gray-300 hover:border-brand-primary'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <label className="block font-semibold mb-3">اللون</label>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => {
              const variant = getVariantByAttributes(selectedVariant?.size, color);
              const isSelected = selectedVariant?.color === color;
              const isAvailable = variant && variant.stockQuantity > 0;

              return (
                <button
                  key={color}
                  onClick={() => variant && onSelect(variant)}
                  disabled={!isAvailable}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-primary text-white'
                      : isAvailable
                      ? 'bg-white border-2 border-gray-300 hover:border-brand-primary'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="bg-brand-soft p-4 rounded-xl">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">المنتج المحدد:</span>{' '}
            {selectedVariant.size && `${selectedVariant.size}`}
            {selectedVariant.size && selectedVariant.color && ' - '}
            {selectedVariant.color && `${selectedVariant.color}`}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-semibold">SKU:</span> {selectedVariant.sku}
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantPicker;

