import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url)).replace(/[/\\]$/, '');

export default defineConfig({
  resolve: {
    alias: [
      // `import 'server-only'` throws outside an RSC bundler; stub it in tests.
      { find: 'server-only', replacement: `${root}/tests/stubs/server-only.ts` },
      // Mirror tsconfig "@/*": ["./*"].
      { find: /^@\/(.*)$/, replacement: `${root}/$1` },
    ],
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
