
const request = require("request");

module.exports = (req, res) => {
    let req_obj = {
        ...res.locals.proxy_info,
        followRedirect: false
    };

    if ('url' in req_obj && typeof (req_obj.url) === 'string')
        console.log(`proxy ---> ${req_obj.url}`)
    else {
        res.status(502).json({
            code: 502,
            msg: "Error: url is a required argument"
        })
        return
    }

    request(req_obj)
        .on("response", response => {
            let vary = "--url";

            for (let res_hdr in response.headers) {
                // parse header
                let v = response.headers[res_hdr];
                if (
                    res_hdr === "access-control-allow-origin" ||
                    res_hdr === "access-control-expose-headers" ||
                    res_hdr === "location" ||
                    res_hdr === "set-cookie"
                ) {
                    if (Array.isArray(v)) {
                        // add array header
                        for (let i = 1; i <= v.length; i++) {
                            response.headers[`${i}-${res_hdr}`] = v[i - 1];
                        }
                    } else {
                        response.headers[`--${res_hdr}`] = v;
                    }
                    delete response.headers[res_hdr];
                } else if (res_hdr === "vary") {
                    // add vary
                    if (Array.isArray(v)) {
                        vary = vary + "," + v.join(",");
                    } else {
                        vary = vary + "," + v;
                    }
                }
            }

            response.headers["access-control-expose-headers"] = "*";
            response.headers["access-control-allow-origin"] = "*";
            response.headers["--vary"] = vary;
            response.headers["--s"] = response.statusCode;
            delete response.headers["cache-control"];

            response.headers["content-security-policy"] = "";
            response.headers["content-security-policy-report-only"] = "";
            response.headers["x-frame-options"] = "";
        })
        .on("error", e => {
            console.error(e.message);
            res.status(502).json({
                code: 502,
                msg: e.message
            });
        })
        .pipe(res);
}