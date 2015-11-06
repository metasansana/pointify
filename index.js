var through = require('through');
var traverse = require('traverse');
var dirname = require('path').dirname;
var fs = require('fs');

function pointify(file, opts) {

    var data = '';
    opts = opts || {};

    function is_json(file) {
        return (/\.json$/).test(file);
    }

    function open(path) {

        try {
            return fs.readFileSync(path);
        } catch (e) {
            return null;
        }

    }

    function get_file_contents(path, paths) {

        var buf;
        var searched = path + '\n';

        buf = open(path);
        buf = (buf) ? buf : open(dirname(file) + '/' + path);

        if (!buf)
            paths.forEach(function(p) {
                if (!buf) {
                    buf = open(p + '/' + path);
                    searched += p + '/' + path;
                }
            });

        if (!buf) throw new Error('Unable to locate ' + path + '! Searched in :\n' + searched);
        return JSON.parse(buf.toString('utf8'));

    }

    function merge_keys(keys, o, node) {
        if (keys.length > 1)
            keys.forEach(function(key) {
                if (key !== '$ref')
                    o[key] = node[key];
            });
    }

    function marshall(data, paths) {

        traverse(data).
        forEach(function(value) {

            if (this.key === '$ref') {

                var contents;
                var node = this.parent.node;
                var keys = Object.keys(node);

                paths = (paths) ? (Array.isArray(paths)) ?
                    paths : [paths] : [];

                contents = get_file_contents(value, paths);
                merge_keys(keys, contents, node);
                this.parent.update(marshall(contents, paths));
            }

        });
        return data;

    }

    function write(buf) {
        data += buf;
    }

    function end() {

        var obj;

        try {
            obj = JSON.parse(data);
        } catch (e) {
            throw new Error('Error while procesing ' + file + ': ' + e.message + '\n Contents:\n' + data);
        }

        this.queue(String(JSON.stringify(marshall(obj, opts.paths || []))));
        this.queue(null);

    }

    if (!is_json(file)) return through();
    return through(write, end);

}

module.exports = pointify;
