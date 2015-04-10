/**
 * Created by jiangli on 15/4/10.
 */



"use strict";

var should = require('should');
var index = require('../index');

describe('test/index.test.js', function () {

    describe('/getIndexInfo', function () {

        it('should getIndexInfo successful', function (done) {


            index('http://tv.sohu.com/20150410/n411059863.shtml',function(err,data){

                data.should.have.property('title');
                data.should.have.property('coverImg');
                data.should.have.property('url');
                done(err);

            });
        });
    });

});