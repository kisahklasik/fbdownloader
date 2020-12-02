import { Application } from "https://deno.land/x/oak/mod.ts";
import { soxa } from 'https://deno.land/x/soxa/mod.ts'

const app = new Application();

app.use(async (ctx) => {

    const config = {
        headers: {
            'User-Agent': 'Opera/9.80 (Android; Opera Mini/12.0.1987/37.7327; U; pl) Presto/2.12.423 Version/12.16'
        }
    }
    const url = await ctx.request.url.searchParams.get('url');
    const result = url ? await soxa.get(url, config) : '';

    let body = JSON.stringify({
        error: true,
        message: 'URL parameter is empty'
    })

    const { data } = result

    if (data) {
        
        const match = /<script(.*?)>([{}].*?)<\/script>/g.exec(data);

        if (match?.[2]) {

            const output = JSON.parse(match?.[2])
            body = JSON.stringify({
                error: false,
                message: 'Success get content',
                title: output?.name,
                image: output?.thumbnailUrl,
                url: output?.contentUrl
            })

        } else {
            
            const title = /<title>(.*?)<\/title>/.exec(data)
            const image = /<meta.?property="og:image".?content="(.*?)".?\/>/.exec(data)
            const video = /<meta.?property="og:video".?content="(.*?)".?\/>/.exec(data)

            try {
                
                body = JSON.stringify({
                    error: false,
                    message: 'Success get content',
                    title: title?.[1],
                    image: image?.[1],
                    url: video?.[1]
                })

            } catch (error) {
                
                body = JSON.stringify({
                    error: true,
                    message: 'Can\'t found content'
                })

            }
        }
    }

    ctx.response.headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    })

    ctx.response.body = body

});

export default app.handle
