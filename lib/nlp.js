var util = require('./util.js')()

// A really crummy nlp
function NLP() {
  if (!(this instanceof NLP)) return new NLP()
}
module.exports = NLP

NLP.prototype.pos = function(str) {
  var res = {
    action: null,
    targets: [],
    extras: '',
  }

  // action is everything before first player
  res.action = util.trim(str.slice(0, str.indexOf('@')))

  // find all players
  res.targets = util.targets(str)

  // extras is everything after last target
  var extras = util.trim(str.slice(str.lastIndexOf('@')))
  var idx = extras.indexOf(' ')
  if (idx !== -1) {
    res.extras = util.trim(extras.slice(idx))
  }

  return res
}

