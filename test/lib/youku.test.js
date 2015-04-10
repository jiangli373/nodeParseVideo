/**
 * Created by jiangli on 15/4/10.
 */

"use strict";

var should = require('should');
var youku = require('../../lib/youku');

describe('test/lib/youku.test.js', function () {

    describe('/getYouKuVideoInfo', function () {

        it('should getYouKuVideoInfo successful', function (done) {
            youku('http://v.youku.com/v_show/id_XODI5ODQxMzEy.html',function(err,data){

                data.should.have.property('title');
                data.should.have.property('coverImg');
                data.should.have.property('高清mp4');
                done(err);

            });
        });
    });

});