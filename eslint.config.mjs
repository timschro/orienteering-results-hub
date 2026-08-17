import js from "@eslint/js"
import tseslint from "typescript-eslint"
import nextPlugin from "@next/eslint-plugin-next"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

const unusedVarsOptions = {
  args: "after-used",
  argsIgnorePattern: "^_",
  varsIgnorePattern: "^_",
  caughtErrorsIgnorePattern: "^_",
}

// Flat config wired to eslint directly (`eslint .`).
// `next lint` is deprecated and removed in Next 16, so we do not rely on it.
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "next-env.d.ts",
      "public/**",
    ],
  },

  // Base JS rules for every linted file
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", unusedVarsOptions],
    },
  },

  // TypeScript / TSX
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", unusedVarsOptions],
    },
  },

  // Next.js rules for app code
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,mts}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // React Hooks rules
  reactHooks.configs["recommended-latest"],

  // Build/tooling config files legitimately use CommonJS requires
  {
    files: ["*.config.{ts,mts,cts}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
)
