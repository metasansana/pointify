var through = require('through');
var traverse = require('traverse');
var path = require('path');

function isJSON(file) {
	return (/\.json$/).test(file);
}

function pointify(file, opts) {

	var wd = path.dirname(file) + '/';
	var data = '';

	opts = opts || {};

	var marshall = function(data, cwd, cb) {

		traverse(data).
		forEach(function(value) {

			if (this.key === '$ref') {
				var mod = value;
				var update;
				var paths;
				var foundInPaths = false;
				var contents;
				var node = this.parent.node;
				var keys = Object.keys(node);

				try {
					contents = require(mod);
				} catch (e0) {
					try {
						mod = cwd + value;
						contents = require(mod);
					} catch (e1) {

						if (!opts.paths) throw e1;

						paths = (Array.isArray(opts.paths)) ?
							opts.paths : [opts.paths];

						paths.forEach(function(path) {

							if (!foundInPaths) {
								try {

									mod = path + '/' + value;
									contents = require(mod);
									foundInPaths = true;

								} catch (e2) {

								}
							}

						});

						if (!foundInPaths) throw e1;

					}


				}

				update = JSON.parse(JSON.stringify(contents));

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

          var obj;

          try {
             obj = JSON.parse(data);
          }catch(e) {
            throw new Error('Uncaught error while procesing '+file+': '+e.message);
          }

		marshall(obj, wd, function(data) {
			this.queue(JSON.stringify(data));
			this.queue(null);
		}.bind(this));


	};

	if (!isJSON(file)) return through();
	return through(write, end);
}

module.exports = pointify;

