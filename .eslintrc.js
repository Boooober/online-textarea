module.exports = {
  extends: [
    'airbnb-typescript/base',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: '.'
  },
  rules: {}
};
