import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    ViteImageOptimizer({})
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        service: resolve(__dirname, 'service.html'),
        contact: resolve(__dirname, 'contact.html'),
        team: resolve(__dirname, 'team.html'),
        'team-member': resolve(__dirname, 'team-member.html'),
      },
    },
  },
});