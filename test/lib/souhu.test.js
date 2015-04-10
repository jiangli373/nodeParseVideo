/**
 * Created by jiangli on 15/4/10.
 */

"use strict";

var should = require('should');
var souhu = require('../../lib/souhu');

describe('test/lib/souhu.test.js', function () {

    describe('/getSouHuVideoInfo', function () {

        it('should getSouHuVideoInfo successful', function (done) {
            souhu('http://tv.sohu.com/20150410/n411059863.shtml',function(err,data){

                data.should.have.property('title');
                data.should.have.property('coverImg');
                data.should.have.property('url');
                done(err);

            });
        });
    });

});