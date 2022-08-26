import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

app.use(async (ctx) => {
    
    // Set header to use Nokia Browser User-Agent
    const config = {
        headers: {
            'User-Agent': 'UCWEB/2.0 (Symbian; U; S60 V3; en-US; NokiaE63) U2/1.0.0 UCBrowser/9.2.0.336 U2/1.0.0 Mobile'
        }
    }

    const url = await ctx.request.url.searchParams.get('url');
    const result = url ? await fetch(url, config).then(res => res.text()) : '';

    let body = JSON.stringify({
        error: true,
        message: 'URL parameter is empty'
    })

    const data = await result

    if (data) {

        const title = /<title>(.*?)<\/title>/.exec(data)
        const video = /\/video_redirect\/\?src=(.*?)"/.exec(data)

        try {
            
            if (video?.[1]) {

                body = JSON.stringify({
                    error: false,
                    message: 'Success get content',
                    title: title?.[1],
                    url: video?.[1] ? decodeURIComponent(video?.[1]).replace(/&amp;/g, '&') : ''
                })

            } else {

                throw new Error('Can\'t found content');
                
            }

        } catch (error) {
            
            body = JSON.stringify({
                error: true,
                message: error.message
            })

        }

    } else {

        body = JSON.stringify({
            error: true,
            message: 'Can\'t found content'
        })

    }

    ctx.response.headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    })

    ctx.response.body = body

});

// Local server
console.log('Serving on http://localhost:8000')
await app.listen({ port: 8000 });

// Vercel function
export default app.handle
