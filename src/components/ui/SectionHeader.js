// src/components/ui/SectionHeader.js
import React from 'react';
import clsx from 'clsx';

export default function SectionHeader({ icon: Icon, title, className = '' }) {
  return (
    <div className={clsx("flex items-center mb-4", className)}>
      <div className="p-2 bg-indigo-100 rounded-full">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <h3 className="ml-2 text-lg font-semibold text-gray-800">{title}</h3>
      <div className="flex-grow h-px bg-gray-200 ml-4" />
    </div>
  );
}
