import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: true,
    treeshake: true,
    outExtension({ format }) {
      return {
        js: format === "cjs" ? ".cjs" : ".mjs",
      };
    },
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    splitting: false,
    sourcemap: false,
    minify: true,
    treeshake: true,
    outExtension() {
      return {
        js: ".mjs",
      };
    },
  },
]);
