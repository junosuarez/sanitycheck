#!/usr/bin/env node

var depscan = require('depscan')
var path = require('path')
var extend = require('xtend')
var assert = require('assert')
var valiquire = require('valiquire-silent')

var base = path.resolve('.')
var flags = {
  verbose: process.argv.indexOf('--verbose') !== -1
}

function logVerbose (msg) {
  if (flags.verbose) {
    console.log(msg)
  }
}

var packageJson = require(path.resolve(base, 'package.json'))
var options = extend({
  ignoreUnused: []
}, packageJson.sanitycheck)
assert(Array.isArray(options.ignoreUnused), 'options.ignoreUnused must be an array of strings')

// check for unused or missing dependencies in package.json
logVerbose('Checking for unused or missing dependencies in package.json...')
var scan = depscan('.', base).report()
if (scan.missing.length) {
  console.log('Dependencies missing in package.json: ' + scan.missing.join(', '))
  console.log('These should be added.')
  process.exit(1)
}

scan.unused = scan.unused.filter(function (dep) {
  return options.ignoreUnused.indexOf(dep) === -1
})
if (scan.unused.length) {
  console.log('Unused dependencies in package.json: ' + scan.unused.join(', '))
  console.log('These should be removed.')
  process.exit(1)
}

var pkg = require(path.join(process.cwd(), 'package.json'))
var duplicates = []
if (pkg.dependencies && pkg.devDependencies) {
  logVerbose('Validating duplicate packages...')

  var devDependencies = Object.keys(pkg.devDependencies)
  Object.keys(pkg.dependencies).forEach(function (key) {
    if (devDependencies.indexOf(key) > -1) {
      duplicates.push(key)
    }
  })
  if (duplicates.length > 0) {
    console.log(duplicates.length + ' found in both dependencies and devDependencies:\n' + duplicates.toString() + '\n\n')
    console.log('These should only be declared once in package.json.')
    process.exit(1)
  }

  logVerbose('OK')
}

// validate require statements (capitalization, relative paths, etc)
logVerbose('Validating all require statements...')

valiquire('.', false, function (err, validationErrors) {
  logVerbose('')
  if (err) {
    console.log(err)
    process.exit(1)
  }
  if (validationErrors.length) {
    console.log(validationErrors.length + ' Errors:\n' + validationErrors.join('\n\n'))
    process.exit(1)
  }

  logVerbose('OK')
})
