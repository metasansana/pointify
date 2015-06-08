#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> A browserify transform that resolves json pointers.

## Install

```sh
$ npm install --save pointify
```


## Usage

```js
var pointify = require('pointify');
var browserify = require('browserify');
var someJSONFile = require('./someJSONFile');

	var b = browserify();
	b.add(someJSONFile);
	b.transform(pointify);
        b.bundle(function(err, src){
           console.dir(src);
          //Prints {"owner":"{"name":"Gus"}};
        });

//In some json file
{"owner": {"$ref":"owner.json"}

//owner.json
{"name":"Gus"}

```

##Notes

Read up on [RFC6901](https://tools.ietf.org/html/rfc6901) before you use this transform. There is a nice
example of its benefits [here](http://spacetelescope.github.io/understanding-json-schema/structuring.html) in relation to json schema.

This transform only deals with references expected to be in other files at the moment.
Full support for in document schema is planned.

All it does is require the json file and place it into the document. The requires are relative
to the document calling require.

## License

MIT © [Lasana Murray](http://trinistorm.org)


[npm-url]: https://npmjs.org/package/pointify
[npm-image]: https://badge.fury.io/js/pointify.svg
[travis-url]: https://travis-ci.org/metasansana/pointify
[travis-image]: https://travis-ci.org/metasansana/pointify.svg?branch=master
[daviddm-url]: https://david-dm.org/metasansana/pointify.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/metasansana/pointify

