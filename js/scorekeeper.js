var Scorekeeper = function (game, showScore, textHeight) {
    this.game = game;
    this.score = {
        points: 0,
        perfect: 0,
        great: 0,
        good: 0,
        bad: 0,
        miss: 0,
        combo: 0,
        maxCombo: 0,
    };
    this.showScore = showScore;
    this.textHeight = textHeight || 48;
    var font = ' Rajdhani';
    var fontWeight = '600 ';
    if (showScore) {
        // this.scoreLabel = game.add.text(game.world.centerX, 20, 'score', {font: 'bold 20px Arial', fill: '#fff', stroke: 'rgba(255, 220, 235, 0.6)', strokeThickness: 2});
        // this.scoreLabel.anchor.set(0.5, 0.5);
        this.scoreCounter = game.add.text(game.world.centerX, this.textHeight / 2, '0', {font: fontWeight + (this.textHeight * 0.875) + 'px' + font, fill: '#fff', stroke: 'rgba(255, 220, 235, 0.6)', strokeThickness: 5});
        this.scoreCounter.anchor.set(0.5, 0.5);
        this.comboCounter = game.add.text(game.world.centerX, game.world.centerY - this.textHeight * 1.04, '', {font: fontWeight + (this.textHeight) + 'px' + font,  fill: '#fff', shadowColor: '#fff', shadowBlur: 5});
        this.comboCounter.anchor.set(1, 0.5);
        this.comboLabel = game.add.text(game.world.centerX, game.world.centerY - this.textHeight * 1.04, '', {font: fontWeight + (this.textHeight * 0.79) + 'px' + font,  fill: '#fff', shadowColor: '#fff', shadowBlur: 5});
        this.comboLabel.anchor.set(0, 0.5);
    }
    this.rules = {};
    this.rules.PERFECT_LIMIT = 50;
    this.rules.GREAT_LIMIT = 125;
    this.rules.GOOD_LIMIT = 300;
    this.rules.BAD_LIMIT = 800;
    this.rules.OVERSHOOT = 300;
    this.rules.PERFECT_MULTIPLIER = 1;
    this.rules.GREAT_MULTIPLIER = 0.88;
    this.rules.GOOD_MULTIPLIER = 0.80;
    this.rules.BAD_MULTIPLIER = 0.40;
    this.rules.BASE_MULTIPLIER = 1.1;
    this.rules.OVER_50_COMBO_MULTIPLIER = 1.1;
    this.rules.BASE_SCORE = 2525;


    this.shanPerfect = this.game.add.audio('shan_perfect');
    this.shanGreat = this.game.add.audio('shan_great');
    this.shanGood = this.game.add.audio('shan_good');
    this.shanBad = this.game.add.audio('shan_bad');
};

Scorekeeper.prototype.getRules = function () {
    return this.rules;
};

Scorekeeper.prototype.getScore = function () {
    return this.score;
};

Scorekeeper.prototype.addNoteScore = function(diff) {
    var points = this.rules.BASE_SCORE * this.rules.BASE_MULTIPLIER;
    var type = '';
    if (diff < 0) {
        type = 'MISS';
        points *= 0;
        this.score.miss++;
        this.breakCombo();
    } else if (diff < this.rules.PERFECT_LIMIT) {
        type = 'PERFECT';
        points *= this.rules.PERFECT_MULTIPLIER;
        this.score.perfect++;
        this.shanPerfect.play();
        this.incrementCombo();
    } else if (diff <  this.rules.GREAT_LIMIT) {
        type = 'GREAT';
        points *= this.rules.GREAT_MULTIPLIER;
        this.score.great++;
        this.shanGreat.play();
        this.incrementCombo();
    } else if (diff < this.rules.GOOD_LIMIT) {
        type = 'GOOD';
        points *= this.rules.GOOD_MULTIPLIER;
        this.score.good++;
        this.shanGood.play();
        this.breakCombo();
    } else  {
        type = 'BAD';
        points *= this.rules.BAD_MULTIPLIER;
        this.score.bad++;
        this.shanBad.play();
        this.breakCombo();
    }
    if (this.score.combo > 50) {
        points *= this.rules.OVER_50_COMBO_MULTIPLIER;
    }
    this.addPoints(points);
    this.flashText(this.game.world.centerY, type, this.textHeight * 1.04);
    // console.log(type + ' ' + this.score.points + ' combo ' + this.score.combo);
};

Scorekeeper.prototype.flashText = function(y, text, size) {
    var game = this.game;
    var flash = game.add.text(game.world.centerX, y, text, {font: 'bold ' + size + 'px Arial', fill: '#fff', stroke: 'rgba(255, 220, 235, 0.6)', strokeThickness: size / 5});
    flash.anchor.set(0.5, 0.5);
    game.time.events.add(100, function() {
         game.add.tween(flash).to({alpha: 0}, 150, Phaser.Easing.Quadratic.In, true);
    }, this);
};

Scorekeeper.prototype.addPoints = function(n) {
    this.score.points += Math.floor(n);
    if (this.showScore) {
        this.scoreCounter.text = this.score.points;
    }
};

Scorekeeper.prototype.incrementCombo = function(n) {
    var game = this.game;
    this.score.combo += 1;
    this.score.maxCombo = Math.max(this.score.combo, this.score.maxCombo);
    if (this.showScore) {
        this.comboLabel.text = ' combo';
        this.comboCounter.text = this.score.combo + ' ';
        game.add.tween(this.comboLabel.scale).to({x: 1.1, y:1.1}, 100, Phaser.Easing.Linear.None, true);
        game.time.events.add(100, function() {
             game.add.tween(this.comboLabel.scale).to({x: 1, y:1}, 100, Phaser.Easing.Linear.None, true);
        }, this);
        game.add.tween(this.comboCounter.scale).to({x: 1.1, y:1.1}, 100, Phaser.Easing.Linear.None, true);
        game.time.events.add(100, function() {
             game.add.tween(this.comboCounter.scale).to({x: 1, y:1}, 100, Phaser.Easing.Linear.None, true);
        }, this);
    }
};

Scorekeeper.prototype.breakCombo = function(n) {
    this.score.combo = 0;
    if (this.showScore) {
        this.comboLabel.text = '';
        this.comboCounter.text = '';
    }
};