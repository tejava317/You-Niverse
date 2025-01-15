import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176, // Electron이 이 포트를 사용
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 디렉토리 alias
    },
  },
  build: {
    outDir: 'dist', // Vite 빌드 디렉토리
    emptyOutDir: true, // 기존 파일 삭제
    rollupOptions: {
      external: ['electron'], // Electron 모듈 제외
    },
  },
});
