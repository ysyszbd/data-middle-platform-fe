/*
 * @LastEditTime: 2023-08-22 16:41:10
 * @Description:
 */
import { fileURLToPath, URL } from "url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    viteCompression({
      threshold: 10240, // 对大于 1mb 的文件进行压缩
    }),
    visualizer() as PluginOption,
  ],
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: false, //启动项目自动弹出浏览器
    host: "0.0.0.0",
    port: 3000, //启动端
    proxy: {
      "^/server": {
        target: "http://192.168.1.111:31722/", // 后端服务实际地址
        // target: "http://192.168.1.40:31455/", // 后端服务实际地址
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/server/, ""),
      },
      "^/remote-data": {
        target: "http://192.168.1.40:31453/", // 后端文件代理服务实际地址
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/remote-data/, ""),
      },
      "^/excel": {
        target: "http://192.168.89.72:8000/", // 测试
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/excel/, ""),
      },
      "^/m3u8": {
        target: "http://192.168.1.131:8080/", // 测试
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/m3u8/, ""),
      },
      "^/task-data": {
        target: "http://192.168.1.49:9999/", // 测试
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/task-data/, ""),
      },
      "^/cube": {
        // target: "http://192.168.1.49:9999/", // 测试
        target: "http://192.168.1.48:80/", // 测试
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/cube/, ""),
      },
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          opencv_js: ["@techstark/opencv-js"],
          echarts: ["echarts"],
        },
      },
    },
  },
});
