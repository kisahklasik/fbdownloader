import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { soxa } from 'https://deno.land/x/soxa/mod.ts'

const router = new Router()
router.get('/', async (ctx) => {
    const url = await ctx.request.url.searchParams.get('url');
    const result = url ? await soxa.get(url) : '';
    let body = JSON.stringify({
        error: true,
        message: 'URL is empty'
    })
    if (result) {
        const match = /<script(.*?)>([{}].*?)<\/script>/g.exec(result.data);
        body = match?.[2]
            ? JSON.stringify({
                error: false,
                message: 'Success get content.',
                ...JSON.parse(match?.[2])
            })
            : JSON.stringify({
                error: true,
                message: 'Can\'t found content'
            })
    }
    ctx.response.headers = new Headers({
        'Accept': 'application/json',
        'Content-type': 'application/json'
    })
    ctx.response.body = body
});

const app = new Application();
app.use(oakCors())
app.use(router.routes())

export default app.handle
