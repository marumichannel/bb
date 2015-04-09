Bb.Game = function (game) {};

Bb.Game.prototype = { 
    preload: function () {

    }, 
    create: function () {
        var game = this.game;
        var self = this;
        var testScore = [16454, 17206, 
                         19464, 20320, 
                         22544, 22936,
                         25533, 25931, 26294,
                         28378, 28572, 28828, 29144,
                         31254, 31379, 31544, 31713, 32044,
                         34216, 34463];
        var bbNotes = [34795, 35545,
                       37825, 38625,
                       40885, 41075,
                       43855, 44255, 44635,
                       46705, 46835, 47120, 47500,
                       49570, 49730, 49825, 50075, 50390,
                       52550, 52770,
                       90185, 90855,
                       92730, 93050,
                       95155, 95330, 95460,
                       97630, 97755, 97940, 98060, 98220,
                       99925, 100120, 100285, 100405, 100540, 100635,
                       102310, 102430, 102515, 102635, 102755, 102885,
                       104650, 104750, 104850, 104950, 105185, 105385,
                       107795, 107965, 108165, 108305, 108440, 108605, 108725, 108895, 109095
                       ];
        this.notes = bbNotes;
        var aspect = game.windowHelper.getScreenRatio();
        var scaling = game.world.height / 210 * (aspect > 1 ? 0.25 : 0.25);
        this.textHeight = game.world.height / 10 *(aspect > 1 ? 1 : 0.8);
        this.songPosition = 0;
        this.tracks = [];
        this.tracks[1] = new Track({
            game: this.game,
            id: 'main',
            origin: {x: game.world.centerX, y: game.world.height * 0.2},
            target: {x: game.world.centerX, y: game.world.height * 0.99 - (scaling * 105)},
            targetSprite: 'loveliver',
            score: this.notes,
            scaling: scaling,
        });
        var bg = game.windowHelper.addAutoScaledBackground('background');
        game.add.tween(bg).to({alpha: 0.2}, 1500, Phaser.Easing.Linear.None, true);
        Bb.scorekeeper = new Scorekeeper(game, true, this.textHeight);
        this.music = game.add.audio('mc01');
        this.clearSE = game.add.audio('serifu01');
        game.time.events.add(1500, function() {
            self.tracks[1].init();
        });
        game.time.events.add(2500, function() {
            self.music.fadeIn(1000, false);
            // input
            var sendButton = function() {
                self.tracks[1].touch(self.music.currentTime);
            };
            var key = game.input.keyboard.addKey(Phaser.Keyboard.B);
            key.onDown.add(sendButton, this);
            self.tracks[1].getButton().onInputDown.add(sendButton, this);
        });
        var goToScores = function() {
            this.state.start('ScoreScreen');
        };
        this.music.onStop.add(this.setReady, this);
    }, 
    update: function () {
        var game = this.game;
        this.songPosition = this.music.currentTime;
    }, 
    render: function () {
        var game = this.game;
        this.tracks[1].drawNotes(this.songPosition);
    },
    setReady: function() {
        var delay = 3000;
        if (Bb.scorekeeper.getScore().combo === this.notes.length) {
            this.displayFullCombo(delay, 'FULL COMBO');
            delay += 3200;
        }
        this.displayClearMessage(delay,　'MC成功');
        delay += 3000;
        this.game.time.events.add(delay, function() {
            this.state.start('ScoreScreen');
        }, this);
    },
    displayFullCombo: function(startDelay, text) {
        var game = this.game;
        var fontWeight = 'bold ';
        var font = ' Arial';
        var textHeight = this.textHeight * 1.05;
        var strokeScale = this.textHeight / 40;
        var color1 = '#7ae';
        var color2 = '#fff';
        var repeat = 8;
        var comboGroup = game.add.group();
        var comboAnimation = function(scale, duration, delay, final){
            console.log(delay);
            game.time.events.add(delay, function() {
                if (!final) {
                    var layer1 = game.add.text(game.world.centerX, game.world.centerY, text, {font: fontWeight + textHeight + 'px' + font, fill: color1, strokeThickness: strokeScale *  4, stroke: color1});
                    layer1.anchor.set(0.5,0.5);
                    layer1.alpha = 0.5;
                    var layer2 = game.add.text(game.world.centerX, game.world.centerY, text, {font: fontWeight + textHeight + 'px' + font, fill: 'rgba(0,0,0,0)', strokeThickness: strokeScale * 1, stroke: color2});
                    layer2.anchor.set(0.5,0.5);
                    layer2.alpha = 0.5;
                    game.add.tween(layer1.scale).from({x: scale, y: scale}, duration, Phaser.Easing.Linear.None, true);
                    game.add.tween(layer2.scale).from({x: scale, y: scale}, duration, Phaser.Easing.Linear.None, true);
                    comboGroup.add(layer1);
                    comboGroup.add(layer2);
                } else {
                    var finalShine = game.add.text(game.world.centerX, game.world.centerY, text, {font: fontWeight + textHeight + 'px' + font, fill: '#fff', strokeThickness: strokeScale * 4, stroke: '#fff'});
                    finalShine.anchor.set(0.5,0.5);
                    finalShine.alpha = 0.0;
                    game.add.tween(finalShine).to({alpha: 1}, 300, Phaser.Easing.Sinusoidal.InOut, true, 0, 2, true);
                    comboGroup.add(finalShine);
                }
            });
        };
        var delay;
        game.time.events.add(startDelay, function() {
            var comboSE = game.add.audio('full_combo');
            comboSE.play();
        }, this);
        for (var i = 0; i < repeat; i++) {
            delay = (i * 100) - (i * i * 3) + startDelay;
            comboAnimation(5, 200, delay, false);
        }
        i++;
        delay = (i * 100) - (i * i * 3) + 200 + startDelay;
        comboAnimation(5, 200, delay, true);
        delay += 2000;
        game.time.events.add(delay, function() {
            comboGroup.destroy();
        }, this);
    },
    displayClearMessage: function(startDelay, text) {
        var game = this.game;
        var fontWeight = 'bold ';
        var font = ' Arial';
        var textHeight = this.textHeight * 2.5;
        var shadowScale = this.textHeight / 10;
        var color1 = '#eed';
        var color2 = '#b92';
        var clearGroup = game.add.group();
        var clearAnimation = function(scale, duration){
            var layer1 = game.add.text(game.world.centerX, game.world.centerY, text, {font: fontWeight + textHeight + 'px' + font, fill: color1, shadowColor: color2, shadowBlur: shadowScale});
            layer1.anchor.set(0.5,0.5);
            layer1.alpha = 0.0;
            game.add.tween(layer1.scale).from({x: scale, y: scale}, duration, Phaser.Easing.Elastic.Out, true);
            game.add.tween(layer1).to({alpha: 1}, duration / 2, Phaser.Easing.Linear.None, true);
            clearGroup.add(layer1);
        };
        game.time.events.add(startDelay, function() {
            this.clearSE.play();
            clearAnimation(1.5, 1500);
        }, this);
    }
};
