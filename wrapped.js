var transform = require('./index.js');

module.exports = function(result) {
 return function(file, opts) {

	var data = '';
	var stream = transform(file,opts);

	stream.on('data', function(buf) {
		data += buf;
	});
	stream.on('end', function() {
		result.data = data;
	});

	return stream;
  };
};
