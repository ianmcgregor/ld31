'use strict';

var Phaser = require('Phaser'),
    Config = require('../config/config.js'),
    Controls = require('../managers/controls.js'),
    Hero = require('../objects/hero.js'),
    Intro = require('../objects/intro.js'),
    Enemy = require('../objects/enemy.js'),
    Hud = require('../ui/hud.js'),
    LevelMap = require('../maps/level-map.js'),
    Memory = require('../managers/memory.js'),
    Sound = require('../managers/sound.js');

function Level(game) {
    Phaser.State.call(this, game);
}

Level.prototype = Object.create(Phaser.State.prototype);
Level.prototype.constructor = Level;

Level.prototype.init = function() {
    this.game.world.setBounds(0, -100, Config.width, Config.height + 200);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 1200;
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    this.game.physics.p2.friction = 0.5;
    this.game.physics.p2.enableBodySleeping = true;
    this.game.physics.p2.world.solver.stiffness = 1e20;
    this.game.physics.p2.world.solver.relaxation = 3;

    this.group = this.game.add.group();

    this.map = new LevelMap(this.game);
    this.map.init();

    this.hud = new Hud(this.game);

    Memory.resetGame(Config.hero.lives);

    Controls.userControlRemoved = true;
};

Level.prototype.create = function() {

    this.map.create(this.group);

    this.game.physics.p2.convertTilemap(this.map.get('tilemap'), this.map.get('ground'));
    this.game.physics.p2.setWorldMaterial(this.game.physics.p2.createMaterial('ground'));
    this.game.physics.p2.setPostBroadphaseCallback(this.checkContact, this);

    this.hud.create();
    this.hud.setScore(0);

    this.hero = new Hero(this.game, Config.width / 2, 32 + Config.height / 2);
    this.group.add(this.hero);
    this.heroDamagedAt = 0;

    this.enemyCreatedAt = 0;
    this.enemies = this.game.add.group();
    this.enemies.classType = Enemy;
    this.enemies.createMultiple(50, 'textures', 'robot_1', false);

    this.emitter = this.game.add.emitter(0, 0, 100);
    this.emitter.makeParticles('textures', 'particle');
    this.emitter.gravity = 200;

    this.intro = new Intro(this.game, this.hero, this.start, this);

    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
};

Level.prototype.start = function() {
    this.intro.destroy();
    Controls.userControlRemoved = false;

    // spawn enemies
    var spawners = this.map.get('enemyspawn');
    spawners.forEach(function(spawner) {
        spawner.enemies = this.enemies;
    }, this);
};

Level.prototype.checkContact = function(a, b) {
    var exists = (a.sprite && a.sprite.exists && b.sprite && b.sprite.exists);
    if(!exists) { return true; }

    // sprites with same name don't collide
    if(a.sprite.name && b.sprite.name && a.sprite.name === b.sprite.name) {
        return false;
    }

    var nameA = a.sprite.name;
    var nameB = b.sprite.name;
    var isBullet = nameA === 'bullet' || nameB === 'bullet';
    var isEnemy = nameA === 'enemy' || nameB === 'enemy';
    var isHero = nameA === 'hero' || nameB === 'hero';

    if(isBullet && isEnemy) {
        if(a.sprite.name === 'enemy') {
            a.sprite.damage(0.1);
            this.checkEnemyKilled(a.sprite);
            b.sprite.kill();
        }
        else {
            b.sprite.damage(0.1);
            this.checkEnemyKilled(b.sprite);
            a.sprite.kill();
        }
        return false;
    }

    if(isHero && isEnemy) {
        if(a.sprite.name === 'hero') {
            b.sprite.kill();
            this.damageHero();
        }
        else {
            a.sprite.kill();
            this.damageHero();
        }
        return false;
    }

    return true;
};

Level.prototype.damageHero = function() {
    if(this.game.time.now > this.heroDamagedAt + 1000) {
        this.heroDamagedAt = this.game.time.now;
        this.hero.damage(1);
        this.hud.lifeLost();
    }
};

Level.prototype.checkEnemyKilled = function(enemy) {
    if(!enemy.alive) {
        this.explode(enemy);
        Memory.addScore(100000);
    }
    else {
        Sound.sfx('hit');
        Memory.addScore(1000);
    }
    this.hud.setScore(Memory.getScore());
};

Level.prototype.explode = function(sprite) {
    Sound.sfx('explode');
    this.game.plugins.screenShake.start(20);
    this.emitter.x = sprite.x;
    this.emitter.y = sprite.y;
    // start(explode, lifespan, frequency, quantity, forceQuantity)
    this.emitter.start(true, 2000, null, 10);
};

Level.prototype.update = function() {
    this.map.get('enemyturn').forEach(function(turner) {
        this.enemies.forEachAlive(function(enemy) {
            var dx = Math.abs(turner.x + 8 - enemy.x);
            var dy = Math.abs(turner.y - enemy.y);

            if(dx < 25 && dy < 16) {
                enemy.turn(turner.x - enemy.x);
            }
        }, this);
    }, this);

    this.map.get('obstacle').forEach(function(obstacle) {
        if(obstacle.isOn) {
            var dx = Math.abs(obstacle.x + 8 - this.hero.x);
            var dy = Math.abs(obstacle.y + 16 - this.hero.y);

            if(dx < 16 && dy < 25) {
                this.damageHero();
            }
        }
    }, this);

    if(this.hero && !this.hero.alive) {
        this.explode(this.hero);
        this.gotoEnd('GameOver');
    }else if(this.enemies.countLiving() === 0 && Memory.getScore()) {
        this.gotoEnd('GameWon');
    }
};

Level.prototype.gotoEnd = function(state) {
    setTimeout(function() {
        this.game.state.start(state);
    }.bind(this), 1000);
};

Level.prototype.shutdown = function() {
    this.group.destroy();
    this.level = null;
    this.hud.destroy();
    this.hud = null;
};

module.exports = Level;
