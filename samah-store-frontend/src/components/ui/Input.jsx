/**
 * SAMAH STORE - Input Component
 * Global feminine fashion styling
 */

export const Input = ({ 
  label, 
  error, 
  hint,
  rounded = 'default',
  className = '', 
  ...props 
}) => {
  const roundedOptions = {
    none: 'rounded-none',
    default: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-charcoal-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3
          bg-white 
          border transition-all duration-200
          text-sm text-charcoal-800
          placeholder:text-charcoal-400
          focus:outline-none focus:ring-2 focus:ring-rose-100
          disabled:opacity-50 disabled:cursor-not-allowed
          ${roundedOptions[rounded]}
          ${error 
            ? 'border-berry-300 focus:border-berry-400' 
            : 'border-charcoal-200 focus:border-rose-300'
          }
          ${className}
        `}
        {...props}
      />
      {hint && !error && (
        <p className="text-charcoal-500 text-xs mt-1.5">{hint}</p>
      )}
      {error && (
        <p className="text-berry-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
};

export default Input;

