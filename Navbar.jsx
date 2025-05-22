// ... existing code ...

// In your Navbar component
const cartTotal = calculateCartTotal();

return (
  // ... existing JSX ...
  <div className="cart-total">
    {Object.keys(foodMap).length > 0 ? 
      `$${cartTotal.toFixed(2)}` : 
      "Loading..."}
  </div>
  // ... rest of JSX ...
);

// ... rest of code ...