import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    files: ["src/**/*.{vue,ts}"],
  },
  {
    ignores: ["**/*js", "functions", "dist", "lib"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/strongly-recommended"],
  {
    plugins: {
      "typescript-eslint": tseslint.plugin,
      sonarjs,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        sourceType: "module",
      },
    },
  },
  {
    rules: {
      "vue/no-unused-vars": "error",
      "vue/no-reserved-component-names": "error",
      "@typescript-eslint/no-explicit-any": "off",
      // typescript-eslint v8 changed the `caughtErrors` default to "all"; the pre-upgrade
      // config (v6) ignored unused caught-error bindings, so keep that behavior on migration.
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "no-unreachable": "error",
      "vue/multi-word-component-names": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/elseif-without-else": "error",
      "sonarjs/max-switch-cases": "error",
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-collapsible-if": "off",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-empty-collection": "error",
      "sonarjs/no-extra-arguments": "error",
      "sonarjs/no-gratuitous-expressions": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-identical-expressions": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-ignored-return": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-nested-template-literals": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-same-line-conditional": "error",
      "sonarjs/no-small-switch": "error",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-use-of-empty-return-value": "error",
      "sonarjs/no-useless-catch": "error",
      "sonarjs/non-existent-operator": "error",
      "sonarjs/prefer-immediate-return": "off",
      "sonarjs/prefer-object-literal": "error",
      "sonarjs/prefer-single-boolean-return": "error",
      "sonarjs/prefer-while": "error",
      // TypeScript 6.0 inference trips these type-aware rules on valid code
      // (union / `X | null` returns, Array.includes generics, `typeof`-guarded `in`) — all false positives.
      "sonarjs/function-return-type": "off",
      "sonarjs/argument-type": "off",
      "sonarjs/in-operator-type-error": "off",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  },
  eslintConfigPrettier,
];
