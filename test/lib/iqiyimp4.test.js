/**
 * Created by jiangli on 15/4/10.
 */

"use strict";

var should = require('should');
var iqiyimp4 = require('../../lib/iqiyimp4');

describe('test/lib/iqiyimp4.test.js', function () {

    describe('/getIQiYiMp4VideoInfo', function () {

        it('should getIQiYiMp4VideoInfo successful', function (done) {
            iqiyimp4('http://www.iqiyi.com/v_19rrnphkz4.html',function(err,data){

                data.should.have.property('title');
                data.should.have.property('coverImg');
                data.should.have.property('mp4');
                done(err);

            });
        });
    });

});