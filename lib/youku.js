/**
 * Created by jiangli on 15/1/6.
 */
"use strict";

var request = require('request');
var iconv = require('iconv-lite');
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
/**
 * [_parseYouku 解析优酷网]
 * @param  [type] $url [description]
 * @return [type]      [description]
 */

module.exports = function($url,callback){

    var $matches  = $url.match(/id\_([\w=]+)/);

    if ($matches&&$matches.length>1){

        return _getYouku($matches[1].trim(),callback);

    }else{
        return null;
    }
}


function _getYouku($vid,callback){

    var $base = "http://v.youku.com/player/getPlaylist/VideoIDS/";
    var $blink = $base+$vid;
    var $link = $blink+"/Pf/4/ctype/12/ev/1";
    request($link, function(er, response,body) {
        if (er)
            return callback(er);

        var $retval = body;

        if($retval){

            var $rs = JSON.parse($retval);

            request($blink, function(er, response,body) {
                if (er)
                    return callback(er);
                var $data = {
                    '1080Phd3':[],
                    '超清hd2':[],
                    '高清mp4':[],
                    '高清flvhd':[],
                    '标清flv':[],
                    '高清3gphd':[],
                    '3gp':[]
                };

                var $bretval = body;
                var $brs = JSON.parse($bretval);

                var $rs_data = $rs.data[0];
                var $brs_data = $brs.data[0];

                if($rs_data.error){
                    return callback(null, $data['error'] = $rs_data.error);
                }


                var $streamtypes = $rs_data.streamtypes;  //可以输出的视频清晰度

                var $streamfileids = $rs_data.streamfileids;
                var $seed = $rs_data.seed;
                var $segs = $rs_data.segs;
                var $ip = $rs_data.ip;
                var $bsegs =  $brs_data.segs;

                var yk_e_result = yk_e('becaf9be', yk_na($rs_data.ep)).split('_');
                var $sid = yk_e_result[0], $token = yk_e_result[1];
                for(var $key in $segs){

                    if(in_array($key,$streamtypes)){
                        var $segs_key_val = $segs[$key];

                        for(var kk=0;kk<$segs_key_val.length;kk++){
                            var $v = $segs_key_val[kk];
                            var $no = $v.no.toString(16).toUpperCase(); //转换为16进制 大写

                            if($no.length == 1){
                                $no ="0"+$no;  //no 为每段视频序号
                            }
                            //构建视频地址K值
                            var $_k = $v.k;
                            if ((!$_k || $_k == '') || $_k == '-1') {
                                $_k = $bsegs[$key][kk].k;
                            }
                            var $fileId = getFileid($streamfileids[$key],$seed);
                            $fileId = $fileId.substr(0,8)+$no+$fileId.substr(10);
                            var m0 = yk_e('bf7e5f01', $sid + '_' + $fileId + '_' + $token);
                            var m1  = yk_d(m0);
                            var iconv_result = iconv.decode(new Buffer(m1), 'UTF-8');

                            if(iconv_result!=""){
                                var $ep = urlencode(iconv_result);

                                var $typeArray = [];
                                $typeArray['flv']= 'flv';
                                $typeArray['mp4']= 'mp4';
                                $typeArray['hd2']= 'flv';
                                $typeArray['3gphd']= 'mp4';
                                $typeArray['3gp']= 'flv';
                                $typeArray['hd3']= 'flv';

                                //判断视频清晰度
                                var $sharpness = []; //清晰度 数组
                                $sharpness['flv']= '标清flv';
                                $sharpness['flvhd']= '高清flvhd';
                                $sharpness['mp4']= '高清mp4';
                                $sharpness['hd2']= '超清hd2';
                                $sharpness['3gphd']= '高清3gphd';
                                $sharpness['3gp']= '3gp';
                                $sharpness['hd3']= '1080Phd3';
                                var $fileType = $typeArray[$key];
                                $data[$sharpness[$key]][kk] = "http://k.youku.com/player/getFlvPath/sid/"+$sid+"_00/st/"+$fileType+"/fileid/"+$fileId+"?K="+$_k+"&hd=1&myp=0&ts="+((((($v['seconds']+'&ypp=0&ctype=12&ev=1&token=')+$token)+'&oip=')+$ip)+'&ep=')+$ep;
                            }
                        }
                    }
                }
                //返回 图片 标题 链接  时长  视频地址
                $data['coverImg'] = $rs['data'][0]['logo'];
                $data['title'] = $rs['data'][0]['title'];
                $data['seconds'] = $rs['data'][0]['seconds'];
                return callback(null,$data);
            });
        }else{
            return callback(null,null);
        }
    })

}
function urlencode(str) {
    str = (str + '').toString();

    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
};

