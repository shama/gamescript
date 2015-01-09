function Player(id) {
  if (!(this instanceof Player)) return new Player(id)
  this.id = id
  this.joined = 0
  this.events = {
    sent: 0,
    received: 0,
  }
  this.actions = Object.create(null)
  this.badges = []
}
module.exports = Player

Player.prototype.set = function(key, val) {
  if (typeof key === 'string') {
    this[key] = val
  } else {
    var keys = Object.keys(key)
    for (var i = 0; i < keys.length; i++) {
      this[keys[i]] = key[keys[i]]
    }
  }
  return this
}

Player.prototype.badge = function(name) {
  if (this.badges.indexOf(name) !== -1) return this
  this.badges.push(name)
  return this
}
