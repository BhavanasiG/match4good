import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import { defineConfig, globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["src/app/ws/*.js"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "default", format: ["snake_case"] },
        {
          selector: "variable",
          types: ["array", "boolean", "number", "string"],
          format: ["snake_case"],
        },
        {
          selector: "variable",
          types: ["function"],
          format: ["strictCamelCase"],
        },
        { selector: "typeLike", format: ["StrictPascalCase"] },
        {
          selector: "function",
          format: ["strictCamelCase", "StrictPascalCase"],
        },
        { selector: "import", format: null },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            ArrowFunctionExpression: false,
            ClassDeclaration: true,
            FunctionDeclaration: true,
            FunctionExpression: false,
            MethodDefinition: true,
          },
        },
      ],
      "jsdoc/require-description": "error",
      "jsdoc/require-param": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-example": "warn",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/check-types": "warn",
      "jsdoc/require-returns-check": "error",
      "jsdoc/require-description-complete-sentence": "warn",
      "jsdoc/no-empty-description": "off",
      "jsdoc/newline-after-description": "off",
    },
    plugins: { "react-hooks": reactHooks },
  },

  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier",
    "plugin:react-hooks/recommended",
    "plugin:jsdoc/recommended",
  ),

  globalIgnores(["src/hooks/", "src/components/ui/"]),
]);