function in_array(needle, haystack, argStrict) {
    var key = '',
        strict = !! argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
};


//start 获得优酷视频需要用到的方法
function getSid(){

    var $sid = new Date().getTime()+(Math.random() * 9001+10000);
    return $sid;
}

function getKey($key1,$key2){
    var $a = parseInt($key1,16);
    var $b = $a ^0xA55AA5A5;
    var $b = $b.toString(16);
    return $key2+$b;
}

function getFileid($fileId,$seed){
    var $mixed = getMixString($seed);
    var $ids = $fileId.replace(/(\**$)/g, "").split('*'); //去掉末尾的*号分割为数组
    var $realId = "";
    for (var $i=0;$i<$ids.length;$i++){
        var $idx = $ids[$i];
        $realId += $mixed.substr($idx,1);
    }
    return $realId;
}

function getMixString($seed){
    var $mixed = "";
    var $source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
    var $len = $source.length;
    for(var $i=0;$i<$len;$i++){
        $seed = ($seed * 211 + 30031)%65536;
        var $index = ($seed / 65536 * $source.length);
        var $c = $source.substr($index,1);
        $mixed += $c;
        $source = $source.replace($c,"");
    }
    return $mixed;
}
function yk_d($a){

    if (!$a) {
        return '';
    }
    var $f = $a.length;
    var $b = 0;
    var $str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (var $c = ''; $b < $f;) {
        var $e = charCodeAt($a, $b++) & 255;
        if ($b == $f) {
            $c += charAt($str, $e >> 2);
            $c += charAt($str, ($e & 3) << 4);
            $c += '==';
            break;
        }
        var $g = charCodeAt($a, $b++);
        if ($b == $f) {
            $c += charAt($str, $e >> 2);
            $c += charAt($str, ($e & 3) << 4 | ($g & 240) >> 4);
            $c += charAt($str, ($g & 15) << 2);
            $c += '=';
            break;
        }
        var $h = charCodeAt($a, $b++);
        $c += charAt($str, $e >> 2);
        $c += charAt($str, ($e & 3) << 4 | ($g & 240) >> 4);
        $c += charAt($str, ($g & 15) << 2 | ($h & 192) >> 6);
        $c += charAt($str, $h & 63);
    }
    return $c;
}
function yk_na($a){
    if (!$a) {
        return '';
    }
    var $sz = '-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1';
    var $h = $sz.split(',');
    var $i = $a.length;
    var $f = 0;
    for (var $e = ''; $f < $i;) {
        var $c;
        do {
            $c = $h[charCodeAt($a, $f++) & 255];
        } while ($f < $i && -1 == $c);

        if (-1 == $c) {
            break;
        }
        var $b;
        do {
            $b = $h[charCodeAt($a, $f++) & 255];
        } while ($f < $i && -1 == $b);
        if (-1 == $b) {
            break;
        }
        $e += String.fromCharCode($c << 2 | ($b & 48) >> 4);
        do {
            $c = charCodeAt($a, $f++) & 255;
            if (61 == $c) {
                return $e;
            }
            $c = $h[$c];
        } while ($f < $i && -1 == $c);
        if (-1 == $c) {
            break;
        }
        $e += String.fromCharCode(($b & 15) << 4 | ($c & 60) >> 2);
        do {
            $b = charCodeAt($a, $f++) & 255;
            if (61 == $b) {
                return $e;
            }
            $b = $h[$b];
        } while ($f < $i && -1 == $b);
        if (-1 == $b) {
            break;
        }
        $e += String.fromCharCode(($c & 3) << 6 | $b);
    }
    return $e;
}
function yk_e($a, $c){

    var $b = [];
    for (var $f = 0, $i, $e = '', $h = 0; 256 > $h; $h++) {
        $b[$h] = $h;
    }
    for ($h = 0; 256 > $h; $h++) {
        $f = (($f + $b[$h]) + charCodeAt($a, $h % $a.length)) % 256;
        $i = $b[$h];
        $b[$h] = $b[$f];
        $b[$f] = $i;
    }
    for (var $q = ($f = ($h = 0)); $q < $c.length; $q++) {
        $h = ($h + 1) % 256;
        $f = ($f + $b[$h]) % 256;
        $i = $b[$h];
        $b[$h] = $b[$f];
        $b[$f] = $i;
        $e += String.fromCharCode(charCodeAt($c, $q) ^ $b[($b[$h] + $b[$f]) % 256]);
    }
    return $e;
}


