# sanitycheck
ensure that all deps are present and accounted for CI / CD

## usage

add it as a dev dependency to your project
```console
$ npm install --save-dev sanitycheck
```

and add it to your test command by editing your `package.json`:
```javscript
{
  "scripts": {
    "test": "sanitycheck && <test runner>"
  }
}
```

Now you can run it using `$ npm test` and add it to your favorite testing or CI scripts.

If there are any errors, it exits with an error code of 1. As of 2.0.0, dependencies found
in package.json but not used in code count as errors.

## example output:

### ok
```console
Checking for unused or missing dependencies in package.json...
Validating all require statements...
···
OK
```

### missing dependencies
```console
Checking for unused or missing dependencies in package.json...
Dependencies missing in package.json: cool-ascii-faces
```

### depenency case error
```console
Checking for unused or missing dependencies in package.json...
Validating all require statements...
·☹ ·
1 Errors:
Error: Inside "c:\dev\sanitycheck\index.js"
Cannot resolve "./SUB" because:
"c:\dev\sanitycheck\SUB.js" doesn't exactly match the actual file path
"c:\dev\sanitycheck\sub.js"
```


## kudos
makes use of excellent work from [@thlorenz](https://github.com/thlorenz) in [valiquire](https://npm.im/valiquire) and [@jutaz](https://github.com/jutaz) in [depscan](https://npm.im/depscan)

## contributors

- jden <jason@denizac.org>


## license

ISC. (c) MMXIV jden <jason@denizac.org>. See LICENSE.md
