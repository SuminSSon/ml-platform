import React, { useEffect, useState } from 'react'
import { BarChart2 } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Card from './ui/Card'

function ResourceMonitoring() {
  const [data, _setData] = useState([])

  useEffect(() => {
    // Prometheus API 호출로 실제 데이터 로드
    // 예: setData(fetchedData);
  }, [])

  return (
    <Card>
      <h2 className='text-xl font-semibold mb-4 flex items-center'>
        <BarChart2 className='mr-2 text-indigo-600' /> 리소스 모니터링
      </h2>
      <div className='h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data}>
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='cpu' name='CPU (%)' />
            <Line type='monotone' dataKey='gpu' name='GPU (%)' />
            <Line type='monotone' dataKey='memory' name='메모리 (%)' />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default ResourceMonitoring
