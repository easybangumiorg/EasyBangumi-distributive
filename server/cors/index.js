

module.exports = {
    option: (req, res) => {
        res.setHeader("access-control-allow-origin", "*");
        res.setHeader("access-control-allow-methods", "*");
        res.setHeader(
            "access-control-allow-headers",
            "--raw-info,--level,--url,--referer,--cookie,--origin,--ext,--aceh,--ver,--type,--mode,accept,accept-charset,accept-encoding,accept-language,accept-datetime,authorization,cache-control,content-length,content-type,date,if-match,if-modified-since,if-none-match,if-range,if-unmodified-since,max-forwards,pragma,range,te,upgrade,upgrade-insecure-requests,x-requested-with,chrome-proxy,purpose"
        );
        res.setHeader("access-control-max-age", 1728000);
        res.status(204).end();
    },
    all: (req, res, next) => {
        res.setHeader("access-control-allow-origin", "*");
        res.setHeader("access-control-allow-methods", "*");
        res.setHeader(
            "access-control-allow-headers",
            "--raw-info,--level,--url,--referer,--cookie,--origin,--ext,--aceh,--ver,--type,--mode,accept,accept-charset,accept-encoding,accept-language,accept-datetime,authorization,cache-control,content-length,content-type,date,if-match,if-modified-since,if-none-match,if-range,if-unmodified-since,max-forwards,pragma,range,te,upgrade,upgrade-insecure-requests,x-requested-with,chrome-proxy,purpose"
        );
        res.setHeader("access-control-max-age", 1728000);
        next()
    }
}