import { useEffect, useState } from 'react';

const AnimatedLogo = ({ className = '', animated = true }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (animated) {
      // Trigger animation after mount
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Logo Mark - Abstract "S" with elegant curves */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`logo-svg ${animated && isLoaded ? 'logo-loaded' : ''}`}
      >
        <defs>
          {/* Gradient for elegant pink tones */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E85D9E" />
            <stop offset="50%" stopColor="#F29BC2" />
            <stop offset="100%" stopColor="#E85D9E" />
          </linearGradient>

          {/* Subtle glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Abstract "S" shape with elegant curves */}
        <path
          d="M 34 12 C 34 12, 38 12, 40 14 C 42 16, 42 20, 40 22 C 38 24, 34 24, 30 24 C 26 24, 22 24, 20 26 C 18 28, 18 32, 20 34 C 22 36, 26 36, 34 36"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
          className="logo-path"
        />

        {/* Decorative accent dots */}
        <circle cx="14" cy="16" r="2" fill="#F29BC2" className="logo-dot-1" opacity="0.6" />
        <circle cx="10" cy="24" r="1.5" fill="#E85D9E" className="logo-dot-2" opacity="0.4" />
        <circle cx="14" cy="32" r="2" fill="#F29BC2" className="logo-dot-3" opacity="0.6" />
      </svg>

      {/* Brand Text */}
      <div className={`flex flex-col logo-text ${animated && isLoaded ? 'text-loaded' : ''}`}>
        <span className="font-brand font-semibold text-xl md:text-2xl text-brand-ink leading-tight tracking-wide">
          Samah Store
        </span>
        <span className="font-brand text-[10px] text-gray-500 uppercase tracking-wider -mt-0.5">
          Premium Fashion
        </span>
      </div>

      <style jsx>{`
        /* SVG Path Animation */
        .logo-path {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          animation: drawPath 1.5s ease-out forwards;
        }

        .logo-loaded .logo-path {
          animation: drawPath 1.5s ease-out forwards, gentlePulse 3s ease-in-out 1.5s infinite;
        }

        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes gentlePulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        /* Decorative dots animation */
        .logo-dot-1, .logo-dot-2, .logo-dot-3 {
          opacity: 0;
          transform: scale(0);
        }

        .logo-loaded .logo-dot-1 {
          animation: dotAppear 0.4s ease-out 0.8s forwards, float 3s ease-in-out 2s infinite;
        }

        .logo-loaded .logo-dot-2 {
          animation: dotAppear 0.4s ease-out 1s forwards, float 3s ease-in-out 2.5s infinite;
        }

        .logo-loaded .logo-dot-3 {
          animation: dotAppear 0.4s ease-out 1.2s forwards, float 3s ease-in-out 3s infinite;
        }

        @keyframes dotAppear {
          to {
            opacity: 0.6;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.1);
          }
        }

        /* Text animation */
        .logo-text {
          opacity: 0;
          transform: translateY(10px);
        }

        .text-loaded {
          animation: fadeInUp 0.8s ease-out 0.5s forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hover effect for entire logo */
        .logo-svg {
          transition: transform 0.3s ease;
        }

        svg:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogo;
