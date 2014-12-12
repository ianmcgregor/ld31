'use strict';

var Phaser = require('Phaser'),
    Config = require('./config/config.js'),
    Memory = require('./managers/memory.js'),
    Boot = require('./states/boot.js'),
    Preloader = require('./states/preloader.js'),
    MainMenu = require('./states/main-menu.js'),
    LevelLoader = require('./states/level-loader.js'),
    Level = require('./states/level.js'),
    GameOver = require('./states/game-over.js'),
    GameWon = require('./states/game-won.js'),
    usfl = require('usfl');

function createGame() {
    // new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
    return new Phaser.Game(Config.width, Config.height, Config.renderer, Config.id, null, false, false);
}

function setupStates(game) {
    game.state.add('Boot', Boot);
    game.state.add('Preloader', Preloader);
    game.state.add('MainMenu', MainMenu);
    game.state.add('LevelLoader', LevelLoader);
    game.state.add('Level', Level);
    game.state.add('GameOver', GameOver);
    game.state.add('GameWon', GameWon);
}

function start(game) {
    game.state.start('Boot');
}

usfl.ready(function() {
    Memory.reset();
    // new usfl.FPS().autoUpdate();
    var game = createGame();
    setupStates(game);
    start(game);
});
