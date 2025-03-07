import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  rules: {
    'react-refresh/only-export-components': 'off',
    'react-dom/no-dangerously-set-innerhtml': 'off',
  },
})
