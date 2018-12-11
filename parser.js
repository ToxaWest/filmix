const express = require('express'),
    router = express.Router(),
    http = require("http");

router.get('/', function (req, res) {
    let url = req.query.id;
    http.get(url, res2 => {
        if (res2.statusCode === 200) {
            res.json({status: res2.statusCode, url: url, info: res2.headers['last-modified']});
        } else {
            url = url.replace('http://vs1.cdnlast.com', 'http://vs2.cdnlast.com');
            http.get(url, res3 => {
                if (res3.statusCode === 200) {
                    res.json({status: res3.statusCode, url: url, info: res3.headers['last-modified']});
                } else {
                    url = url.replace('http://vs2.cdnlast.com', 'http://vs0.cdnlast.com');
                    http.get(url, res4 => {
                        if (res4.statusCode === 200) {
                            res.json({status: res4.statusCode, url: url, info: res4.headers['last-modified']});
                        } else {
                            url = url.replace('http://vs0.cdnlast.com', 'http://u3.cdnlast.com');
                            http.get(url, res5 => res.json({
                                status: res5.statusCode,
                                url: url,
                                info: res5.headers['last-modified']
                            }))
                        }

                    })
                }
            })
        }
    })
});

module.exports = router;