export const Select = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-dark font-semibold mb-2">
          {label}
        </label>
      )}
      <select
        className={`input-field ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

