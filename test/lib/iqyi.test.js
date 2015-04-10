/**
 * Created by jiangli on 15/4/10.
 */

"use strict";

var should = require('should');
var iqiyi = require('../../lib/iqiyi');

describe('test/lib/iqiyi.test.js', function () {

    describe('/getIQiYiVideoInfo', function () {

        it('should getIQiYiVideoInfo successful', function (done) {
            iqiyi('http://www.iqiyi.com/v_19rrnphkz4.html',function(err,data){

                data.should.have.property('title');
                data.should.have.property('coverImg');
                data.should.have.property('极速');
                done(err);

            });
        });
    });

});