var through = require('through');
var traverse = require('traverse');
var dirname = require('path').dirname;
var fs = require('fs');
var starts_with = require('lodash.startswith');

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
        var foundDir = dirname(file) + '/' + path;

        buf = open(path);
        buf = (buf) ? buf : open(foundDir);
        foundDir = dirname(foundDir);

        if (!buf)
            paths.forEach(function(p) {
                if (!buf) {
                    buf = open(p + '/' + path);
                    searched += p + '\n';
                    if (buf) foundDir = dirname(p + '/' + path);
                }
            });

        if (!buf) throw new Error('Unable to locate ' +
            path + ' (started processing from: ' + file + ')!\n' + 'Searched in :\n' + searched + '\nEND');

        return {
            dir: foundDir,
            contents: JSON.parse(buf.toString('utf8'))
        };

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

            var results;
            var passedPaths;
            var isObject = (this.key === '$ref');
            var isString = starts_with(value, '$ref ');
            var shouldProcess = (isObject || isString);
            var self = this;

            paths = (paths) ? (Array.isArray(paths)) ?
                paths : [paths] : [];

            if (isString) {
                value = value.split(' ');
                value.shift();
                value = value.join('');
            }

            if (shouldProcess)
                results = get_file_contents(value, paths);

            if (isObject) {
                merge_keys(Object.keys(this.parent.node),
                    results.contents, this.parent.node);
                self = this.parent;
            }

            if (shouldProcess) {
                passedPaths = paths.slice();
                passedPaths.push(results.dir);
                self.update(marshall(results.contents, passedPaths));
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
