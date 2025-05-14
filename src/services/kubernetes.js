const API_BASE = '/api' // REST API 경로
const WS_HOST = process.env.REACT_APP_API_HOST
const WS_PORT = process.env.REACT_APP_API_PORT

export const kubernetesAPI = {
  // 파드 로그 (텍스트)
  connectPodStream() {
    const wsUrl = `ws://${WS_HOST}:${WS_PORT}/api/ws/pods`
    return new WebSocket(wsUrl)
  },

  // WebSocket 로그 스트리밍 연결 (하드코딩된 8080 포트 사용)
  connectLogStream(podName) {
    const wsUrl = `ws://${WS_HOST}:${WS_PORT}/api/ws/logs/${podName}`
    return new WebSocket(wsUrl)
  },

  // 파드 목록 조회
  async getPods() {
    const res = await fetch(`${API_BASE}/pods`)
    if (!res.ok) throw new Error('파드 목록 실패')
    return await res.json()
  },

  // 파드 생성
  async createPod(formData) {
    const res = await fetch(`${API_BASE}/pods`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('파드 생성 실패')
    return await res.json()
  },

  // 파드 중지
  async stopPod(podName) {
    const res = await fetch(`${API_BASE}/pods/${podName}/stop`, { method: 'POST' })
    if (!res.ok) throw new Error('파드 중지 실패')
    return await res.json()
  },

  // ML 작업 생성
  async createMLJob({ cpu, gpu, memory }) {
    const res = await fetch(`${API_BASE}/mljobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpu, gpu, memory }),
    })
    if (!res.ok) throw new Error('MLJob 생성 실패')
    return await res.json()
  },

  // 클러스터 자원 조회
  async getClusterResources() {
    const res = await fetch(`${API_BASE}/cluster/resources`)
    if (!res.ok) throw new Error('자원 조회 실패')
    return await res.json()
  },

  // 학습 로그 (구조화된 json)
  async getTrainingLogs(podName) {
    const res = await fetch(`${API_BASE}/pods/${podName}/logs?format=json`)
    if (!res.ok) throw new Error('학습 로그 조회 실패')
    return await res.text()
  },
}
