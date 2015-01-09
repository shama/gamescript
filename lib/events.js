var util = require('./util')()

function Events(data, adapter) {
  var self = this
  if (!(self instanceof Events)) return new Events(data, adapter)
  this._data = data || []
  this._adapter = adapter || 'twitter'
}
module.exports = Events

Events.prototype.each = function(fn, done) {
  var self = this
  util.eachSeries(self._data, function(item, next) {
    fn(self['_' + self._adapter](item), next)
  }, done)
  return self
}

Events.prototype._twitter = function(data) {
  data = data || {}
  data.from = data.from || data.user_screen_name
  delete data.user_screen_name
  data.created = data.created || data.created_at
  delete data.created_at
  return data
}
