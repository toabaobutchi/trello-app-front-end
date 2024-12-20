import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@comps', replacement: '/src/components' },
      { find: '@hooks', replacement: '/src/hooks' },
      { find: '@utils', replacement: '/src/utils' },
      { find: '@confs', replacement: '/src/configs' },
      { find: '@layouts', replacement: '/src/layouts' },
      { find: '@redux', replacement: '/src/redux' },
      { find: '@assets', replacement: '/src/assets' },
      { find: '@routes', replacement: '/src/routes' },
      { find: '@services', replacement: '/src/services' },
      { find: '@pages', replacement: '/src/pages' }
    ]
  }
})
