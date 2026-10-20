import './QuantitySelector.css';

export default function QuantitySelector({ quantity, max = 99, onChange }) {
  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= max) {
      onChange(val);
    }
  };

  return (
    <div className="qty-selector">
      <button
        className="qty-selector__btn"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        className="qty-selector__input"
        value={quantity}
        onChange={handleChange}
        min={1}
        max={max}
        aria-label="Quantity"
      />
      <button
        className="qty-selector__btn"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
