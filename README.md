# fbdown

Facebook Video Downloader API built with NodeJS & Puppeteer.

``` bash
curl https://fbdown.vercel.app/api/get?url=<URL_VIDEO>
```

Response:

``` json
{
    "hd": "https://video-sjc3-1.xx.fbcdn.net/o1/v/t2/f1/m69/GD_OjR...",
    "sd": "https://video-sjc3-1.xx.fbcdn.net/v/t42.1790-2/43140224...",
}
```

## Disclaimer

The facebook video url must public accessible and not private to get it work.