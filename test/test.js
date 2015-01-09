var gamescript = require('../index.js')
var util = require('../lib/util')()
var test = require('tape')

test('basically works', function(t) {
  t.plan(2)

  var timeline = []
  var people = ['@test', '@shamakry', '@playerone', '@playertwo']
  var actions = ['attack', 'give', 'steal']
  var len = people.length - 1
  for (var i = 0; i < 99; i++) {
    var action = actions[util.random(0, actions.length -1)]
    var extras = ''
    if (action === 'give') {
      extras = parseInt(Math.random() * 99)
    }
    timeline.push({
      user_screen_name: people[util.random(0, len)],
      text: '@botcanyou ' + action + ' ' + people[util.random(0, len)] + ' ' + extras + ' abcd1234',
      created_at: Date.now(),
    })
  }

  var data = {
    id: 'abcd1234',
    script: [
      "// Called when a player joins. Use to default their stats.",
      "game.join(function(player) {",
      "  player.set({",
      "    lvl: 1,",
      "    exp: 0,",
      "    hp: 10,",
      "    str: parseInt(util.random(1, 20)),",
      "    def: parseInt(util.random(1, 20)),",
      "    $: parseInt(util.random(50, 100)),",
      "  })",
      "})",
      "// Define which actions players can perform to each other.",
      "game.action('attack', function(player, target) {",
      "  var hp = util.clamp(target.hp - (player.str - target.def), 0, target.hp)",
      "  target.set('hp', hp)",
      "})",
      "game.action('give', function(player, target, extras) {",
      "  var amt = util.clamp(util.number(extras), 0, player.$)",
      "  player.set('$', player.$ - amt)",
      "  target.set('$', target.$ + amt)",
      "})",
      "game.action('steal', function(player, target, extras) {",
      "  if (Math.random() < .5) {",
      "    var amt = util.clamp(util.number(extras), 0, target.$)",
      "    player.set('$', player.$ + amt)",
      "    target.set('$', target.$ - amt)",
      "  }",
      "})",
      "// Perform this function on each event in the timeline",
      "game.tick(function(parsed, tweet) {",
      "  game.players.each(function(player) {",
      "    if (player.hp <= 0) {",
      "      player.badge('dead')",
      "      return",
      "    }",
      "    player.set('exp', player.events.sent + player.events.received)",
      "    var gainlvl = parseInt(player.exp / 10) + 1",
      "    if (gainlvl > player.lvl) {",
      "      player.set({",
      "        lvl: gainlvl,",
      "        hp: player.hp + parseInt(util.random(1, 3)),",
      "        str: player.str + parseInt(util.random(1, 3)),",
      "        def: player.def + parseInt(util.random(1, 3)),",
      "      })",
      "    }",
      "  })",
      "})",
      "// Add badges players can earn with URLs to images that represent them",
      "game.badge('dead', 'x')",
    ].join('\n'),
    timeline: timeline,
  }

  gamescript(data, function(err, game) {
    if (err) return console.error(err)
    //console.log('end', game.players)
    t.equal(game.players['@shamakry'].id, '@shamakry', '@shamakry player exists')
    t.equal(game.players['@playerone'].id, '@playerone', '@playerone player exists')
  })
})
