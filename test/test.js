var must = require('must');
var path = require('path');
var browserify = require('browserify');
var transform = require(__dirname + '/../wrapped.js');
var result;

function bundle(file) {
    var b = browserify();
    b.add(file);
    b.transform(transform(result), {
        paths: [__dirname + '/pointy_modules', __dirname + '/pointier_modules']
    });
    return b;
}

describe('bundle transform', function() {

            beforeEach(function() {
                result = {};
            });

            it('should work', function(done) {

                bundle(__dirname + '/../examples/person.json').bundle(function(err, src) {

                    if (err) return done(err);

                    must(result.data).to.be('{"name":"Lasana Murray",' +
                        '"address":{"street_address":"1600 Pennsylvania Avenue NW",' +
                        '"city":"Washington","state":"DC","type":"business","phone":"253-4444"}}');
                    done();
                });

            });

            it('should work with arrays', function(done) {

                bundle(__dirname + '/../examples/addressBook.json').bundle(function(err, src) {

                    if (err) return done(err);

                    must(result.data).to.be(
                        '{"owner":"Shaina Purple","addresses":' +
                        '[{"street_address":"1600 Pennsylvania Avenue NW",' +
                        '"city":"Washington","state":"DC","type":"business"},' +
                        '{"street_address":"1600 Pennsylvania Avenue NW","city":"Washington",' +
                        '"state":"DC","type":"business"},{"street_address":' +
                        '"1600 Pennsylvania Avenue NW","city":"Washington","state":"DC",' +
                        '"type":"business"}]}');
                    done();
                });
            });

            it('should work recursively', function(done) {

                bundle(__dirname + '/../examples/splitPerson.json').bundle(function(err, src) {

                    if (err) return done(err);

                    must(result.data).to.be('{"name":"Lasana Murray",' +
                        '"alterEgo":{"name":"Lasana Murray","address":' +
                        '{"street_address":"1600 Pennsylvania Avenue NW","city":"Washington",' +
                        '"state":"DC","type":"business","phone":"253-4444"}}}');
                    done();
                });

            });

            it('should work with paths', function(done) {

                bundle(__dirname + '/json/paths.json').bundle(function(err, src) {

                    if (err) return done(err);

                    must(result.data).to.be('{"values":{"name":"Lasana Murray",' +
                        '"paths":["x","y","z"]}}');
                    done();
                });

            });

            it('should work with embedded strings', function(done) {

                bundle(__dirname + '/json/emb.json').bundle(function(err, src) {

                    if (err) return done(err);

                    must(result.data).to.be('{"values":{"name":"Lasana Murray",' +
                        '"paths":["x","y","z"]}}');
                    done();
                });

            });

            it('should not resolve the parent before child if they both have a matching file name', function(done) {

                    bundle(__dirname + '/parent/child/n.json').
                    bundle(function(err, src) {

                            if (err) return done(err);

                            must(result.data).to.be('{"a":{"name":"child foot"}}');
                                done();

                            });


                    });


            });
