/**
 * Created by jiangli on 15/4/10.
 */

"use strict";

var should = require('should');
var anotheriqiyimp4 = require('../../lib/anotheriqiyimp4');

describe('test/lib/anotheriqiyimp4.test.js', function () {

    describe('/getAnotherIQiYiMp4VideoInfo', function () {

        it('should getAnotherIQiYiMp4VideoInfo successful', function (done) {
            anotheriqiyimp4('http://www.iqiyi.com/v_19rrnphkz4.html',function(err,data){

                data.should.have.property('title');
                data.should.have.property('coverImg');
                data.should.have.property('mp4');
                done(err);

            });
        });
    });

});