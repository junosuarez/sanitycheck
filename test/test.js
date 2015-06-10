/* globals describe, it */
var chai = require('chai')
chai.should()

describe('sanitycheck', function () {
  var sanitycheck = require('../')

  it('doesnt export anything', function () {
    sanitycheck.should.deep.equal({})
  })
})