function md5(str){
    var shasum = crypto.createHash('md5');
    shasum.update(str);
    return  shasum.digest('hex');

}

function charCodeAt($str, $index){
    var $charCode = [];
    var $key = md5($str);
    $index = $index + 1;
    if ($charCode[$key]) {
        return $charCode[$key][$index];
    }
    $charCode[$key] = unpack('C*', $str);

    return $charCode[$key][$index];
}

function charAt($str, $index){
    return $str.substr($index, 1);
}

function unpack(format, data) {
    var formatPointer = 0, dataPointer = 0, result = {}, instruction = '',
        quantifier = '', label = '', currentData = '', i = 0, j = 0,
        word = '', fbits = 0, ebits = 0, dataByteLength = 0;

    var fromIEEE754 = function(bytes, ebits, fbits) {
        // Bytes to bits
        var bits = [];
        for (var i = bytes.length; i; i -= 1) {
            var m_byte = bytes[i - 1];
            for (var j = 8; j; j -= 1) {
                bits.push(m_byte % 2 ? 1 : 0); m_byte = m_byte >> 1;
            }
        }
        bits.reverse();
        var str = bits.join('');

        // Unpack sign, exponent, fraction
        var bias = (1 << (ebits - 1)) - 1;
        var s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
        var e = parseInt(str.substring(1, 1 + ebits), 2);
        var f = parseInt(str.substring(1 + ebits), 2);

        // Produce number
        if (e === (1 << ebits) - 1) {
            return f !== 0 ? NaN : s * Infinity;
        }
        else if (e > 0) {
            return s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits));
        }
        else if (f !== 0) {
            return s * Math.pow(2, -(bias-1)) * (f / Math.pow(2, fbits));
        }
        else {
            return s * 0;
        }
    }

    while (formatPointer < format.length) {
        instruction = format.charAt(formatPointer);

        // Start reading 'quantifier'
        quantifier = '';
        formatPointer++;
        while ((formatPointer < format.length) &&
        (format.charAt(formatPointer).match(/[\d\*]/) !== null)) {
            quantifier += format.charAt(formatPointer);
            formatPointer++;
        }
        if (quantifier === '') {
            quantifier = '1';
        }


        // Start reading label
        label = '';
        while ((formatPointer < format.length) &&
        (format.charAt(formatPointer) !== '/')) {
            label += format.charAt(formatPointer);
            formatPointer++;
        }
        if (format.charAt(formatPointer) === '/') {
            formatPointer++;
        }

        // Process given instruction
        switch (instruction) {
            case 'a': // NUL-padded string
            case 'A': // SPACE-padded string
                if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }
                currentData = data.substr(dataPointer, quantifier);
                dataPointer += quantifier;
                var currentResult;
                if (instruction === 'a') {
                    currentResult = currentData.replace(/\0+$/, '');
                } else {
                    currentResult = currentData.replace(/ +$/, '');
                }
                result[label] = currentResult;
                break;

            case 'h': // Hex string, low nibble first
            case 'H': // Hex string, high nibble first
                if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }
                currentData = data.substr(dataPointer, quantifier);
                dataPointer += quantifier;

                if (quantifier > currentData.length) {
                    throw new Error('Warning: unpack(): Type ' + instruction +
                    ': not enough input, need ' + quantifier);
                }

                currentResult = '';
                for (i = 0; i < currentData.length; i++) {
                    word = currentData.charCodeAt(i).toString(16);
                    if (instruction === 'h') {
                        word = word[1] + word[0];
                    }
                    currentResult += word;
                }
                result[label] = currentResult;
                break;

            case 'c': // signed char
            case 'C': // unsigned c
                if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier);
                dataPointer += quantifier;

                for (i = 0; i < currentData.length; i++) {
                    currentResult = currentData.charCodeAt(i);
                    if ((instruction === 'c') && (currentResult >= 128)) {
                        currentResult -= 256;
                    }
                    result[label + (quantifier > 1 ?
                        (i + 1) :
                        '')] = currentResult;
                }
                break;

            case 'S': // unsigned short (always 16 bit, machine byte order)
            case 's': // signed short (always 16 bit, machine byte order)
            case 'v': // unsigned short (always 16 bit, little endian byte order)
                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 2;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 2);
                dataPointer += quantifier * 2;

                for (i = 0; i < currentData.length; i += 2) {
                    // sum per word;
                    currentResult = ((currentData.charCodeAt(i + 1) & 0xFF) << 8) +
                    (currentData.charCodeAt(i) & 0xFF);
                    if ((instruction === 's') && (currentResult >= 32768)) {
                        currentResult -= 65536;
                    }
                    result[label + (quantifier > 1 ?
                        ((i / 2) + 1) :
                        '')] = currentResult;
                }
                break;

            case 'n': // unsigned short (always 16 bit, big endian byte order)
                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 2;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 2);
                dataPointer += quantifier * 2;

                for (i = 0; i < currentData.length; i += 2) {
                    // sum per word;
                    currentResult = ((currentData.charCodeAt(i) & 0xFF) << 8) +
                    (currentData.charCodeAt(i + 1) & 0xFF);
                    result[label + (quantifier > 1 ?
                        ((i / 2) + 1) :
                        '')] = currentResult;
                }
                break;

            case 'i': // signed integer (machine dependent size and byte order)
            case 'I': // unsigned integer (machine dependent size & byte order)
            case 'l': // signed long (always 32 bit, machine byte order)
            case 'L': // unsigned long (always 32 bit, machine byte order)
            case 'V': // unsigned long (always 32 bit, little endian byte order)
                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 4;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 4);
                dataPointer += quantifier * 4;

                for (i = 0; i < currentData.length; i += 4) {
                    currentResult =
                        ((currentData.charCodeAt(i + 3) & 0xFF) << 24) +
                        ((currentData.charCodeAt(i + 2) & 0xFF) << 16) +
                        ((currentData.charCodeAt(i + 1) & 0xFF) << 8) +
                        ((currentData.charCodeAt(i) & 0xFF));
                    result[label + (quantifier > 1 ?
                        ((i / 4) + 1) :
                        '')] = currentResult;
                }

                break;

            case 'N': // unsigned long (always 32 bit, little endian byte order)
                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 4;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 4);
                dataPointer += quantifier * 4;

                for (i = 0; i < currentData.length; i += 4) {
                    currentResult =
                        ((currentData.charCodeAt(i) & 0xFF) << 24) +
                        ((currentData.charCodeAt(i + 1) & 0xFF) << 16) +
                        ((currentData.charCodeAt(i + 2) & 0xFF) << 8) +
                        ((currentData.charCodeAt(i + 3) & 0xFF));
                    result[label + (quantifier > 1 ?
                        ((i / 4) + 1) :
                        '')] = currentResult;
                }

                break;

            case 'f': //float
            case 'd': //double
                ebits = 8;
                fbits = (instruction === 'f') ? 23 : 52;
                dataByteLength = 4;
                if (instruction === 'd') {
                    ebits = 11;
                    dataByteLength = 8;
                }

                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / dataByteLength;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * dataByteLength);
                dataPointer += quantifier * dataByteLength;

                for (i = 0; i < currentData.length; i += dataByteLength) {
                    data = currentData.substr(i, dataByteLength);

                    var bytes = [];
                    for (j = data.length - 1; j >= 0; --j) {
                        bytes.push(data.charCodeAt(j));
                    }
                    result[label + (quantifier > 1 ?
                        ((i / 4) + 1) :
                        '')] = fromIEEE754(bytes, ebits, fbits);
                }

                break;

            case 'x': // NUL byte
            case 'X': // Back up one byte
            case '@': // NUL byte
                if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                if (quantifier > 0) {
                    if (instruction === 'X') {
                        dataPointer -= quantifier;
                    } else {
                        if (instruction === 'x') {
                            dataPointer += quantifier;
                        } else {
                            dataPointer = quantifier;
                        }
                    }
                }
                break;

            default:
                throw new Error('Warning:  unpack() Type ' + instruction +
                ': unknown format code');
        }
    }
    return result;
}