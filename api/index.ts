import { Application } from "https://deno.land/x/oak/mod.ts";
import { soxa } from 'https://deno.land/x/soxa/mod.ts'

const app = new Application();

app.use(async (ctx) => {

    const url = await ctx.request.url.searchParams.get('url');
    const result = url ? await soxa.get(url) : '';

    let body = JSON.stringify({
        error: true,
        message: 'URL parameter is empty'
    })

    if (result) {
        const match = /<script(.*?)>([{}].*?)<\/script>/g.exec(result.data);
        body = match?.[2]
            ? JSON.stringify({
                error: false,
                message: 'Success get content',
                ...JSON.parse(match?.[2])
            })
            : JSON.stringify({
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
