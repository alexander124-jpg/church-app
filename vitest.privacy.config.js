import base from './vite.config.js'
export default { ...base, test: { ...base.test, include: ['src/**/*.privacy.test.{js,jsx,ts,tsx}'] } }
