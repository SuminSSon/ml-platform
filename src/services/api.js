import axios from 'axios'

// 기본 API 설정
const api = axios.create({
  baseURL: '/api', // 프록시에 따라 실제는 http://localhost:8080
  headers: {
    'Content-Type': 'application/json',
  },
})

// 에러 인터셉터
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API 오류:', error)
    return Promise.reject(error)
  }
)

export const kubernetesAPI = {
  // Pod 목록
  getPods: async (namespace = 'sumin') => {
    const res = await api.get(`/pods?namespace=${namespace}`)
    return res.data
  },

  // Pod 로그 (텍스트 반환)
  getPodLogs: async (podName, namespace = 'sumin') => {
    const res = await fetch(`/api/pods/${podName}/logs?namespace=${namespace}`)
    if (!res.ok) throw new Error(`${podName} 로그 가져오기 실패`)
    return await res.text()
  },

  // 구조화된 학습 로그
  getTrainingLogs: async (podName, namespace = 'sumin') => {
    const res = await fetch(`/api/pods/${podName}/logs?namespace=${namespace}&format=json`)
    if (!res.ok) throw new Error('학습 로그 가져오기 실패')
    return await res.json()
  },

  // WebSocket 로그 스트림 연결
  connectLogStream: (podName) => {
    const wsUrl = `ws://${window.location.host}/api/ws/logs/${podName}`
    return new WebSocket(wsUrl)
  },

  // ML 작업 생성
  createMLJob: async (jobData, namespace = 'sumin') => {
    const res = await api.post(`/mljobs?namespace=${namespace}`, jobData)
    return res.data
  },

  // ML 작업 목록
  getMLJobs: async (namespace = 'sumin') => {
    const res = await api.get(`/mljobs?namespace=${namespace}`)
    return res.data
  },

  // 클러스터 자원 정보
  getClusterResources: async () => {
    const res = await api.get('/cluster/resources')
    return res.data
  },

  // 파드 중지
  stopPod: async (podName, namespace = 'sumin') => {
    const res = await api.post(`/pods/${podName}/stop?namespace=${namespace}`)
    return res.data
  },

  // 파드 생성 (FormData 사용)
  createPod: async (formData) => {
    const res = await fetch(`/api/pods`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('파드 생성 실패')
    return await res.json()
  },
}

export default api