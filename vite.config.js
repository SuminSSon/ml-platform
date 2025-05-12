import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 10000, // 프론트 dev 서버 포트
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 API 서버
        changeOrigin: true,
        ws: true, // WebSocket 프록시까지 활성화
      },
    },
  },
})
