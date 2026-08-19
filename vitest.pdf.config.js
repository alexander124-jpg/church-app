import base from './vite.config.js'
export default { ...base, test: { ...base.test, include: ['src/**/*.pdf.test.{js,jsx,ts,tsx}'] } }
