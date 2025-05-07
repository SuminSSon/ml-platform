import React from 'react';

/**
 * 배경이 흰색이고, 둥근 모서리(2xl), 그림자(xl), padding(6)을 가지는 컨테이너
 */
function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl p-6 border-l-4 border-indigo-500 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
