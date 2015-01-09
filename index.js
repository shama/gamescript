var Game = require('./lib/game.js')
var Util = require('./lib/util.js')
module.exports = function(data, cb) {
  var game = new Game(data)
  var util = new Util()
  try {
    JSON.stringify(game.script)
    var fn = new Function('game', 'util', game.script)
    fn(game, util)
  } catch (err) {
    cb(err)
  }
  game._run(cb)
}
