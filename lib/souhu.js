/**
 * Created by jiangli on 15/4/10.
 */

"use strict";
var request = require('request');
var async = require('async');

module.exports = function($url,callback){


    request($url, function(err, response,body) {
        if(err){
           return callback(err);
        }else{


            if(body){
                var result = body.match(/\s*vid=\s*"([^"]+)"/);

                if(result&&result[1]){

                    var $sub_ip ='220.181.118.53';
                    var $vid = result[1]-0;
                    var $api_url = "http://"+$sub_ip+"/vrs_flash.action?vid="+$vid+"&af=1&out=-1&g=8&r=2&t="+Math.random();

                    request($api_url, function(err, response,body) {
                        if(err){
                            return callback(err);
                        }else{
                            if(body){
                                var $video_datas = JSON.parse(body);

                                if($video_datas['data']){
                                    var video_data = $video_datas['data'];
                                    var title = video_data['tvName'];
                                    var coverImg = video_data['coverImg'];
                                    parseSoHuVideoUrl(video_data['relativeId'],$sub_ip, function (err,data) {
                                        if(err) return callback(err);
                                        if(data){
                                            data.title = title;
                                            data.coverImg = coverImg;
                                            return callback(null,data);
                                        }
                                    });

                                }else{
                                    return callback(null,null);
                                }
                            }
                        }
                    });
                }
            }else{
                return callback(null,null);
            }
        }

    });

}


//拼接参数解析视频的方法
function parseSoHuVideoUrl($vid,$sub_ip,callback){

    var $api_url = "http://"+$sub_ip+"/vrs_flash.action?vid="+$vid+"&out=0&g=8&r=2&t="+Math.random();

    var data;
    request($api_url, function(err, response,body) {
        if(err){
            return callback(err);
        }
        if(body){

            var $video_data = JSON.parse(body);

            var $rands = Math.floor(Math.random()*22)+1;

            var $params = [];
            if($video_data['data']){
                for(var i=0;i< $video_data['data'].clipsURL.length;i++ ){
                    var $su_key = $video_data['data']['su'][i];
                    var $url = "http://"+$video_data['allot']+"/?prot="+$video_data['prot']+"&file="+$video_data['data'].clipsURL[i].replace(/http:\/\/data.vod.itc.cn/,'')+"&new="+$su_key;
                    $params[i]= {
                        'su_key':'',
                        'rands':'',
                        'url':''
                    };
                    $params[i].su_key= $su_key;
                    $params[i].rands = $rands;
                    $params[i].url = $url;
                }
                soHu_rolling_curl_url($params,callback);

            }else{
                return callback("请求失败",null);
            }

        }else{
            return callback("请求失败",null);
        }
    });
}


function soHu_rolling_curl_url(params,callback){

    var return_result = {'url':[]};


    async.each(params, function (param,callback) {

        request(param.url, function (err,response,body) {

            if(err){
                return callback(err);
            }

            if(body){
                var param_array = body.split('|');


                var su_key = param.su_key;
                var rands =  param.rands;


                var realurl = (param_array[0].slice(0,-1)+ su_key + "?start=&key=" + param_array[3] + "&n="+rands+"&a=4019");
                param.realurl = realurl;
                return callback();

            }else{

                return callback('请求失败');
            }

        });


    }, function(err){

        if(err) return callback(err);

        for(var i=0;i<params.length;i++){
            return_result.url.push(params[i].realurl);
        }

        return callback(null,return_result);
    });

}

