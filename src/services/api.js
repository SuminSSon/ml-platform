import axios from 'axios';

// 기본 API 설정
const api = axios.create({
  baseURL: '/api', // 프록시 설정에 따라 변경 가능
  headers: {
    'Content-Type': 'application/json',
  },
});

// 에러 인터셉터
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API 오류:', error);
    return Promise.reject(error);
  }
);

// API 함수들
export const kubernetesAPI = {
  // Pod 목록 가져오기
  getPods: async (namespace = 'sumin') => {
    try {
      const response = await api.get(`/pods?namespace=${namespace}`);
      return response.data;
    } catch (error) {
      console.error('Pod 목록 가져오기 실패:', error);
      throw error;
    }
  },
  
  // Pod 로그 가져오기
  getPodLogs: async (podName, namespace = 'sumin') => {
    try {
      const response = await api.get(`/pods/${podName}/logs?namespace=${namespace}`);
      return response.data;
    } catch (error) {
      console.error(`${podName} 로그 가져오기 실패:`, error);
      throw error;
    }
  },
  
  // ML 작업 생성
  createMLJob: async (jobData, namespace = 'sumin') => {
    try {
      const response = await api.post(`/mljobs?namespace=${namespace}`, jobData);
      return response.data;
    } catch (error) {
      console.error('ML 작업 생성 실패:', error);
      throw error;
    }
  },
  
  // ML 작업 목록 가져오기
  getMLJobs: async (namespace = 'sumin') => {
    try {
      const response = await api.get(`/mljobs?namespace=${namespace}`);
      return response.data;
    } catch (error) {
      console.error('ML 작업 목록 가져오기 실패:', error);
      throw error;
    }
  },
  
  // 클러스터 자원 정보 가져오기
  getClusterResources: async () => {
    try {
      const response = await api.get('/cluster/resources');
      return response.data;
    } catch (error) {
      console.error('클러스터 자원 정보 가져오기 실패:', error);
      throw error;
    }
  },
};

export default api;