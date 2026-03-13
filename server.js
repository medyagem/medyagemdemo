const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

process.env.NODE_ENV = 'production'

const dev = false
const hostname = '0.0.0.0'
const port = process.env.PORT || 3000
const app = next({ dev, hostname, port, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Debug endpoint - visit /_debug to diagnose static file issues
      if (pathname === '/_debug') {
        const nextDir = path.join(__dirname, '.next')
        const staticDir = path.join(nextDir, 'static')
        let buildId = ''
        let staticContents = []
        let cssFiles = []
        let chunkFiles = []

        try { buildId = fs.readFileSync(path.join(nextDir, 'BUILD_ID'), 'utf8').trim() } catch (e) { buildId = 'NOT FOUND: ' + e.message }

        if (fs.existsSync(staticDir)) {
          staticContents = fs.readdirSync(staticDir)
          // Check for CSS
          const cssDir = path.join(staticDir, 'css')
          if (fs.existsSync(cssDir)) {
            cssFiles = fs.readdirSync(cssDir)
          }
          // Check for chunks
          const chunksDir = path.join(staticDir, 'chunks')
          if (fs.existsSync(chunksDir)) {
            chunkFiles = fs.readdirSync(chunksDir).slice(0, 20) // first 20
          }
        }

        const info = {
          cwd: process.cwd(),
          __dirname,
          nodeEnv: process.env.NODE_ENV,
          port,
          nextDirExists: fs.existsSync(nextDir),
          staticDirExists: fs.existsSync(staticDir),
          buildId,
          staticContents,
          cssFiles,
          chunkFiles_first20: chunkFiles,
        }

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(info, null, 2))
        return
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
