import config from '@lnu/eslint-config'
import prettier from 'eslint-config-prettier'

/**
 * Remove JSDoc requirements to avoid unnecessary comments. Written by Claude Opus 5.5.
 */
const configWithoutJsdocRules = config.map((entry) => ({
  ...entry,
  rules: Object.fromEntries(
    Object.entries(entry.rules ?? {}).filter(([ruleName]) => !ruleName.startsWith('jsdoc/'))
  ),
}))

export default [...configWithoutJsdocRules, prettier]