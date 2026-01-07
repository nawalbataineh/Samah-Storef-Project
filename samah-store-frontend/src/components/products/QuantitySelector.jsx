import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ value, onChange, min = 1, max = 99 }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        <Minus className="w-5 h-5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 h-10 text-center border-2 border-gray-200 rounded-lg font-semibold focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QuantitySelector;

