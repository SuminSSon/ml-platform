import React, { useEffect, useState } from 'react'
import PodTable from './PodTable'

// 환경변수에서 API 호스트와 포트 가져오기
const WS_HOST = process.env.REACT_APP_API_HOST || window.location.hostname
const WS_PORT = process.env.REACT_APP_API_PORT || '8080'

export default function PodTableContainer() {
  const [pods, setPods] = useState([])

  useEffect(() => {
    const wsUrl = `ws://${WS_HOST}:${WS_PORT}/api/ws/pods`
    console.log('WebSocket 연결 시도:', wsUrl)

    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      console.log('WebSocket 연결 성공:', wsUrl)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        const formatted = data.map(pod => ({
            name: pod.name,
            status: pod.status,
            cpu: pod.cpu || '-',
            memory: pod.memory || '-',
            gpu: pod.gpu || '0',
            job: pod.job || '-',
            age: pod.age || '-',
            restarts: pod.restarts ?? 0,
          }))
          
        setPods(formatted)
      } catch (err) {
        console.error('파드 WebSocket 데이터 파싱 실패:', err)
      }
    }

    socket.onerror = (err) => {
      if (socket.readyState !== WebSocket.CLOSED) {
        console.error('WebSocket 연결 오류:', err)
      }
    }

    socket.onclose = () => {
      console.warn('WebSocket 연결 종료됨')
    }

    return () => {
      socket.close()
      console.log('WebSocket 연결 해제됨')
    }
  }, [])

  return <PodTable pods={pods} />
}