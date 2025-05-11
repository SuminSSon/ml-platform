import React from 'react'

/**
 * label + input 묶음
 */
function Input({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className='mb-1 font-medium text-left'>{label}</label>}
      <input
        className='border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300'
        {...props}
      />
    </div>
  )
}

export default Input
