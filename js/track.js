var Track = function (properties) {
    this.game = properties.game;
    this.origin = properties.origin || {x: 0, y: 0};
    this.target = properties.target || {x: 0, y: 0};
    this.targetSprite = properties.targetSprite || '';
    this.button = {};
    this.throbber = {};
    this.score = properties.score || [];
    this.playing = false;
    this.startTime = 0;
    this.interval = 1500;
    this.currentNotes = {};
    this.scaling = properties.scaling || 0.3;
    this.notePool = {};
    return this;
};
Track.prototype.init = function () {
    var game = this.game;
    this.button = game.add.button(this.target.x, this.target.y, this.targetSprite);
    this.button.scale.setTo(this.scaling, this.scaling);
    this.button.anchor.setTo(0.5, 0.5);

    this.notePool = game.add.group();
    this.notePool.createMultiple(100, 'rings', 1);
    this.notePool.setAll('anchor.x', 0.5);
    this.notePool.setAll('anchor.y', 0.5);

    var additionalScaling = 0.95;
    this.popPool = game.add.group();
    this.popPool.createMultiple(100, 'pop');
    this.popPool.setAll('anchor.x', 0.5);
    this.popPool.setAll('anchor.y', 0.5);
    this.popPool.setAll('scale.x', this.scaling * additionalScaling);
    this.popPool.setAll('scale.y', this.scaling * additionalScaling);
    this.popPool.setAll('alpha', 0.8);
    this.popPool.forEach(function (pop) {
      pop.animations.add('pow', [0,1,2,3,4,5,6,7], 20);
    });

    // draw sprites once to prevent lag during gameplay.
    var notePrime = this.notePool.getFirstExists(false);
    notePrime.alpha = '0.01';
    notePrime.reset(0,0);
    var popPrime = this.popPool.getFirstExists(false);
    popPrime.alpha = '0.01';
    popPrime.reset(0,0);
    popPrime.play('pow', 30, false, false);
    game.time.events.add(1000, function() {
        notePrime.destroy();
        popPrime.destroy();
    });

    this.throbber = game.add.group();
    game.add.text(0, 0, '♫', {font: '400 300px Arial', fill: '#ecd', strokeThickness: 10, stroke: '#fff'}, this.throbber);
    game.add.text(0, 0, '♪', {font: 'bold 100px Arial', fill: '#ecd', strokeThickness: 10, stroke: '#fff'}, this.throbber);
    game.add.text(300, 300, '♪', {font: 'bold 100px Arial', fill: '#ecd', strokeThickness: 10, stroke: '#fff'}, this.throbber)
    .anchor.setTo(1, 1);
    this.throbber.alpha = 0.5;
    this.throbber.x = this.origin.x - 150 * this.scaling;
    this.throbber.y = this.origin.y - 150 * this.scaling;
    this.throbber.scale.setTo(this.scaling, this.scaling);
    var tween1 = game.add.tween(this.throbber.scale).to({x: this.scaling + 0.04, y: this.scaling + 0.04}, 1000, Phaser.Easing.Quadratic.InOut);
    var tween2 = game.add.tween(this.throbber.scale).to({x: this.scaling, y: this.scaling}, 1000, Phaser.Easing.Quintic.InOut);
    tween1.chain(tween2);
    tween2.chain(tween1);
    tween1.start();

};
Track.prototype.play = function () {
    this.playing = true;
    this.startTime = 0;
};
Track.prototype.popNote = function (note, diff) {
    var currentNote, pop, pow;
    // remove from current
    for (var n in this.currentNotes) {
        if (this.currentNotes.hasOwnProperty(n)) {
            currentNote = this.currentNotes[n];
            if (currentNote.health === note) {
                currentNote.kill();
                this.score[this.score.indexOf(note)] = -1;
                pop = this.popPool.getFirstExists(false);
                pop.reset(currentNote.x, currentNote.y);
                pop.play('pow', 30, false, true);
            }
        }
    }
    // add score
    Bb.scorekeeper.addNoteScore(diff);
};
Track.prototype.touch = function (position) {
    var rules = Bb.scorekeeper.getRules();
    targetNote = this.nearestNote(position, rules.OVERSHOOT);
    var diff = Math.abs(targetNote - position);
    if (targetNote + rules.OVERSHOOT > position && diff < rules.BAD_LIMIT) {
        this.popNote(targetNote, diff);
    }
};
Track.prototype.nearestNote = function (position, overshoot) {
    var nearest = -1;
    for (var i = this.score.length - 1; i >= 0; i--) {
        var note = this.score[i];
        if (note + overshoot > position) {
            nearest = note;
        } else {
            return nearest;
        }
    }
    return nearest;
};
Track.prototype.drawNote = function(n, r, pos) {
    var pointBetween = function (p1, p2, r) {
    return {x: (1 - r) * p1.x + r * p2.x,
            y: (1 - r) * p1.y + r * p2.y};
    };
    if (r > 1.3) {
        if (this.currentNotes[n].alive) {
            console.log('MISS');
            this.currentNotes[n].destroy();
            Bb.scorekeeper.addNoteScore(-1);
        }
    } else {
        var location = pointBetween(this.origin, this.target, r);
        if (!this.currentNotes[n]) {
            this.currentNotes[n] = this.notePool.getFirstExists(false);
            this.currentNotes[n].reset(location.x, location.y);
            this.currentNotes[n].health = pos;
        } else {
            this.currentNotes[n].x = location.x;
            this.currentNotes[n].y = location.y;
        }
        r = Math.min(r, 1);
        r = (r + 0.08) * (1 / 1.08);
        this.currentNotes[n].scale.setTo(r * this.scaling, r * this.scaling);
    }
};
Track.prototype.drawNotes = function (currentTime) {
    for (var i = 0; i < this.score.length; i ++) {
        var note = this.score[i];
        if (note > currentTime - 5000 && note < currentTime + this.interval) {
            r = 1 - ((note - currentTime) / this.interval);
            this.drawNote(i, r, note);
        }
    }
};
Track.prototype.getButton = function() {
    return this.button;
};

