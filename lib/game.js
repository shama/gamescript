var Player = require('./player.js')
var PlayerArray = require('./player-array.js')
var Events = require('./events')
var util = require('./util.js')()
var nlp = require('./nlp.js')()

function Game(data) {
  if (!(this instanceof Game)) return new Game(data)
  var self = this
  this.id = 0
  this.events = new Events(data.timeline, 'twitter')
  this.script = ''
  this.players = new PlayerArray()
  this.parse = null
  this.tickCount = 0
  Object.keys(data || {}).forEach(function(key) {
    if (data.hasOwnProperty(key)) self[key] = data[key]
  })
  this._actions = Object.create(null)
  this._joins = []
  this._ticks = []
  this._badges = Object.create(null)
  this._errors = []
  this._timeline = Object.create(null)
}
module.exports = Game

Game.prototype.join = function(fn) {
  this._joins.push(fn)
}

Game.prototype.action = function(name, fn) {
  this._actions[name] = fn
}

Game.prototype.badge = function(name, url) {
  this._badges[name] = url
}

Game.prototype.tick = function(fn) {
  this._ticks.push(fn)
}

Game.prototype.error = function(err) {
  this._errors.push(err)
}

Game.prototype._run = function(done) {
  var self = this
  self.events.each(function(event, next) {
    self._runTick(event, next)
  }, function() {
    done(null, self)
  })
}

Game.prototype._callEach = function(fns) {
  if (!Array.isArray(this[fns])) return
  var args = Array.prototype.slice.call(arguments, 1)
  var cb = args[args.length - 1]
  if (typeof cb === 'function') {
    args = args.slice(0, -1)
  } else {
    cb = function() {}
  }
  for (var i = 0; i < this[fns].length; i++) {
    var f = this[fns][i]
    if (typeof f === 'function') {
      cb(f.apply(this, args))
    } else {
      cb(null)
    }
  }
  return this
}

Game.prototype._runTick = function(event, cb) {
  var self = this

  var data = Object.create(null)
  if (typeof this.parse === 'function') {
    data = this.parse(event)
  } else {
    var text = event.text
    var id = String(this.id)
    var idlen = -id.length

    if (text.slice(0, 10) === '@botcanyou') text = text.slice(10)
    if (text.slice(idlen) === id) text = text.slice(0, idlen)

    data = nlp.pos(util.trim(text))
  }

  var player = null
  var targets = []
  var extras = data.extras || ''
  util.eachSeries([
    function(next) {
      // Create or get current player
      self._createPlayer(event, function(p) {
        player = p
        self.players[p.id].events.sent++
        next()
      })
    },
    function(next) {
      // Check for new players
      util.eachSeries(data.targets, function(target, nextTarget) {
        if (!target) return nextTarget()
        self._createPlayer(target, function(t) {
          if (!t) return nextTarget()
          targets.push(t)
          self.players[t.id].events.received++
          nextTarget()
        })
      }, next)
    },
    function(next) {
      // Call action
      if (typeof self._actions[data.action] === 'function') {
        util.eachSeries(targets, function(target, nextTarget) {
          if (!target) return nextTarget()
          self._actions[data.action].call(self, player, target, extras)
          // Increment actions
          if (!player.actions[data.action]) player.actions[data.action] = 0
          player.actions[data.action]++
          nextTarget()
        }, next)
      } else {
        next()
      }
    },
    function(next) {
      // Call ticks
      self.tickCount++
      self._callEach('_ticks', data, event, function() {
        next()
      })
    },
  ], function(fn, next) { fn(next) }, function() {
    self._saveStats(function() {
      cb(null, self)
    })
  })

  return this
}

Game.prototype._createPlayer = function(event, cb) {
  var self = this
  if (typeof event === 'string') event = { from: event, created_at: 0 }
  if (!event.from) return cb()
  var playerKeys = Object.keys(self.players)
  if (playerKeys.indexOf(event.from) === -1) {
    var player = new Player(event.from)
    self._callEach('_joins', player, function() {
      self.players[player.id] = player
      self.players[player.id].joined = event.created_at || 0
      cb(player)
    })
  } else {
    cb(self.players[event.from])
  }
}

Game.prototype._saveStats = function(cb) {
  cb()
}
