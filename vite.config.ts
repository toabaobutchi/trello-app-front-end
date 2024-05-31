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
      { find: '@contexts', replacement: '/src/contexts' },
      { find: '@pages', replacement: '/src/pages' }
    ]
  }
})
