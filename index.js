var through = require('through');
var traverse = require('traverse');
var path = require('path');

function isJSON(file) {
	return (/\.json$/).test(file);
}

function pointify(file) {

	var wd = path.dirname(file) + '/';
	var data = '';

	var marshall = function(data, cwd, cb) {

		traverse(data).
		forEach(function(value) {
			if (this.key === '$ref') {
				var mod = cwd + value;
				var update = JSON.parse(JSON.stringify(require(mod)));
				var node = this.parent.node;
				var keys = Object.keys(node);
				if (keys.length > 1)
					keys.forEach(function(key) {
						if (key !== '$ref')
							update[key] = node[key];
					});

				marshall(update, path.dirname(mod) + '/', function(data) {
					this.parent.update(data);
				}.bind(this));
			}
		});

		return cb(data);

	};

	var write = function(buf) {
		data += buf;
	};

	var end = function() {

		marshall(JSON.parse(data), wd, function(data) {
			this.queue(JSON.stringify(data));
			this.queue(null);
		}.bind(this));


	};

	if (!isJSON(file)) return through();
	return through(write, end);
}

module.exports = pointify;

