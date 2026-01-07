# SAMAH STORE - Brand Identity System
## Logo Guidelines & Usage

---

## 📦 Logo System Overview

This brand identity includes:
- **Primary Horizontal Logo** (website header, desktop)
- **Stacked Logo** (footer, mobile, square formats)
- **Icon/Mark Only** (favicon, app icon, social media)
- **Animated Loader** (loading states)

---

## 🎨 Design Philosophy

**Core Principles:**
- Extreme minimalism with intelligent detail
- Timeless elegance over trendy effects
- Perfect optical alignment and spacing
- Premium feel at any size

**The Mark:**
An abstract "S" form that integrates a refined shopping bag handle through negative space. The design is:
- Smart and intentional (not decorative)
- Works perfectly at 16px (favicon)
- Memorable without being literal
- Feels modern and confident

**The Wordmark:**
- "samah" = Dominant, confident (font-weight 500)
- "store" = Subtle, refined (font-weight 300, 85% size, soft color)
- Tight kerning (-0.02em on "samah")
- Optical spacing between words (1.5 spacing units)

---

## 🚀 Usage Examples

### 1. Website Header
```jsx
import Logo from './components/branding/LogoSystem';

function Header() {
  return (
    <header className="bg-white">
      <Logo variant="horizontal" animated={true} />
    </header>
  );
}
```

### 2. Footer
```jsx
function Footer() {
  return (
    <footer className="bg-gray-900">
      <Logo variant="stacked" dark={true} />
    </footer>
  );
}
```

### 3. Favicon / App Icon
```jsx
function Favicon() {
  return <Logo variant="icon" size={32} />;
}
```

### 4. Loading State
```jsx
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Logo variant="loader" size={80} />
    </div>
  );
}
```

---

## 🎭 Props API

### Primary Logo Component
```typescript
<Logo 
  variant="horizontal" | "stacked" | "icon" | "loader"
  dark={boolean}           // Use white version on dark backgrounds
  animated={boolean}       // Enable entrance animation
  size={number}            // Icon size (for icon variant only)
  className={string}       // Additional CSS classes
/>
```

### Individual Components
```jsx
import { 
  LogoHorizontal,
  LogoStacked, 
  LogoIcon,
  LogoLoader,
  BRAND_COLORS 
} from './components/branding/LogoSystem';
```

---

## 🎬 Animation Specifications

**Primary Logo Animation:**
- **Duration:** 0.9s total
- **Easing:** Cubic bezier [0.22, 1, 0.36, 1] (cinematic ease-out)
- **Sequence:**
  1. Mark fade-in + scale (0–0.9s)
  2. Mark stroke draw animation (0.1–1.2s)
  3. Handle detail appears (0.5–1.3s)
  4. Wordmark slides up + fades in (0.3–1.2s)

**Accessibility:**
- Respects `prefers-reduced-motion`
- No animation if user has motion sensitivity
- Instant display fallback

**Performance:**
- GPU-accelerated transforms only
- No layout thrashing
- Optimized for 60fps

---

## 🎨 Color System

```javascript
const BRAND_COLORS = {
  primary: "#1a1a1a",      // Deep black (logo, text)
  accent: "#D4A5A5",       // Soft dusty rose (secondary)
  soft: "#F5F5F5",         // Off-white (backgrounds)
};
```

**Usage Modes:**
- **Light backgrounds:** Use primary color (#1a1a1a)
- **Dark backgrounds:** Use white (#ffffff) with `dark={true}`
- **Accent application:** Applied to "store" text at 75% opacity

**Color Psychology:**
- Black = Timeless, premium, confident
- Dusty rose = Feminine, elegant, approachable
- Soft white = Clean, modern, luxury

---

## 📏 Size Specifications

### Horizontal Logo
- **Header (Desktop):** 32px mark + 28-32px text
- **Header (Mobile):** 28px mark + 24-28px text
- **Minimum safe size:** 24px mark height

### Stacked Logo
- **Footer:** 44px mark + 26-30px text
- **Mobile:** 40px mark + 24-28px text

### Icon Only
- **Favicon:** 32×32px, 16×16px
- **App Icon:** 512×512px (scales down perfectly)
- **Social Media:** 400×400px minimum

---

## ✅ Do's and Don'ts

### ✅ DO:
- Use on clean, uncluttered backgrounds
- Maintain minimum clear space (equal to mark height)
- Use official color variations only
- Keep mark + wordmark proportions intact
- Enable animation on hero/landing pages

### ❌ DON'T:
- Distort, rotate, or skew the logo
- Add effects, shadows, or outlines
- Place on busy photographic backgrounds
- Change spacing between elements
- Use low-contrast color combinations
- Animate on every page load (use sparingly)

---

## 🔧 Technical Notes

**SVG Optimization:**
- Clean, hand-coded paths
- No unnecessary groups or transforms
- Optimized for crisp rendering at any size
- Works in all modern browsers

**Performance:**
- Logo component is < 3KB gzipped
- Framer Motion tree-shaking compatible
- No external dependencies beyond React

**Accessibility:**
- Proper ARIA labels included
- Works with screen readers
- Maintains contrast ratios (WCAG AAA)

---

## 📱 Responsive Behavior

The logo automatically adapts:
```jsx
// Responsive size example
<Logo 
  variant="horizontal"
  className="w-32 md:w-36 lg:w-40"
  animated={true}
/>
```

**Breakpoint Strategy:**
- Mobile (< 768px): Use smaller sizes or stacked variant
- Tablet (768px - 1024px): Standard horizontal
- Desktop (> 1024px): Full-size horizontal

---

## 🎯 Brand Applications

**Primary Uses:**
- Website header/navigation
- Marketing materials
- Email signatures
- Social media profiles
- Product packaging

**Secondary Uses:**
- Favicons and app icons
- Loading states and splash screens
- Watermarks (use at low opacity)
- Presentation decks

---

## 📐 Export Formats

For non-web uses, export the LogoIcon as:
- **PNG:** 1024×1024px transparent (high-res)
- **SVG:** Vector (for print/large format)
- **ICO:** 16×16, 32×32, 64×64 (favicon)

---

## 🌟 Inspiration & Quality Standard

This logo system is designed to match the quality of:
- **Apple** (refined, minimal, timeless)
- **Stripe** (smart, modern, confident)
- **Linear** (elegant motion, precise detail)
- **Shopify** (professional, trustworthy)

**Success Criteria:**
✓ Looks premium without context
✓ Works perfectly at 16px
✓ Feels intentional, not template-based
✓ Still looks modern in 10 years
✓ Animation feels expensive and calm

---

## 📞 Support

For questions about logo usage or brand guidelines:
- Review this documentation first
- Check component props in `LogoSystem.jsx`
- Test at various sizes before deploying

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Status:** Production Ready ✨

