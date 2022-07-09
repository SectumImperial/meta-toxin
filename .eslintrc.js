module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  // plugins: ['pug'],
  ignorePatterns: ['webpack.config.js', './dist/', './node_modules'],
  rules: {
  },
};
