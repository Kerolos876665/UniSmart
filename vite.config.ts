import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    base: "./", // 👈 السطر المهم جدًا
    plugins: [react()],
    define: {
      "process.env": {}, // 👈 يمنع الكراش
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
