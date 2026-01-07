import { motion, useReducedMotion } from "framer-motion";

const BRAND_PINK = "#E85D9E";
const INK = "#1f1f1f";

function resolveSizes(variant) {
  if (variant === "footer") {
    return {
      mark: 66,
      wordmarkClass: "text-[36px] md:text-[40px]",
      stackedTopClass: "text-[38px] md:text-[42px]",
      stackedBottomClass: "text-[18px] md:text-[20px]",
    };
  }

  return {
    mark: 46,
    wordmarkClass: "text-[30px] md:text-[32px]",
    stackedTopClass: "text-[30px] md:text-[32px]",
    stackedBottomClass: "text-[15px] md:text-[16px]",
  };
}

function CustomCartMark({ size, stroke, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="block"
    >
      <path d="M10 12c6 0 7 0 9 10" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <path
        d="M20 22h17.5c1.1 0 1.9 1.05 1.55 2.1l-3.3 10.1a2.2 2.2 0 0 1-2.09 1.52H22.2a2.2 2.2 0 0 1-2.13-1.7L17.7 22"
        stroke={color}
        strokeWidth={stroke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M23.8 26.5h14.7" stroke={color} strokeWidth={stroke} strokeLinecap="round" opacity="0.55" />
      <path d="M25.2 30.6h11.9" stroke={color} strokeWidth={stroke} strokeLinecap="round" opacity="0.35" />
      <path d="M23.2 39.2a2.8 2.8 0 1 0 0 .1" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <path d="M35.9 39.2a2.8 2.8 0 1 0 0 .1" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <path d="M14.2 15.2h3.1" stroke={color} strokeWidth={stroke} strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function WordmarkClassic({ dark }) {
  const color = dark ? "#ffffff" : INK;
  return (
    <span
      className="font-brand antialiased leading-[1.01] tracking-[0.004em]"
      style={{ color }}
    >
      <span className="font-semibold">samah</span>
      <span className="mx-0.5 font-medium opacity-95">store</span>
    </span>
  );
}

function WordmarkFashion({ dark }) {
  const samahColor = dark ? "#ffffff" : INK;
  const storeColor = dark ? "rgba(255,255,255,0.88)" : "rgba(232,93,158,0.86)";
  return (
    <span className="font-brand antialiased leading-[1.01]">
      <span
        className="font-bold tracking-[0.006em]"
        style={{ color: samahColor }}
      >
        samah
      </span>
      <span
        className="mx-0.5 font-normal tracking-[0.003em]"
        style={{ color: storeColor }}
      >
        store
      </span>
    </span>
  );
}

function WordmarkStacked({ variant, dark, sizes }) {
  if (variant === "header") return <WordmarkFashion dark={dark} />;
  const topColor = dark ? "#ffffff" : INK;
  const bottomColor = dark ? "rgba(255,255,255,0.88)" : "rgba(232,93,158,0.86)";
  return (
    <span className="font-brand antialiased leading-[1.05]">
      <span
        className={`block font-bold tracking-[0.006em] ${sizes.stackedTopClass}`}
        style={{ color: topColor }}
      >
        samah
      </span>
      <span
        className={`block font-medium tracking-[0.01em] ${sizes.stackedBottomClass}`}
        style={{ color: bottomColor }}
      >
        store
      </span>
    </span>
  );
}

export default function BrandLogo({
  variant = "header",
  dark = false,
  className = "",
  typography = "Fashion",
}) {
  const reduceMotion = useReducedMotion();
  const sizes = resolveSizes(variant);
  const iconColor = dark ? "#ffffff" : BRAND_PINK;

  const mount = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 } };

  const t = (typography || "Fashion").toLowerCase();
  const wordmark =
    t === "classic" ? (
      <WordmarkClassic dark={dark} />
    ) : t === "stacked" ? (
      <WordmarkStacked variant={variant} dark={dark} sizes={sizes} />
    ) : (
      <WordmarkFashion dark={dark} />
    );

  const gapClass = variant === "footer" ? "gap-4" : "gap-2";

  return (
    <motion.div
      aria-label="samah store"
      className={`inline-flex items-center ${gapClass} select-none ${className}`}
      {...mount}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <motion.div
        aria-hidden="true"
        className="relative inline-flex items-center"
        whileHover={reduceMotion ? undefined : { rotate: 2, scale: 1.03 }}
        transition={
          reduceMotion
            ? undefined
            : { type: "spring", stiffness: 260, damping: 18 }
        }
      >
        <CustomCartMark
          size={sizes.mark}
          stroke={variant === "footer" ? 1.75 : 1.65}
          color={iconColor}
        />
        {!reduceMotion && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{ boxShadow: "0 0 14px rgba(232,93,158,0.28)" }}
          />
        )}
      </motion.div>

      <span className={t === "stacked" && variant === "footer" ? "" : sizes.wordmarkClass}>
        {wordmark}
      </span>
    </motion.div>
  );
}
