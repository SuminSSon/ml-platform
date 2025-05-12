import React from 'react'

function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-md'>
      <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <h1 className='text-2xl font-bold'>K8s ML 플랫폼</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
