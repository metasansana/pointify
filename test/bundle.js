var must = require('must');
var path = require('path');
var browserify = require('browserify');
var transform = require(__dirname + '/../wrapped.js');
var result;

function bundle(file) {
	var b = browserify();
	b.add(file);
	b.transform(transform(result));
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
				'"city":"Washington","state":"DC","type":"business"}}');
			done();
		});

	});

	it('should work with arrays', function(done) {

		bundle(__dirname + '/../examples/addressBook.json').bundle(function(err, src) {

			if (err) return done(err);

                        must(result.data).to.be(
                          '{"owner":"Shaina Purple","addresses":'+
                          '[{"street_address":"1600 Pennsylvania Avenue NW",'+
                          '"city":"Washington","state":"DC","type":"business"},'+
                          '{"street_address":"1600 Pennsylvania Avenue NW","city":"Washington",'+
                          '"state":"DC","type":"business"},{"street_address":'+
                          '"1600 Pennsylvania Avenue NW","city":"Washington","state":"DC",'+
                          '"type":"business"}]}');
			done();
		});
	});


});
