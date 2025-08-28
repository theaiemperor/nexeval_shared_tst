import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ["src", "./script.ts"],
  outDir: 'dist',
  sourcemap: true,
  dts: true,                  // generate .d.ts files
  format: ['esm', 'cjs'],     // ESM + CJS outputs
  clean: true,                // clear dist before build
  splitting: false,           // per-entry single files (simpler for libs)
  minify: false,
});