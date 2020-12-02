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
    "image": "THUMBNAIL_IMAGE_URL",
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

Demo: https://bramaudi.github.io/tools/fbdown
