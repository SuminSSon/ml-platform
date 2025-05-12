// // src/App.js
// import React, { useState, useEffect } from 'react'
// import Header from './components/Header'
// import ResourceAllocation from './components/ResourceAllocation'
// import ResourceMonitoring from './components/ResourceMonitoring'
// import PodTable from './components/PodTable'
// import PodTableContainer from './components/PodTableContainer'
// import { kubernetesAPI } from './services/kubernetes' // 수정됨: api → kubernetes

// function App() {
//   const [activeTab, setActiveTab] = useState('dashboard')
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [pods, setPods] = useState([])

//   useEffect(() => {
//     const fetchPods = async () => {
//       setIsLoading(true)
//       try {
//         const data = await kubernetesAPI.getPods()
//         setPods(data)
//         setError(null)
//       } catch (err) {
//         console.error('파드 목록 로드 오류:', err)
//         setError('파드 목록을 불러오는 데 실패했습니다.')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchPods()
//   }, [])

//   return (
//     <div className='flex flex-col min-h-screen bg-gray-50'>
//       <Header />

//       <main className='flex-grow max-w-7xl mx-auto px-4 py-8'>
//         {isLoading ? (
//           <div className='flex justify-center items-center h-64'>
//             <p className='text-lg text-gray-700'>데이터 로딩 중...</p>
//           </div>
//         ) : error ? (
//           <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6'>
//             <p>{error}</p>
//           </div>
//         ) : (
//           <>
//             {activeTab === 'dashboard' && (
//               <div className='flex flex-col gap-4'>
//                 <PodTable pods={pods} />
//                 <ResourceMonitoring />
//               </div>
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   )
// }

// export default App

// src/App.js
import React, { useState } from 'react'
import Header from './components/Header'
import ResourceAllocation from './components/ResourceAllocation'
import ResourceMonitoring from './components/ResourceMonitoring'
import PodTableContainer from './components/PodTableContainer' // WebSocket 기반 컴포넌트

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Header />

      <main className='flex-grow max-w-7xl mx-auto px-4 py-8'>
        {activeTab === 'dashboard' && (
          <div className='flex flex-col gap-4'>
            <PodTableContainer /> {/* 실시간 파드 표시 */}
            <ResourceMonitoring />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
