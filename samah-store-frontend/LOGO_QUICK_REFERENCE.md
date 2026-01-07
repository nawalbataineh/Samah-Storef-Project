# 🎨 LOGO QUICK REFERENCE

## **Component Imports**

```jsx
// Animated version (Header/Footer)
import AnimatedLogo from '../branding/AnimatedLogo';

// Static version (optional, for lists)
import Logo from '../branding/Logo';
```

---

## **Usage**

### **Header**
```jsx
<Link to="/">
  <AnimatedLogo variant="header" />
</Link>
```

### **Footer**
```jsx
<AnimatedLogo variant="footer" />
```

### **Custom**
```jsx
<AnimatedLogo className="my-4" />
<Logo variant="footer" />
```

---

## **Variants**

| Variant | SVG Size | Text Size | Tagline | Use Case |
|---------|----------|-----------|---------|----------|
| `header` | 64×64px | xl/2xl | No | Navigation bar |
| `footer` | 80×80px | 2xl/3xl | Yes | Footer branding |
| `default` | 64×64px | xl/2xl | No | General use |

---

## **Animation**

- ✅ Runs automatically on mount
- ✅ Duration: 2 seconds
- ✅ One-time only (not looping)
- ✅ Smooth, elegant, not distracting

---

## **Colors**

```css
Gradient: #E85D9E → #F29BC2 → #E85D9E
Stroke: 3px
Glow: Subtle feGaussianBlur
```

---

## **Files**

1. `src/components/branding/AnimatedLogo.jsx` - Main component
2. `src/components/branding/Logo.jsx` - Static version
3. Header and Footer already updated ✅

---

**Ready to use!** 🚀

