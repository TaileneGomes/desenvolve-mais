import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" faz o build funcionar em subpasta e dentro de app Capacitor (Android).
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { host: true, port: 5173 },
});
