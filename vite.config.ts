import { defineConfig } from 'vite'
import Unfonts from 'unplugin-fonts/vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            },
        }
    },
    plugins: [
        react(),
        Unfonts({
            google: {
                display: 'swap',
                preconnect: true,
                injectTo: 'head-prepend',
                families: [{
                    defer: true,
                    name: 'Plus Jakarta Sans',
                    styles: 'ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700',
                }],
            }
        }),
        nodePolyfills(),
    ]
})
