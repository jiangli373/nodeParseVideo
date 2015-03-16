/**
 * Created by jiangli on 15/3/16.
 */


"use strict";
var request = require('request');
var btoa = require('btoa');
var atob = require('atob');
var url = require('url');
/**
 * [_parseIqiyi 解析爱奇艺视频]mp4格式
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
module.exports = function($url,callback){

    $url = $url.replace(/www/,'m');
    var return_data = "";

    var options = {
        url: $url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3'
        }
    };
    request(options, function(er, response,body) {

        if (er){
            return callback(er);
        }

        var body = body;
        var result = body.match(/"vid":"(.*?)".*?"vn":(.*?),/g);
        if(result.length>0){
            var r1 = result[0];
            r1 = '{'+r1+'\"blank\"\:0}';
            r1 = JSON.parse(r1);

            var $vid = r1.vid?r1.vid:'';
            var $tvid = r1.tvid?r1.tvid:'';

            if($vid!==''&&$tvid!==''){

                iqiyiParseFlv2($tvid,$vid, function (err,data) {
                    if(data&&data.mp4){

                        return callback(null,{'mp4':data['mp4']});
                    }else{
                        return callback(null,null);
                    }
                });

            }else{
                return callback(null,null);
            }
        }
    });
}





var Q = {};
Q.PageInfo = Q.PageInfo || {};
Q.PageInfo.cname = "";
Q.PageInfo.page = "play";
Q.PageInfo.playInfo = {

};
var _0 = ["fromCharCode", "", "length", "charCodeAt", "random", "floor", "cache", "undefined", "PageInfo", "substr",
    //
    "height", "orientation", "width", "devicePixelRatio", "round", "screenTop", "outerHeight", "_",

    "localStorage", "iqiyi", "getItem", "startTime", "removeItem", "setItem", "referrer", "baidu.com",

    "indexOf", "UCW", "_boluoWebView", "BOL",

    "TURVek1EYzJOZz09TWpnMk1qYzFPREppTWpGak5UZzVNVFJtWmpGa1lUWmtNZz09",

    "push", "getTime", "sin", "abs", "function%20javaEnabled%28%29%20%7B%20%5Bnative%20code%5D%20%7D",

    "null", "WebkitAppearance", "style", "documentElement", "javaEnabled", "sgve", "sijsc", "d", "jc",

    "md", "join", "URL", ";", ";&tim=", "__jsT", "t", "__refI", "sc", "src", "d846d0c32d664d32b6b54ea48997a589",

    "qd_jsin", "qd_wsz", "jfakmkafklw23321f4ea32459", "__ctmM", "__sigC", "__cliT", "h5"];

function weorjjigh(e, n, t, a, r, o) {
    function i(e, n) {
        return ((e >> 1) + (n >> 1) << 1) + (1 & e) + (1 & n)
    }
    function c(e, n, t, a) {
        e > 0 && 5 > e ? t >= 0 ? p << 6 > n ? (a = [a[3], i(a[1], (x = i(i(a[0], [a[1] & a[2] | ~a[1] & a[3], a[3] & a[1] | ~a[3] & a[2], a[1] ^ a[2] ^ a[3], a[2] ^ (a[1] | ~a[3])][y = t >> 4]), i(j(m(t + 1)) * _ | 0, B[[t, 5 * t + 1, 3 * t + 5, 7 * t][y] % 16 + (n++ >>> 6)]))) << (y = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * y + t % 4]) | x >>> 32 - y), a[1], a[2]], 63 & n ? c(e, n, 63 & n, a) : (A = [i(a[0], A[0]), i(a[1], A[1]), i(a[2], A[2]), i(a[3], A[3])], c(e, n + 960, 63 & n, A))) : (B = [], p = "") : C ? c(12, n, 0, "1330848328159996040014666388890612187513113019274921193194001265062984") : c(13, n, 0, "03603482862038069294069554231005389970290678182205184924421910467011111731869494") : e > 6 && 10 > e ? (e = atob(unescape(a)), t < e.length ? (B[n >> 2] |= e.charCodeAt(t++) << 8 * (n % 4), c(9, ++n, t, M)) : (d(String.fromCharCode(81)) && (B[n >> 2] |= 1 << (n % 4 << 3) + 7), B[p = (n + 8 >> 6 << 4) + 14] = n << 3, c(3, 0, 0, A))) : e > 11 && 15 > e && (t < (a.length << 1) / 5 ? (B[n >> 2] |= (parseInt(a.substr(10 * (t >> 2), 10), 10) >> (3 - (3 & t) << 3) & 255 ^ (a.length << 1) / 5 - t++) << ((3 & n++) << 3), c(14, n, t, a)) : c(7, n, 0, M))
    }
    function d(e) {
        return "undefined" != typeof eval(e)
    }
    var u = 667,
        h = 320,
        s = 0;
    (90 === s || -90 === s) && (u = u > h ? h : u);
    var f = 1;
    u = Math.round(u / f);
    var w = Math.round(0 / f),
        b = Math.round(667 / f),
        v = u - b - w,
        g = btoa(w + "_" + v),
        l = "",
        _ = 4294967296,
        j = Math.abs,
        m = Math.sin,
        p = "";
    //d("ucweb") && (p = null, p && p.indexOf("baidu.com") >= 0 || (l += btoa("UCW"))),
        l += d("_0") ? (l ? "_" : "") + btoa("BOL") : "";
    var C = n,
        M = e,
        T = 7,
        k = {},
        R = (new Date).getTime();
    k.cache = (n ? o + "" + r : R - T) + "",
        M = escape(btoa(M)),
        k.cache = escape(btoa(C ? k.cache + a + "" + t : k.cache));
    var x, y, A = [x = 1732584193, y = -271733879, ~x, ~y],
        B = [],
        D = function () {
            for (p = atob(unescape(k.cache)), y = 0; y < p.length;) B[y >> 2] |= p.charCodeAt(y) << 8 * (y++ % 4);
            for (c(1, y, -1, B), x = 0; 32 > x;) p += (A[x >> 3] >> 4 * (1 ^ 7 & x++) & 15).toString(16);
            return p
        },
        E = function () {
            var e = "function%20javaEnabled%28%29%20%7B%20%5Bnative%20code%5D%20%7D",
                n = "null";
            return n = "sijsc",
                n
        };
    if (n) {
        var I = {};c
        return I.md = D,
           I.jc = E,
            I.d = R,
            I
    }
    var S = D();
    if (S.length > 4) {
        var U = "";
        U += "http://www.iqiyi.com" + ";1;&tim=" + R,
            U = encodeURIComponent(U);
        var W = {};
        return W.src = "d846d0c32d664d32b6b54ea48997a589",
            W.sc = S,
            W.__refI = U,
        l && (W.qd_jsin = l),
        g && (W.qd_wsz = g),
            W.t = R - 7,
            W.__jsT = E(),
            W
    }
}


function iqiyiParseFlv2($tvid,$vid,callback){


    var static_ip = ['114.80.196.201'];    //目前测试通过的可以播放的静态ip地址
    var h = weorjjigh($tvid);
    var $api_url = 'http://cache.m.iqiyi.com/jp/tmts';
    $api_url = $api_url+'/'+$tvid+'/'+$vid+'/?uid=&cupid=qc_100001_100102&platForm=h5&qyid=80f752d14113d33b394d1390e615e9ba&type=mp4&rate=1&src='+h.src+'&sc='+ h.sc+'&t='+ h.t+
    '&__refI='+ h.__refI+'&qd_wsz='+ h.qd_wsz+'&__jsT='+ h.__jsT;

    var return_data  = {
        'mp4':[]
    };
    request($api_url, function(er, response,body) {
        if (er)
            return callback(er);

        var body = body;

        var $video_datas = JSON.parse(body.replace(/var tvInfoJs=/,''));

        if($video_datas.data&&$video_datas.data.m3u){
            var m3u = $video_datas.data.m3u;

            if(m3u.indexOf(static_ip[0])<0){  //初步怀疑爱奇艺这个服务器有问题,如果是这个ip的话，切换到一个新的ip上去
               var parse_m3u =  url.parse(m3u);
                parse_m3u.host = static_ip[0];
                parse_m3u.hostname = static_ip[0];
                m3u = url.format(parse_m3u);
            }
            return_data['mp4'].push(m3u);
        }
        return callback(null,return_data);
    });
}