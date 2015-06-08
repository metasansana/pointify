var through = require('through');
var traverse = require('traverse');
var path = require('path');
var ptr = require('json-ptr');

function isJSON(file) {
	return (/\.json$/).test(file);
}

function pointify(file) {

	var wd = path.dirname(file) + '/';

	var write = function(buf) {
		data += buf;
	};

	var end = function() {

		data = JSON.parse(data);
		traverse(data).
		forEach(function(value) {
			if (this.key === '$ref')
				this.parent.update(require(wd + value));
		});
		this.queue(JSON.stringify(data));
		this.queue(null);

	};

	var data = '';
	var stream = through(write, end);

	if (!isJSON(file)) return through();

	return stream;
}
module.exports = pointify;
