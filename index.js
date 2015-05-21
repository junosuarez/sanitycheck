#!/usr/bin/env node

var depscan = require('depscan')
var valiquire = require('valiquire')
var path = require('path')

// check for unused or missing dependencies in package.json
console.log('Checking for unused or missing dependencies in package.json...')
var scan = depscan('.', path.resolve('.')).report()
if (scan.missing.length) {
  console.error('Dependencies missing in package.json: ' + scan.missing.join(', '))
  process.exit(1)
}
if (scan.unused.length) {
  console.warn('Unused dependencies in package.json: ' + scan.unused.join(', '))
}

// validate require statements (capitalization, relative paths, etc)
console.log('Validating all require statements...')
valiquire('.', false, function (err, validationErrors) {
  console.log('')
  if (err) {
    console.error(err)
    process.exit(1)
  }
  if (validationErrors.length) {
    console.error(validationErrors.length + ' Errors:\n' + validationErrors.join('\n\n'))
    process.exit(1)
  }

  console.log('OK')
})


var pkg = require(path.join(process.cwd(),'package.json'));
var duplicates = [];
if(pkg.dependencies && pkg.devDependencies) {
  console.log('Validating package duplicates...')

  var devDependencies = Object.keys(pkg.devDependencies);
  Object.keys(pkg.dependencies).forEach(function(key){
    if(devDependencies.indexOf(key) > -1) {
      duplicates.push(key);
    }
  });
  if(duplicates.length > 0){
    console.error(duplicates.length + ' duplicates in devDependencies/dependencies:\n' + duplicates.toString() + '\n\n')
    process.exit(1)
  }

  console.log('OK')
}
