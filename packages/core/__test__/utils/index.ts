import path from 'path'
import http from 'http'
import url from 'url'
import fs from 'fs'
import puppeteer from 'puppeteer'

interface IMimeType {
  [key: string]: string
}

export function startServer(defaultPort = 3030) {
  return new Promise<http.Server>((resolve, reject) => {
    const mimeType: IMimeType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png'
    }

    const s = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url!)
      const sanitizePath = path
        .normalize(parsedUrl.pathname!)
        .replace(/^(\.\.[/\\])+/, '')
      const pathname = path.join(__dirname, '../', sanitizePath)

      try {
        const data = fs.readFileSync(pathname)
        const ext = path.parse(pathname).ext
        res.setHeader('Content-type', mimeType[ext] || 'text/plain')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET')
        res.setHeader('Access-Control-Allow-Headers', 'Content-type')
        setTimeout(() => {
          res.end(data)
        }, 100)
      } catch (error) {
        res.end()
      }
    })
    s.listen(defaultPort)
      .on('listening', () => {
        resolve(s)
      })
      .on('error', e => {
        reject(e)
      })
  })
}

export function getServerURL(server: http.Server): string {
  const address = server.address()
  if (address && typeof address !== 'string') {
    return `http://localhost:${address.port}`
  } else {
    return `${address}`
  }
}

export function replaceLast(str: string, find: string, replace: string) {
  const index = str.lastIndexOf(find)
  if (index === -1) {
    return str
  }
  return str.substring(0, index) + replace + str.substring(index + find.length)
}

export async function launchPuppeteer(
  options?: Parameters<(typeof puppeteer)['launch']>[0]
) {
  return await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: ['--no-sandbox'],
    ...options
  })
}

export function getHtml(fileName: string, code: string) {
  const filePath = path.resolve(__dirname, `../html/${fileName}`)
  const html = fs.readFileSync(filePath, 'utf8')
  return replaceLast(
    html,
    '</body>',
    `
  <script>
    ${code}
  </script>
  </body>
  `
  )
}

export function delay(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}
