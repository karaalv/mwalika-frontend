import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import next from "@next/eslint-plugin-next";

export default defineConfig([
    // Global ignores
    {
    ignores: [
      ".next/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "public/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
      "@next/next": next,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
      globals: {
        process: "readonly",
      },
    },
    rules: {
      // JS recommended (spread inline to avoid compat layer)
      ...js.configs.recommended.rules,

      // TypeScript recommended
      ...typescriptEslint.configs.recommended.rules,

      // Next.js core-web-vitals + typescript rules
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,

      // Prettier (disables conflicting rules, then adds prettier/prettier)
      ...prettierConfig.rules,
      "prettier/prettier": "error",

      // Your overrides
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]);
