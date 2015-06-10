#!/usr/bin/env node

var depscan = require('depscan')
var valiquire = require('valiquire')
var path = require('path')

// check for unused or missing dependencies in package.json
console.log('Checking for unused or missing dependencies in package.json...')
var scan = depscan('.', path.resolve('.')).report()
if (scan.missing.length) {
  console.log('Dependencies missing in package.json: ' + scan.missing.join(', '))
  console.log('These should be added.')
  process.exit(1)
}
if (scan.unused.length) {
  console.log('Unused dependencies in package.json: ' + scan.unused.join(', '))
  console.log('These should be removed.')
  process.exit(1)
}

var pkg = require(path.join(process.cwd(), 'package.json'))
var duplicates = []
if (pkg.dependencies && pkg.devDependencies) {
  console.log('Validating duplicate packages...')

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

  console.log('OK')
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
