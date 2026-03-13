const { spawn } = require('child_process')
const path = require('path')

// Hostinger Node.js entry point — delegates to `next start`
process.env.NODE_ENV = 'production'

const port = process.env.PORT || 3000
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next')

console.log(`> Starting Next.js on port ${port}...`)

const child = spawn(nextBin, ['start', '-p', String(port)], {
  cwd: __dirname,
  env: { ...process.env },
  stdio: 'inherit',
  shell: true
})

child.on('close', (code) => {
  process.exit(code ?? 1)
})
