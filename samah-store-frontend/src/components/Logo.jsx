/**
 * SAMAH STORE - Logo Component
 * Typography-based wordmark (fashion label style)
 * Single source of truth for all logo usage
 */

const Logo = ({ variant = 'header', className = '' }) => {
  // Enforced sizes per variant
  const sizes = {
    header: {
      fontSize: '1.875rem',
      descriptorSize: '0.625rem',
      letterSpacing: '0.14em',
    },
    footer: {
      fontSize: '1.5rem',
      descriptorSize: '0.5625rem',
      letterSpacing: '0.12em',
    },
    icon: {
      fontSize: '1.5rem',
      letterSpacing: '0.05em',
    },
  };

  const config = sizes[variant] || sizes.header;

  // Icon variant - single letter mark
  if (variant === 'icon') {
    return (
      <span
        className={className}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: config.fontSize,
          fontWeight: 500,
          letterSpacing: config.letterSpacing,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        S
      </span>
    );
  }

  // Header and Footer variants - full wordmark
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: variant === 'footer' ? '0.25rem' : '0.1875rem',
      }}
    >
      {/* Main wordmark */}
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: config.fontSize,
          fontWeight: 400,
          letterSpacing: config.letterSpacing,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        samah
      </span>

      {/* Descriptor */}
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: config.descriptorSize,
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.7,
          lineHeight: 1,
        }}
      >
        Store
      </span>
    </div>
  );
};

export default Logo;
