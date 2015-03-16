/**
 * Created by jiangli on 15/1/6.
 */

var index = require('./index');







//提供了url，直接运行node test.js
index('http://www.iqiyi.com/v_19rrnbyreg.html','MP4',function(err,data){
    console.log(data);
});