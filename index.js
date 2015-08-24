var Promise = require('bluebird')
var request = require('got')
var defaults = require('lodash.defaults')

var utils = {
  baseUrl: 'http://www.broadbandmap.gov/broadbandmap/broadband/jun2014/',

  buildRequest: function buildRequest (lat, long, type) {
    return request.get(utils.baseUrl + type + '?latitude=' +
      lat + '&longitude=' + long + '&format=json')
  }
}

module.exports = function broadbandMap (lat, long, options) {
  options = defaults(options || {}, {
    types: ['wireline', 'wireless']
  })

  var promises = []

  options.types.forEach(function (type) {
    promises.push(utils.buildRequest(lat, long, type))
  })

  return Promise.all(promises)
  .spread(function (res1, res2) {
    var results = []

    if (res1 && res1.body) results.push(JSON.parse(res1.body).Results)
    if (res2 && res2.body) results.push(JSON.parse(res2.body).Results)

    return results
  })
  .catch(function (err) {
    throw err
  })
}
