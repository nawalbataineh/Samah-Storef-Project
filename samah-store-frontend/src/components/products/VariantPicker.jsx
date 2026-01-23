import React, { useState, useEffect } from 'react';

const VariantPicker = ({ variants, selectedVariant, onSelect }) => {
  const activeVariants = variants.filter(v => v.active !== false && v.deleted !== true);

  if (!activeVariants || activeVariants.length === 0) {
    return null;
  }

  // Group by size and color
  const splitValues = (s) => (s ? String(s).split(/[،,]/).map(x => x.trim()).filter(Boolean) : []);

  const sizes = [...new Set(activeVariants.map(v => v.size).filter(Boolean))];
  // derive colors from variants but split any comma/arabic-comma lists
  const allColors = Array.from(new Set(activeVariants.flatMap(v => splitValues(v.color))));

  const [selectedSize, setSelectedSize] = useState(selectedVariant?.size || null);
  const [selectedColor, setSelectedColor] = useState(selectedVariant?.color || null);

  useEffect(() => {
    setSelectedSize(selectedVariant?.size || null);
    setSelectedColor(selectedVariant?.color || null);
  }, [selectedVariant]);

  const variantHasColor = (v, color) => {
    if (!color) return true;
    const parts = splitValues(v.color);
    return parts.some(p => p.toLowerCase() === String(color).trim().toLowerCase());
  };

  const getVariantByAttributes = (size, color) => {
    // prefer exact match of size+color; if not found, try size-only; then color-only; then any
    let found = activeVariants.find(v => (size ? v.size === size : true) && variantHasColor(v, color));
    if (found) return found;
    if (size) {
      found = activeVariants.find(v => v.size === size);
      if (found) return found;
    }
    if (color) {
      found = activeVariants.find(v => variantHasColor(v, color));
      if (found) return found;
    }
    return activeVariants[0];
  };

  // Colors to render depend on selectedSize: when a size is chosen, show only colors for that size.
  const colorsForSelectedSize = selectedSize
    ? Array.from(new Set(activeVariants.filter(v => v.size === selectedSize).flatMap(v => splitValues(v.color))))
    : allColors;

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="block font-semibold mb-3">المقاس</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              // prefer variant matching current selectedColor if any
              let variant = getVariantByAttributes(size, selectedColor);
              if (!variant) variant = getVariantByAttributes(size, null);

              const isSelected = selectedSize === size;
              const isAvailable = variant && variant.stockQuantity > 0;

              return (
                <button
                  key={size}
                  onClick={() => {
                    if (!variant) return;
                    setSelectedSize(size);
                    // if variant has a color and selectedColor differs, sync it
                    if (variant.color && variant.color !== selectedColor) setSelectedColor(variant.color);
                    onSelect(variant);
                  }}
                  disabled={!isAvailable}
                  className={`px-3 sm:px-6 py-3 min-h-12 sm:min-h-auto rounded-xl font-semibold transition-all ${
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
      {(colorsForSelectedSize && colorsForSelectedSize.length > 0) && (
        <div>
          <label className="block font-semibold mb-3">اللون</label>
          <div className="flex flex-wrap gap-2">
            {colorsForSelectedSize.map(color => {
              // prefer variant matching current selectedSize if any
              let variant = getVariantByAttributes(selectedSize, color);

              const isSelected = selectedColor === color;
              // disable color if no size selected or no matching variant or out of stock
              const isAvailable = selectedSize && variant && variant.stockQuantity > 0;

              return (
                <button
                  key={color}
                  onClick={() => {
                    if (!selectedSize) return; // require size first
                    if (!variant) return;
                    setSelectedColor(color);
                    onSelect(variant);
                  }}
                  disabled={!isAvailable}
                  className={`px-3 sm:px-6 py-3 min-h-12 sm:min-h-auto rounded-xl font-semibold transition-all ${
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
      {(selectedVariant || (selectedSize && selectedColor)) && (
        <div className="bg-brand-soft p-4 rounded-xl">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">المنتج المحدد:</span>{' '}
            { (selectedSize || selectedVariant?.size) && `${selectedSize || selectedVariant?.size}` }
            { (selectedSize || selectedVariant?.size) && (selectedColor || selectedVariant?.color) && ' - ' }
            { (selectedColor || selectedVariant?.color) && `${selectedColor || selectedVariant?.color}` }
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
