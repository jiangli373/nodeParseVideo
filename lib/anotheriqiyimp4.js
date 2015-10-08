/**
 * Created by jiangli on 15/3/16.
 */


"use strict";
var request = require('request');
var btoa = require('btoa');
var atob = require('atob');
var url = require('url');
var cheerio = require('cheerio');
/**
 * [_parseIqiyi 解析爱奇艺视频]mp4格式
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
module.exports = function($url,callback){

    var options = {
        url: $url
    };
    request(options, function(er, response,body) {

        if (er){
            return callback(er);
        }

        var $ = cheerio.load(body);

        var videoArea = $('#flashbox');
        var vid = videoArea.attr('data-player-videoid');
        var tvid = videoArea.attr('data-player-tvid');
        var tvname = '';
        if(vid&&tvid){
            iqiyiParseFlv2(tvid,vid, callback);
        }else{
            callback('解析错误');
        }




    });
}



function iqiyiParseFlv2($tvid,$vid,callback){

    var static_ip = ['114.80.196.201'];    //目前测试通过的可以播放的静态ip地址
    var api_url = 'http://cache.m.iqiyi.com/jp/tmts';
    api_url = api_url+'/'+$tvid+'/'+$vid+'/?uid=&cupid=qc_100001_100102&platForm=h5&qyid=80f752d14113d33b394d1390e615e9ba&type=mp4';
    var options = {
        url: api_url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
            'Referer':'http://m.iqiyi.com/'
        }
    };


    var return_data  = {
        'mp4':[],
        'title':'',
        'coverImg':''
    };
    request(options, function(er, response,body) {
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
            return_data['title'] =  $video_datas.data.playInfo.an;
            return_data['coverImg'] =  $video_datas.data.playInfo.apic;
        }
        return callback(null,return_data);
    });
}