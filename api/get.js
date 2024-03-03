import chrome from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

export default async function handler(request, response) {

    const browser = await puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath(),
        headless: 'new',
        ignoreHTTPSErrors: true
    })

    // Check if url provided and valid
    const {url} = request.query
    if (!url.length) {
        return response.json({
            error: 'The given URL is invalid'
        })
    }

    const page = await browser.newPage()

    // Navigate the page to a URL
    await page.goto(url);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Write html content to file
    const html = await page.content()
    let result = {}

    const hd = html.match('"browser_native_hd_url":"(.*?)"')
    const sd = html.match('"browser_native_sd_url":"(.*?)"')

    if (hd?.length) {
        result = { ...result, hd: (hd[1])
            .replaceAll('\\/', '/')
        }
    }

    if (sd?.length) {
        result = { ...result, sd: (sd[1])
            .replaceAll('\\/', '/')
            .replaceAll('\\u00253D', '=')
        }
    }

    // console.log(result)

    // Vercel allow cors
    response.setHeader('Access-Control-Allow-Credentials', true)
    response.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // response.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    response.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (request.method === 'OPTIONS') {
      response.status(200).end()
      return
    }

    return response.send(result);
}