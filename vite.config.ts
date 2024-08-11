import { defineConfig } from "vite"

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      name: "index",
      fileName: "index",
    }
  },
  test: {
    globals: true
  }
})