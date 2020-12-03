import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (ctx) => {
    
    // Set header to use Nokia Browser User-Agent
    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (SymbianOS/9.2; U; Series60/3.1 NOKIAE63/1.0; Profile/MIDP-2.0 Configuration/CLDC-1.1) AppleWebKit/413 (KHTML, like Gecko) Safari/413'
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
        const video = /\?src=(.*?)['"]/.exec(data)

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

export default app.handle
