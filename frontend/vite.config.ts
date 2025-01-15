import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176, // 개발 서버 포트
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 디렉토리 alias 설정
    },
  },
  define: {
    'process.env': {}, // process.env 사용 가능하게 정의
  },
  build: {
    outDir: 'dist', // 빌드 결과물이 저장될 디렉토리
    emptyOutDir: true, // 기존 빌드 결과 삭제
    rollupOptions: {
      external: ['electron'], // Electron 모듈은 외부 종속성으로 처리
      output: {
        format: 'cjs', // CommonJS 형식으로 빌드
      },
    },
  },
});
