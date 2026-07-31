import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["src/**/*.{js,ts}"] },
  { ignores: ["lib/**/*"] },
  js.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.es2021, ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      quotes: ["error", "double"],
    },
  },
];
