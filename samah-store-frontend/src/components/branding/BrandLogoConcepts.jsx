// Three distinct, production-ready logo concepts for "samah store"
// Text + custom cart icon (flat dusty-rose), no gradients, no external libraries
// Usage: import { BrandLogoConceptA, BrandLogoConceptB, BrandLogoConceptC } from './BrandLogoConcepts';

const BRAND_COLOR = '#E85D9E'; // dusty-rose / cool pink

// Shared text styles
const Text = ({ color = 'currentColor', size = 'text-2xl md:text-3xl' }) => (
  <span
    className={`font-brand font-semibold ${size}`}
    style={{ letterSpacing: '0.04em', color }}
  >
    samah store
  </span>
);

// Concept A: Icon leading (left) — refined outline cart with balanced proportions
export const BrandLogoConceptA = ({ variant = 'header', className = '', dark = false }) => {
  const iconSize = variant === 'footer' ? 40 : 32;
  const textSize = variant === 'footer' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl';
  const color = dark ? '#FFFFFF' : BRAND_COLOR; // flat color; text color will be set separately by parent if needed

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Shopping Cart"
      >
        {/* Elegant minimal cart: handle + basket + wheels */}
        <path
          d="M3 4h2l2 10h9.5a1.5 1.5 0 0 0 1.42-1.04l2.08-6.24H6.2"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="19" r="1.7" stroke={color} strokeWidth="1.6" />
        <circle cx="17" cy="19" r="1.7" stroke={color} strokeWidth="1.6" />
      </svg>
      <Text color={dark ? '#FFFFFF' : undefined} size={textSize} />
    </div>
  );
};

// Concept B: Integrated cart underline — cart wheels align under text for a luxe, cohesive feel
export function BrandLogoConceptB({ variant = 'header', className = '', dark = false }) {
  const isFooter = variant === 'footer';
  // Variant-driven sizes (approx visual): header icon ~28, text ~24; footer icon ~36-40, text ~32-36
  const iconSize = isFooter ? 38 : 28;
  const textSize = isFooter ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl';
  const iconColor = dark ? '#FFFFFF' : BRAND_COLOR;
  const textColor = dark ? '#FFFFFF' : '#111111';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Cart icon (flat stroke), visually aligned to text */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Shopping Cart"
        className="flex-shrink-0"
      >
        <path
          d="M3 4h2l2 10h9.5a1.5 1.5 0 0 0 1.42-1.04l2.08-6.24H6.2"
          stroke={iconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="19" r="1.7" stroke={iconColor} strokeWidth="1.6" />
        <circle cx="17" cy="19" r="1.7" stroke={iconColor} strokeWidth="1.6" />
      </svg>

      <Text color={textColor} size={textSize} />
    </div>
  );
};

// Concept C: Icon trailing (right) — a sleek semi-outline cart balanced to the text for a confident look
export const BrandLogoConceptC = ({ variant = 'header', className = '', dark = false }) => {
  const iconSize = variant === 'footer' ? 40 : 32;
  const textSize = variant === 'footer' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl';
  const color = dark ? '#FFFFFF' : BRAND_COLOR;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Text color={dark ? '#FFFFFF' : undefined} size={textSize} />
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Shopping Cart"
      >
        {/* Semi-outline: light fill hint for basket (still elegant & flat) */}
        <path
          d="M5 6h13l-2 7H8L6 6Z"
          fill={dark ? 'rgba(255,255,255,0.08)' : 'rgba(232,93,158,0.08)'}
        />
        <path
          d="M3 4h2l2 9h9a2 2 0 0 0 1.9-1.4L20 6H6"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="19" r="1.7" stroke={color} strokeWidth="1.6" />
        <circle cx="17" cy="19" r="1.7" stroke={color} strokeWidth="1.6" />
      </svg>
    </div>
  );
};

export default BrandLogoConceptA;
