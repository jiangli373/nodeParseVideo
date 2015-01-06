/**
 * Created by jiangli on 15/1/6.
 */


"use strict";

var youku = require('./core/youku.js');
var iqiyi = require('./core/iqiyi.js');

/**
 *
 * @param callback  第一个参数是回掉函数，必填
 * @param url     视频地址，非必填，如果不填，运行时需要提供视频地址
 */
module.exports = function(callback,url){

    var _url = url || process.argv[2];

    if(typeof callback !== 'function'){

       throw "第一个参数是回掉函数";
    }

    if(_url.indexOf('youku.com')>0){

        youku(_url,callback);

    }else if(_url.indexOf('iqiyi.com')>0){

        iqiyi(_url,callback);

    }else{
        callback('暂时只支持优酷和爱奇艺的视频地址');
    }
}

