/**
 * Created by jiangli on 15/1/6.
 */

"use strict";
var request = require('request');
var crypto = require('crypto');

/**
 * [_parseIqiyi 解析爱奇艺视频]
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
module.exports = function($url,callback){

    $url = $url.replace(/www/,'m'); //这里把地址转换成手机请求的地址，讲www替换成m
    var return_data = "";

    var options = {
        url: $url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3'
        }
    };
    request(options, function(er, response,body) {

        if (er){
            throw er;
        }

        var body = body;
        var result = body.match(/"vid":"(.*?)".*?"vn":(.*?),/g);
        if(result.length>0){
            var r1 = result[0];
            r1 = '{'+r1+'\"blank\"\:0}';
            r1 = JSON.parse(r1);

            var $vid = r1.vid?r1.vid:'';
            var $tvid = r1.tvid?r1.tvid:'';
            var $tvname = r1.vn?r1.vn:'';

            if($vid!==''&&$tvid!==''){
                iqiyiParseFlv2($tvid,$vid,$tvname,callback);
            }else{
                return_data = "";
            }
        }

    });
    return return_data;
}



function md5(str){
    var shasum = crypto.createHash('md5');
    shasum.update(str);
    return  shasum.digest('hex');
}

function utf8_encode(argString) {
    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
};


function calenc($tvId,$enc_key,$deadpara){
    return md5($enc_key+$deadpara+$tvId);
}

function calauthKey($tvId,$deadpara){
    return md5(""+$deadpara+$tvId);
}


function calmd($t,$fileId){

    var $local3 = ")(*&^flash@#$%a";
    var $local4 = Math.floor(($t / (600)));
    return md5($local4+$local3+$fileId);
}

function getVrsEncodeCode($_arg1){
    var $_local6;
    var $_local2 = "";
    var $_local3 = $_arg1.split('-');
    var $_local4 = $_local3.length;

    var $_local5 = ($_local4 - 1);

    while ($_local5 >= 0) {
        $_local6 = getVRSXORCode(parseInt($_local3[(($_local4 - $_local5) - 1)], 16), $_local5);
        $_local2 = String.fromCharCode($_local6)+$_local2;
        $_local5--;
    };
    return $_local2;
}
function getVRSXORCode($_arg1, $_arg2){

    var $_local3 = ($_arg2 % 3);
    if ($_local3 == 1){
        return (($_arg1 ^ 121));
    };
    if ($_local3 == 2){
        return (($_arg1 ^ 72));
    };
    return (($_arg1 ^ 103));
}


/**
 * [parseFlv2 解析网站flv格式的视频,第二种方法]
 * @param  [type] $tvid [description]
 * @param  [type] $vid  [description]
 * @return [type]       [description]
 */
function iqiyiParseFlv2($tvid,$vid,$tvname,callback){

    var  $deadpara = 1000;
    var  $enc_key =  "ts56gh";

    var $api_url = "http://cache.video.qiyi.com/vms?key=fvip&src=1702633101b340d8917a69cf8a4b8c7c";
     $api_url = $api_url+"&tvId="+$tvid+"&vid="+$vid+"&vinfo=1&tm="+$deadpara+"&enc="+calenc($tvid,$enc_key,$deadpara)+"&qyid=08ca8cb480c0384cb5d3db068161f44f&&puid=&authKey="+calauthKey($tvid,$deadpara)+"&tn="+Math.random();


    var return_data = "";
    request($api_url, function(er, response,body) {
        if (er)
            return callback(er);

        var body = response.body;

        var $video_datas = JSON.parse(body);

        var $vs = $video_datas.data.vp.tkl[0].vs;    //.data.vp.tkl[0].vs

        var $time_url = "http://data.video.qiyi.com/t?tn="+Math.random();
        request($time_url, function(er, response,body) {
            if (er)
                return callback(er);

            var $time_datas = JSON.parse(body);
            var $server_time = $time_datas.t;

            var $urls_data = {
                '极速':[],
                '流畅':[],
                '高清':[],
                '超清':[],
                '720P':[],
                '1080P':[],
                '4K':[]
            },$data = {};

            if($vs.length>0){
                for(var i=0;i<$vs.length;i++){
                    var $vsi = $vs[i];
                    var $fs = $vsi.fs;

                    $urls_data['seconds'] = $vsi.duration;

                    for(var j=0;j<$fs.length;j++){
                        var $val = $fs[j];

                        var $this_link = $val.l;
                        var $bid = $vsi.bid;
                        if($bid ==  4 || $bid ==  5 || $bid ==  10){
                            $this_link = getVrsEncodeCode($this_link);
                        }
                        var $sp = $this_link.split('/');
                        var $sp_length = $sp.length;

                        var $fileId = $sp[$sp_length-1].split('.')[0];

                        var $this_key = calmd($server_time,$fileId);

                        $this_link = $this_link+'?ran='+$deadpara+'&qyid=08ca8cb480c0384cb5d3db068161f44f&qypid='+$tvid+'_11&retry=1';

                        var $final_url = "http://data.video.qiyi.com/"+$this_key+"/videos"+$this_link;
                        if($bid ==  96)$urls_data['极速'].push($final_url);
                        if($bid ==  1)$urls_data['流畅'].push($final_url);
                        if($bid ==  2)$urls_data['高清'].push($final_url);
                        if($bid ==  3)$urls_data['超清'].push($final_url);
                        if($bid ==  4)$urls_data['720P'].push($final_url);
                        if($bid ==  5)$urls_data['1080P'].push($final_url);
                        if($bid ==  10)$urls_data['4K'].push($final_url);

                    }
                }
                $urls_data['title'] = $tvname;
                return callback(null,$urls_data);
            }else{
                return callback(null,null);
            }
        });
    });
}