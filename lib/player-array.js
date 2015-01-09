function PlayerArray(data) {
  if (!(this instanceof PlayerArray)) return new PlayerArray(data)
  if (data) this.merge(data)
}
module.exports = PlayerArray

// Iterate over each player
PlayerArray.prototype.each = function(fn) {
  var keys = Object.keys(this)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (key.slice(0, 1) !== '@') continue
    fn.call(this[key], this[key])
  }
  return this
}

// Merge in players to this class
PlayerArray.prototype.merge = function(data) {
  var keys = Object.keys(data)
  var len = keys.length
  while (len--) {
    var key = keys[len]
    if (key.slice(0, 1) === '@') {
      this[key] = data[key]
    }
  }
  return this
}