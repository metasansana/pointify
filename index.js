var through = require('through');
var traverse = require('traverse');
var path = require('path');

function isJSON(file) {
	return (/\.json$/).test(file);
}

function pointify(file) {

	var wd = path.dirname(file) + '/';

	var marshall = function(data) {

		traverse(data).
		forEach(function(value) {
			if (this.key === '$ref') {
				var update = JSON.parse(JSON.stringify(require(wd + value)));
				var node = this.parent.node;
				var keys = Object.keys(node);
				if (keys.length > 1)
					keys.forEach(function(key) {
						if (key !== '$ref')
							update[key] = node[key];
					});
				this.parent.update(marshall(update));
			}
		});

		return data;

	};

	var write = function(buf) {
		data += buf;
	};

	var end = function() {

		data = marshall(JSON.parse(data));
		this.queue(JSON.stringify(data));
		this.queue(null);

	};

	var data = '';
	var stream = through(write, end);

	if (!isJSON(file)) return through();

	return stream;
}
module.exports = pointify;
