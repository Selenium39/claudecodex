import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Copy assets to dist after build
function copyAssets() {
  return {
    name: 'copy-assets',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'src/renderer/assets');
      const destDir = path.resolve(__dirname, 'dist/renderer/assets');

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Copy SVG and PNG files (Icon.png is needed for tray icon)
      const files = fs.readdirSync(srcDir);
      for (const file of files) {
        if (file.endsWith('.svg') || file === 'Icon.png') {
          fs.copyFileSync(
            path.join(srcDir, file),
            path.join(destDir, file)
          );
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copyAssets()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    assetsInlineLimit: 0, // Don't inline SVGs
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
    },
  },
  server: {
    port: 5173,
  },
})
