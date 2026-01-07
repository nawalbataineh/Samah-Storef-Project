/**
 * SAMAH STORE - Product Card
 * Feminine fashion product display
 */

import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

export const ProductCard = ({ product }) => {

  const imageUrl = getImageUrl(product.primaryImageUrl);
  const price = product.minVariantPrice || 0;
  const originalPrice = product.originalPrice;
  const isOnSale = originalPrice && originalPrice > price;

  return (
    <Link 
      to={`/products/${product.slug}`} 
      className="group block"
    >
      {/* Image Container */}
      <div className="relative aspect-product overflow-hidden rounded-xl bg-ivory-100 mb-4">
        {/* Product Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-ivory-100">
            <span className="font-serif text-3xl text-rose-300">S</span>
          </div>
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-berry-500 text-white text-[10px] font-medium tracking-wide rounded-full">
            تخفيض
          </span>
        )}

        {/* New Badge */}
        {product.isNew && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-rose-300 text-charcoal-800 text-[10px] font-medium tracking-wide rounded-full">
            جديد
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/5 transition-colors duration-300" />
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        {/* Category */}
        {product.category && (
          <p className="text-[11px] tracking-wide text-charcoal-400 uppercase">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm text-charcoal-700 leading-snug line-clamp-2 group-hover:text-berry-500 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-medium text-charcoal-800">
            {price.toFixed(2)} د.أ
          </span>
          {isOnSale && (
            <span className="text-sm text-charcoal-400 line-through">
              {originalPrice.toFixed(2)} د.أ
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

