var through = require('through');
var traverse = require('traverse');
var path = require('path');

function isJSON(file) {
	return (/\.json$/).test(file);
}

function pointify(file) {

	var wd = path.dirname(file) + '/';
	var data = '';

	var marshall = function(data, cwd) {

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

				this.parent.update(marshall(update, path.dirname(mod) + '/'));
			}
		});

		return data;

	};

	var write = function(buf) {
		data += buf;
	};

	var end = function() {

		this.queue(JSON.stringify(marshall(JSON.parse(data), wd)));
		this.queue(null);

	};

	if (!isJSON(file)) return through();


	return through(write, end);
}
module.exports = pointify;
