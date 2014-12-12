'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js');

function Memory(){
    this.changed = new Phaser.Signal();
}

Memory.prototype.data = {
    paused : false,
    soundOn: true,
    current: {
        level: 0,
        lives: 1,
        score: 0,
        best: 0,
        totalCollectables: 0,
        collected: 0
    },
    record: {
        levels: [
            {
                level:0,
                name: Config.levels[0].name,
                unlocked: true
            }
        ]
    }
};

Memory.prototype.setCurrent = function(currentState) {
    var propertyKey,
        property;

    for(propertyKey in currentState) {
        property = currentState[propertyKey];
        this.data.current[propertyKey] = property;
    }

    this.changed.dispatch({ current: this.data.current });
};

Memory.prototype.getCurrent = function() {
    return this.data.current;
};

Memory.prototype.setCurrentLevel = function(levelIndex) {
    this.data.current.level = levelIndex;
    if(this.levelIsLocked(levelIndex)) {
        this.unlockLevel(levelIndex);
    }
};

Memory.prototype.getCurrentLevel = function() {
    return this.data.current.level;
};

Memory.prototype.isLastLevel = function() {
    return this.data.current.level === this.data.record.levels.length - 1;
};

Memory.prototype.getStoredLevel = function(levelIndex) {
    return this.data.record.levels[levelIndex];
};

Memory.prototype.unlockLevel = function(levelIndex) {
    var level = this.data.record.levels[levelIndex];
    level.unlocked = true;
};

Memory.prototype.levelPlayed = function(levelIndex) {
    var level = this.data.record.levels[levelIndex];
    level.played = true;
};

Memory.prototype.completeLevel = function(levelIndex) {
    var level = this.data.record.levels[levelIndex];
    level.level = levelIndex;
    level.completed = true;

    return level;
};

Memory.prototype.lockLevel = function(levelIndex) {
    var level = this.data.record.levels[levelIndex];
    level.unlocked = false;
};

Memory.prototype.levelIsLocked = function(index) {
    var level = this.data.record.levels[index];
    return !level.unlocked;
};

Memory.prototype.levelIsUnlocked = function(index) {
    var level = this.data.record.levels[index];
    return level.unlocked;
};

Memory.prototype.setSoundOn = function(value) {
    if(this.data.soundOn === value) { return; }
    this.data.soundOn = value;
    this.changed.dispatch( { soundOn: this.data.soundOn } );
};

Memory.prototype.soundIsOn = function() {
    return this.data.soundOn;
};

Memory.prototype.soundIsOff = function() {
    return !this.data.soundOn;
};

Memory.prototype.save = function() {
    if(localStorage) {
        try {
            localStorage.setItem('game', JSON.stringify(this.data));
        }catch(e){
            console.log('Failed to save to local storage.');
        }
    }
};

Memory.prototype.load = function() {
    if(localStorage && localStorage.getItem('game')) {
        this.data = JSON.parse(localStorage.getItem('game'));
    }
};

Memory.prototype.reset = function() {
    if(localStorage) {
        localStorage.clear();
    }
};

Memory.prototype.takeLife = function() {
    this.data.current.lives--;
};

Memory.prototype.getLivesLeft = function() {
    return this.data.current.lives;
};

Memory.prototype.getScore = function() {
    return this.data.current.score;
};

Memory.prototype.addScore = function(value) {
    this.data.current.score += value;
    if(this.data.current.score < 0) {
        this.data.current.score = 0;
    }
};

Memory.prototype.getBestScore = function() {
    if(this.data.current.score > this.data.current.best) {
        this.data.current.best = this.data.current.score;
    }
    return this.data.current.best;
};

Memory.prototype.setTotalCollectables = function(value) {
    this.data.current.totalCollectables = value;
};

Memory.prototype.addCollected = function() {
    this.data.current.collected++;
};

Memory.prototype.getTotalCollectables = function() {
    return this.data.current.totalCollectables;
};

Memory.prototype.getCollected = function() {
    return this.data.current.collected;
};

Memory.prototype.allCollected = function() {
    return this.data.current.collected === this.data.current.totalCollectables;
};

Memory.prototype.resetGame = function(lives) {
    this.data.current.lives = lives;
    this.data.current.collected = 0;
    this.data.current.score = 0;
};

module.exports = new Memory();
