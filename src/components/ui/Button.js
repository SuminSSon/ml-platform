import React from 'react';
import clsx from 'clsx';

/**
 * variant: primary / secondary / danger
 */
function Button({ children, onClick, variant = 'primary', className = '' }) {
  const base = 'px-4 py-2 rounded-lg font-semibold transition';
  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      onClick={onClick}
      className={clsx(base, styles[variant], className)}
    >
      {children}
    </button>
  );
}

export default Button;
