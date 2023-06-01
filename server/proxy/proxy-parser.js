

module.exports = (req, res, next) => {
    delete req.headers.host;
    res.locals.proxy_info = {
        method: req.method,
        headers: req.headers
    };
    if (Buffer.isBuffer(req.body)) {
        res.locals.proxy_info.body = req.body;
    }
    
    for (let key in req.headers) {
        _key = key.substring(2);
        if (key.substring(0, 2) !== "--") continue;
        else if (key === "ext") {
            ext_hdrs = JSON.parse(req.headers[key]);
            for (let exth in ext_hdrs) {
                res.locals.proxy_info.headers[exth] = ext_hdrs[exth];
            }
        } else {
            res.locals.proxy_info.headers[_key] = req.headers[key];
        }
    }

    if ('url' in req.query) {
        const query_url = Buffer.from(req.query['url'], 'base64url').toString('ascii')

        if (query_url)
            res.locals.proxy_info.url = query_url
    }

    next();
}