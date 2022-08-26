# fbdown
Facebook Video Downloader API built with Deno.

``` bash
curl https://fbdown.now.sh/?url=<URL_VIDEO>
```

Response:

*Success*
``` json
{
    "error": false,
    "message": "Success get content",
    "title": "Lorem Ipsum | Facebook",
    "url": "VIDEO_URL"
}
```

*Failed*
``` json
{
    "error": true,
    "message": "Can't found content"
}
```

## How it works

It just open the facebook video page with WAP user agent (i.e. Nokia E63) then parse and find video url, that's it.

## Disclaimer

The facebook video url must public accessible and not private, note that vercel demo site seems blocked by Facebook make it won't work anymore but still work if you run the API locally in your machine.

## Usage

- Install deno
- Run `deno run -A api/index.ts`
- Open `http://localhost:8000/?url=<URL_VIDEO>`