import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { 
     ignores: ['dist/**','others/**','public/**','build/**','node_modules/**','vite.config.js'], 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"],
     rules: {
      'no-unused-vars': 'off'  // 关闭未使用变量检查
    }
  },
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { 
      globals: globals.browser 
    } 
  },
  {
    // 扩展React推荐配置
    ...pluginReact.configs.flat.recommended,
    // 添加自定义规则
    rules: {
      'react/prop-types': 'off'
    }
  }
]);