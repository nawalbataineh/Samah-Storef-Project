/**
 * SAMAH - Women Fashion Brand Logo
 * Typography-based wordmark system
 * Inspired by: Zara, Mango, Aritzia, & Other Stories
 */

// ══════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════════

const LOGO_CONFIG = {
  // Fixed sizes - no arbitrary scaling
  header: {
    fontSize: '1.75rem',
    letterSpacing: '0.12em',
    descriptorSize: '0.5rem',
    descriptorSpacing: '0.35em',
  },
  footer: {
    fontSize: '1.375rem',
    letterSpacing: '0.12em',
    descriptorSize: '0.45rem',
    descriptorSpacing: '0.35em',
  },
  icon: {
    fontSize: '1.5rem',
    letterSpacing: '0.08em',
  },
};

// ══════════════════════════════════════════════════════════════════
// PRIMARY LOGO (Header)
// Clean wordmark with optional subtle descriptor
// ══════════════════════════════════════════════════════════════════

const LogoHeader = ({ dark = false, showDescriptor = false }) => {
  const color = dark ? '#FFFFFF' : '#2E2A2B';
  const mutedColor = dark ? 'rgba(255,255,255,0.5)' : '#6F6668';

  return (
    <div className="select-none">
      {/* Wordmark */}
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: LOGO_CONFIG.header.fontSize,
          fontWeight: 400,
          letterSpacing: LOGO_CONFIG.header.letterSpacing,
          color: color,
          textTransform: 'uppercase',
          display: 'block',
          lineHeight: 1,
        }}
      >
        samah
      </span>
      
      {/* Optional descriptor */}
      {showDescriptor && (
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: LOGO_CONFIG.header.descriptorSize,
            fontWeight: 400,
            letterSpacing: LOGO_CONFIG.header.descriptorSpacing,
            color: mutedColor,
            textTransform: 'uppercase',
            display: 'block',
            marginTop: '4px',
          }}
        >
          Store
        </span>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// SECONDARY LOGO (Footer)
// Stacked version - readable, not tiny
// ══════════════════════════════════════════════════════════════════

const LogoFooter = ({ dark = false }) => {
  const color = dark ? '#FFFFFF' : '#2E2A2B';
  const mutedColor = dark ? 'rgba(255,255,255,0.45)' : '#6F6668';

  return (
    <div className="select-none">
      {/* Wordmark */}
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: LOGO_CONFIG.footer.fontSize,
          fontWeight: 400,
          letterSpacing: LOGO_CONFIG.footer.letterSpacing,
          color: color,
          textTransform: 'uppercase',
          display: 'block',
          lineHeight: 1,
        }}
      >
        samah
      </span>
      
      {/* Descriptor - always shown in footer */}
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: LOGO_CONFIG.footer.descriptorSize,
          fontWeight: 400,
          letterSpacing: LOGO_CONFIG.footer.descriptorSpacing,
          color: mutedColor,
          textTransform: 'uppercase',
          display: 'block',
          marginTop: '5px',
        }}
      >
        Store
      </span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// ICON / MONOGRAM (Optional)
// Typographic only - first letter
// ══════════════════════════════════════════════════════════════════

const LogoIcon = ({ dark = false, size = 32 }) => {
  const color = dark ? '#FFFFFF' : '#2E2A2B';
  
  return (
    <div 
      className="select-none flex items-center justify-center"
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: size * 0.65,
          fontWeight: 400,
          letterSpacing: LOGO_CONFIG.icon.letterSpacing,
          color: color,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        S
      </span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════

export default function Logo({ 
  variant = 'header', 
  dark = false,
  showDescriptor = false,
  size = 32,
}) {
  switch (variant) {
    case 'footer':
    case 'stacked':
      return <LogoFooter dark={dark} />;
    case 'icon':
    case 'monogram':
      return <LogoIcon dark={dark} size={size} />;
    case 'header':
    case 'primary':
    default:
      return <LogoHeader dark={dark} showDescriptor={showDescriptor} />;
  }
}

// Named exports for direct imports
export { LogoHeader, LogoFooter, LogoIcon };
export const LogoHorizontal = LogoHeader;
export const LogoStacked = LogoFooter;

