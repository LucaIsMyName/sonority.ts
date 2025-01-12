import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ReactBillboard",
      formats: ["es", "umd"],
      fileName: (format) => `react-billboard.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "highcharts", "highcharts-react-official"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          highcharts: "Highcharts",
          "highcharts-react-official": "HighchartsReact",
        },
      },
    },
  },
  server: {
    open: true,
  },
});
