/**
 * Created by jiangli on 15/1/6.
 */

var index = require('./index');



//提供了url，直接运行node test.js
//index('http://www.iqiyi.com/v_19rrnphkz4.html','MP4',function(err,data){
//    console.log(data);
//});


index('http://tv.sohu.com/20150410/n411059863.shtml','MP4',function(err,data){
    if(err){
        throw err;
    }
    console.log(data);
});