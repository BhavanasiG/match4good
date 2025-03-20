import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
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
    },
    plugins: { "react-hooks": reactHooks },
  },

  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:react-hooks/recommended"
  ),
];

export default eslintConfig;
