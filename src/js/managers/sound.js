'use strict';

var Phaser = require('Phaser');

function Sound() {
    this.game = null;
    this.currentMusic = null;
    this.sounds = {};
    this.delayedSfxTimeouts = [];
    this.keys = [];
}

Sound.prototype = {
    init: function(game) {
        this.game = game;

        for (var i = 0; i < this.keys.length; i++) {
            this.add(this.keys[i]);
        }
    },
    add: function(key) {
        var sound = this.game.add.audio(key, 1, false, true);
        this.sounds[key] = sound;
        return sound;
    },
    get: function(key) {
        return this.sounds[key] || this.add(key);
    },
    sfx: function(key, delay) {
        //console.log('Sound.sfx(', key, ')');
        var currentSfx = this.sounds[key] || this.add(key);
        if(delay !== undefined && delay > 0) {
            var delayedSfx = setTimeout(function(){
                currentSfx.play();
            }, delay);
            this.delayedSfxTimeouts.push(delayedSfx);
        }
        else {
            currentSfx.play();
        }
    },
    loop: function(key, start) {
        //console.log('Sound.loop(', key, start, ')');
        var currentSfx = this.sounds[key] || this.add(key);
        if(start){
            currentSfx.play('',0,1,true);
        }else{
            currentSfx.stop();
        }
    },
    music: function(key) {
        if(this.currentMusic && this.currentMusic.key === key && this.currentMusic.isPlaying) {
            return;
        }
        if(this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic.pendingPlayback = false;
        }
        this.currentMusic = this.sounds[key] || this.add(key);
        this.currentMusic.play('', 0, 1, true);
    },
    setMusicVolume: function(volume){
        if( this.currentMusic && this.currentMusic.isPlaying ) {
            if( !this.currentMusic._muted ){
                if (this.currentMusic.usingWebSound){
                    this.currentMusic.gainNode.gain.value = volume;
                }else if(this.currentMusic.usingSoundTag && this.currentMusic._sound){
                    this.currentMusic._sound.volume = volume;
                }
                this.currentMusic._volume = volume;
            }else{
                this.currentMusic._muteVolume = volume;
            }
        }
    },
    stopAll: function() {
        this.game.sound.stopAll();
        for (var i = 0; i < this.delayedSfxTimeouts.length; i++) {
            clearTimeout(this.delayedSfxTimeouts[i]);
        }
        this.delayedSfxTimeouts.length = 0;
    },
    fade: function(key, from, to, duration, delay) {
        var sound = this.sounds[key] || this.add(key);
        if(sound) {
            if(!delay) {
                delay = 0;
            }
            sound.volume = from;
            var easing = to === 0 ? Phaser.Easing.Sinusoidal.Out : Phaser.Easing.Sinusoidal.In;
            this.game.add.tween(sound).to({volume: to}, duration, easing, true, delay);
        }
    }
};

module.exports = new Sound();
