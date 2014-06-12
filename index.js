#!/usr/bin/env node

var depscan = require('depscan')
var valiquire = require('valiquire')

// check for unused or missing dependencies in package.json
console.log('Checking for unused or missing dependencies in package.json...')
var scan = depscan('.', __dirname).report()
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