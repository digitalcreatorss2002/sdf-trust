// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// // vite.config.js
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       '/admin': {
//         target: 'https://sdftrustt.vercel.app/admin',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/admin/, ''),
//       },
//       // ADD THIS so images show up in your React frontend
//       '/uploads': {
//         target: 'http://localhost/backend/admin/uploads',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/uploads/, ''),
//       },
//     },
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Images ke liye sahi proxy setting
      '/uploads': {
        target: 'http://localhost/backend', // Backend folder tak ka path
        changeOrigin: true,
        // Rewrite ki zaroorat tab padti hai agar aap path change karna chahein
        // Agar DB mein path 'uploads/projects/...' hai toh rewrite mat kijiye
      },
    },
  },
})