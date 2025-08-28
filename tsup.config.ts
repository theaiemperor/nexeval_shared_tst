import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',            // root
    'src/utils/array.ts',      // explicit subpath entry
    'src/utils/numbers.ts'     // explicit subpath entry
  ],
  outDir: 'dist',
  sourcemap: true,
  dts: true,                  // generate .d.ts files
  format: ['esm', 'cjs'],     // ESM + CJS outputs
  clean: true,                // clear dist before build
  splitting: false,           // per-entry single files (simpler for libs)
  minify: false,
});