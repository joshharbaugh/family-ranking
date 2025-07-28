import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  test: {
    projects: [
      // NOTE: Temporarily disabled to focus on unit tests
      // {
      //   extends: true,
      //   plugins: [
      //     // The plugin will run tests for the stories defined in your Storybook config
      //     // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      //     storybookTest({ configDir: path.join(dirname, '.storybook') }),
      //   ],
      //   test: {
      //     name: 'storybook',
      //     browser: {
      //       enabled: true,
      //       headless: true,
      //       provider: 'playwright',
      //       instances: [{ browser: 'chromium' }],
      //     },
      //     exclude: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
      //     setupFiles: ['.storybook/vitest.setup.ts'],
      //   },
      // },
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
          exclude: [
            'src/**/*.stories.tsx',
            'src/**/*.stories.ts',
            'src/stories/**/*',
            '.storybook/**/*',
            'src/**/stories/**/*',
            '**/node_modules/**',
            '**/dist/**',
            '**/.next/**',
            '**/coverage/**',
          ],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
})
