import { useState } from 'react';
import Logo, { LogoHorizontal, LogoStacked, LogoIcon, LogoLoader, BRAND_COLORS } from './LogoSystem';

export default function LogoShowcase() {
  const [darkMode, setDarkMode] = useState(false);
  const [animated, setAnimated] = useState(true);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            darkMode 
              ? 'bg-white text-gray-900' 
              : 'bg-gray-900 text-white'
          }`}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button
          onClick={() => setAnimated(!animated)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            animated
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          {animated ? '⚡ Animated' : '⏸️ Static'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-light mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Samah Store
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Premium Brand Identity System
          </p>
        </div>

        {/* Hero Logo Demo */}
        <section className="mb-24">
          <div className={`rounded-2xl p-12 flex items-center justify-center min-h-[300px] ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <LogoHorizontal dark={darkMode} animated={animated} />
          </div>
          <p className={`text-center mt-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            Primary Horizontal Logo (Header)
          </p>
        </section>

        {/* All Variations Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* Horizontal */}
          <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-center h-32 mb-4">
              <LogoHorizontal dark={darkMode} animated={animated} />
            </div>
            <div className={`text-center text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div>Horizontal Logo</div>
              <div className="text-xs mt-1 opacity-70">Website Header</div>
            </div>
          </div>

          {/* Stacked */}
          <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-center h-32 mb-4">
              <LogoStacked dark={darkMode} animated={animated} />
            </div>
            <div className={`text-center text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div>Stacked Logo</div>
              <div className="text-xs mt-1 opacity-70">Footer & Mobile</div>
            </div>
          </div>

          {/* Icon Sizes */}
          <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-center gap-6 h-32 mb-4">
              <LogoIcon size={64} dark={darkMode} animated={animated} />
              <LogoIcon size={48} dark={darkMode} />
              <LogoIcon size={32} dark={darkMode} />
              <LogoIcon size={24} dark={darkMode} />
            </div>
            <div className={`text-center text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div>Icon Variations</div>
              <div className="text-xs mt-1 opacity-70">64px, 48px, 32px, 24px</div>
            </div>
          </div>

          {/* Loader */}
          <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-center h-32 mb-4">
              <LogoLoader size={60} />
            </div>
            <div className={`text-center text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div>Animated Loader</div>
              <div className="text-xs mt-1 opacity-70">Loading States</div>
            </div>
          </div>
        </div>

        {/* Size Tests */}
        <section className="mb-24">
          <h2 className={`text-2xl font-light mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Scalability Test
          </h2>
          <div className={`rounded-xl p-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-end justify-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-3">
                <LogoHorizontal dark={darkMode} className="scale-50" />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>50%</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoHorizontal dark={darkMode} className="scale-75" />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>75%</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoHorizontal dark={darkMode} />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>100%</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoHorizontal dark={darkMode} className="scale-125" />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>125%</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoHorizontal dark={darkMode} className="scale-150" />
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>150%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Color System */}
        <section className="mb-24">
          <h2 className={`text-2xl font-light mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Brand Color System
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className="w-full h-32 rounded-xl mb-3 border-2 border-gray-200"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              />
              <div className={`font-mono text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="font-medium mb-1">Primary</div>
                <div>{BRAND_COLORS.primary}</div>
              </div>
            </div>
            <div className="text-center">
              <div
                className="w-full h-32 rounded-xl mb-3 border-2 border-gray-200"
                style={{ backgroundColor: BRAND_COLORS.accent }}
              />
              <div className={`font-mono text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="font-medium mb-1">Accent</div>
                <div>{BRAND_COLORS.accent}</div>
              </div>
            </div>
            <div className="text-center">
              <div
                className="w-full h-32 rounded-xl mb-3 border-2 border-gray-200"
                style={{ backgroundColor: BRAND_COLORS.soft }}
              />
              <div className={`font-mono text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="font-medium mb-1">Soft</div>
                <div>{BRAND_COLORS.soft}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-24">
          <h2 className={`text-2xl font-light mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Real-World Usage
          </h2>

          {/* Mock Header */}
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <LogoHorizontal animated={false} />
              <nav className="flex gap-6">
                <span className="text-sm font-medium text-gray-700">Shop</span>
                <span className="text-sm font-medium text-gray-700">About</span>
                <span className="text-sm font-medium text-gray-700">Contact</span>
              </nav>
            </div>
            <p className={`text-center mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Website Header Example
            </p>
          </div>

          {/* Mock Footer */}
          <div>
            <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center">
              <LogoStacked dark={true} animated={false} />
              <div className="mt-6 text-center text-sm text-gray-400">
                © 2026 Samah Store. All rights reserved.
              </div>
            </div>
            <p className={`text-center mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Footer Example
            </p>
          </div>
        </section>

        {/* Guidelines */}
        <section className={`rounded-2xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h3 className={`text-xl font-light mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Guidelines
          </h3>
          <div className={`space-y-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Use on clean backgrounds with proper contrast</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Maintain minimum clear space (equal to mark height)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Enable animation on landing pages and hero sections</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5">✗</span>
              <span>Never distort, rotate, or add effects to the logo</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5">✗</span>
              <span>Don't place on busy backgrounds or low-contrast surfaces</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

