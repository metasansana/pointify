#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> ~~A browserify transform that resolves json pointers.~~
> A browserify transform that allows you to bundle json files inside other json files.
Very loosely based on [RFC 6901](https://tools.ietf.org/html/rfc6901)

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

//or alternatively embed the $ref in a string (not part of the rfc)
{"owner":"$ref owner.json"}

//owner.json
{"name":"Gus"}

```

##Notes

Check out [RFC6901](https://tools.ietf.org/html/rfc6901) before you use this transform. There is a nice
example of its benefits [here](http://spacetelescope.github.io/understanding-json-schema/structuring.html) in relation to json schema.

~~This transform only deals with references expected to be in other files at the moment.
Full support for in document schema is planned.~~

After using this on a project I no longer really see a need to support json pointer's syntax, 
doing so in a browserify transform seems like a lot of worth with little benifit. Maybe someday as
an experiment, for now this transform is useful if you use what to have browserify combine
some json files on your behalf.

All it does is require the json file and place it into the document. ~~The requires are relative
to the document calling require.~~ No longer uses requires, it will load the contents of the file
and parse them into JSON.

## License

MIT © [Lasana Murray](http://trinistorm.org)


[npm-url]: https://npmjs.org/package/pointify
[npm-image]: https://badge.fury.io/js/pointify.svg
[travis-url]: https://travis-ci.org/metasansana/pointify
[travis-image]: https://travis-ci.org/metasansana/pointify.svg?branch=master
[daviddm-url]: https://david-dm.org/metasansana/pointify.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/metasansana/pointify

