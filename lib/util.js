function Util() {
  if (!(this instanceof Util)) return new Util()
}
module.exports = Util

Util.prototype.clamp = function(val, min, max) {
  min = min || 0
  max = max || val
  if (val < min) val = min
  else if (val > max) val = max
  return val
}

Util.prototype.random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

Util.prototype.trim = function(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

// Find @username matches
Util.prototype.targets = function(str) {
  return str.match(/\B@([\w-]+)/gm)
}

// Parse to number
Util.prototype.number = function(str) {
  return parseFloat((str || '0').toString().replace(/[^\d.-]/g, ''))
}

Util.prototype.nextTick = function(fn) {
  var tick = setImmediate || process.nextTick || function(fn) { setTimeout(fn, 1) }
  return tick(fn)
}

Util.prototype.eachSeries = function(arr, iterator, callback) {
  var self = this
  callback = callback || function () {}
  if (!arr.length) return callback()
  var completed = 0
  var iterate = function() {
    iterator(arr[completed], function (err) {
      if (err) {
          callback(err)
          callback = function () {}
      } else {
        completed += 1
        if (completed >= arr.length) {
          callback()
        } else {
          self.nextTick(iterate)
        }
      }
    })
  }
  self.nextTick(iterate)
}
