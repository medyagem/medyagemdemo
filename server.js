const path = require('path')
const fs = require('fs')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

process.env.NODE_ENV = 'production'

const port = process.env.PORT || 3000
const dir = path.resolve(__dirname)
const app = next({ dev: false, dir })
const handle = app.getRequestHandler()

const MIME = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
}

function tryServeFile(filePath, res) {
  if (!fs.existsSync(filePath)) return false
  const ext = path.extname(filePath).toLowerCase()
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  fs.createReadStream(filePath).pipe(res)
  return true
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Serve built static files (CSS, JS, fonts, images)
      if (pathname.startsWith('/_next/static/')) {
        const rel = pathname.slice('/_next/static/'.length)
        const filePath = path.join(dir, '.next', 'static', rel)
        if (tryServeFile(filePath, res)) return
      }

      // Serve public directory files
      if (!pathname.startsWith('/_next/') && !pathname.startsWith('/api/')) {
        const publicPath = path.join(dir, 'public', pathname)
        if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
          if (tryServeFile(publicPath, res)) return
        }
      }

      // Everything else goes through Next.js
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
      console.log(`> Ready on http://localhost:${port}`)
    })
})
