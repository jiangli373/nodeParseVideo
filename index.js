/**
 * Created by jiangli on 15/1/6.
 */


"use strict";

var youku = require('./lib/youku.js');
var iqiyi = require('./lib/iqiyi.js');
//var iqiyimp4 = require('./lib/iqiyimp4.js');

var iqiyimp4 = require('./lib/anotheriqiyimp4.js');

var souhu = require('./lib/souhu.js');

/**
 * @param url     视频地址，，运行时需要提供视频地址  必填
 * @param option  选填，这个参数目前只针对爱奇艺的mp4格式
 * @param callback  回掉函数，必填
 *
 */


module.exports = function(url,option,callback){



    if(arguments.length<2){
        throw "参数不正确";
    }

    var isMp4 = false;

    var _url = url;

    if(typeof url !== 'string'|| !isUrl(url)){
        throw "第一个参数需要是正确的地址";
    }

    if(typeof option === 'string'&&option==='MP4'){
        isMp4 = true;
    }

    if(typeof option === 'function'){
        callback = option;
    }



    if(_url.indexOf('youku.com')>0){

        youku(_url,callback);

    }else if(_url.indexOf('iqiyi.com')>0){

        if(isMp4){
            iqiyimp4(_url,callback);
        }else{
            iqiyi(_url,callback);
        }

    }else if(_url.indexOf('sohu.com')>0){

        souhu(_url,callback);

    }else{
        callback('暂时只支持优酷和爱奇艺的视频地址');
    }
}

function isUrl(url){

    return /^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i.test(url);
}