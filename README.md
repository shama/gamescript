# gamescript

an event based game engine

## usage

```js
var gamescript = require('gamescript')
gamescript({
  id: 'test',
  timeline: [
    { from: '@me',
      text: '@botcanyou attack @you test',
      created: Date.now(), },
    { from: '@you',
      text: '@botcanyou attack @me test',
      created: Date.now(), },
  ],
  script: [
    "game.join(function(player) {",
    "  player.set({",
    "    lvl: 1,",
    "    exp: 0,",
    "    hp: 10,",
    "  })",
    "})",
    "game.action('attack', function(player, target) {",
    "  var hp = util.clamp(target.hp - (util.random(0, 3)), 0, target.hp)",
    "  target.set('hp', hp)",
    "})",
    "game.tick(function(parsed, tweet) {",
    "  game.players.each(function(player) {",
    "    if (player.hp <= 0) return",
    "    player.set('exp', player.events.sent + player.events.received)",
    "    var gainlvl = parseInt(player.exp / 10) + 1",
    "    if (gainlvl > player.lvl) {",
    "      player.set({",
    "        lvl: gainlvl,",
    "        hp: player.hp + parseInt(util.random(1, 3)),",
    "      })",
    "    }",
    "  })",
    "})",
  ].join('\n')
}, function(err, game) {
  console.log(game)
})
```

## License
Copyright (c) 2015 Kyle Robinson Young  
Licensed under the MIT license.
