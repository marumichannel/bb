
Bb.ScoreScreen = function (game) {

};

Bb.ScoreScreen.prototype = {
    create: function() {
        this.se = this.add.audio('end_beep');
        var game = this.game;
        var scorekeeper;
        if (Bb.scorekeeper) {
            scorekeeper = Bb.scorekeeper;
            scorekeeper.showscore = false;
        }
        else {
            // setup for testing
            scorekeeper = new Scorekeeper(game, false);
            game.windowHelper = new windowHelper(game);
        }
        var score = scorekeeper.getScore();
        var aspect = game.windowHelper.getScreenRatio();
        var textHeight = game.height * aspect * 0.0275;
        var strokeScale = Math.max(Math.floor(textHeight/7), 1);
        // add background
        var oldbg = game.windowHelper.addAutoScaledBackground('background');
        oldbg.alpha = 0.2;
        this.bg = game.windowHelper.addAutoScaledBackground('scorebg');
        this.bg.alpha = 0.0;

        var self = this;
        // if landscape
        if (aspect > 1) {
            self._addLandscapeScores(score);
        // condensed portrait layout
        } else {
            this._addPortraitScores(score);
        }
    },
    update: function() {

    },
    render: function() {

    },
    _roundedRect: function (rectX, rectY, w, h, fillColor, borderThickness, borderColor, cornerRadius) {
        var rect = this.game.add.bitmapData(w, h);
        w -= borderThickness * 2;
        h -= borderThickness * 2;
        var ctx = rect.ctx;
        var x = borderThickness;
        var y = borderThickness;
        if (w < 2 * cornerRadius) cornerRadius = w / 2;
        if (h < 2 * cornerRadius) cornerRadius = h / 2;
        ctx.beginPath();
        ctx.moveTo(x+cornerRadius, y);
        ctx.arcTo(x+w, y,   x+w, y+h, cornerRadius);
        ctx.arcTo(x+w, y+h, x,   y+h, cornerRadius);
        ctx.arcTo(x,   y+h, x,   y,   cornerRadius);
        ctx.arcTo(x,   y,   x+w, y,   cornerRadius);
        ctx.closePath();
        ctx.lineWidth = borderThickness;
        ctx.strokeStyle = borderColor;
        ctx.fillStyle = fillColor;
        ctx.stroke();
        ctx.fill();
        var sprite = this.game.add.sprite(rectX, rectY, rect);
        return sprite;
    },
    _addLandscapeScores: function(score) {
        var game = this.game;
        var font = ' Nunito';
        var fontWeight = '400 ';
        var aspect = game.windowHelper.getScreenRatio();
        var textHeight = game.height * aspect * 0.0275;
        var strokeScale = Math.max(Math.floor(textHeight/7), 1);

        // MC CLEAR!
        var titleY = textHeight  + 10;
        var titleStroke1 = game.add.text(game.world.centerX, titleY, "MC CLEAR!", {font: fontWeight + textHeight * 2 + 'px ' + font, fill: '#fff', strokeThickness: strokeScale * 5, stroke: "#fff"});
        var titleStroke2 = game.add.text(game.world.centerX, titleY, "MC CLEAR!", {font: fontWeight + textHeight * 2 + 'px ' + font, fill: '#fff', strokeThickness: strokeScale * 3, stroke: "#5ec"});
        var titleStroke3 = game.add.text(game.world.centerX, titleY, "MC CLEAR!", {font: fontWeight + textHeight * 2 + 'px ' + font, fill: '#fff', strokeThickness: strokeScale, stroke: "#7cf"});
        titleStroke1.anchor.set(0.5, 0.5);
        titleStroke2.anchor.set(0.5, 0.5);
        titleStroke3.anchor.set(0.5, 0.5);
        var subtitle = game.add.text(game.world.centerX, textHeight * 1.5 + 10, "エムシー クリイア！", {font: 'bold ' + textHeight * 0.5 + 'px sans-serif', fill: '#8ab', strokeThickness: strokeScale, stroke: "#fff"});
        subtitle.anchor.set(0.5, 0);

        // add character
        var character = game.add.sprite(0, game.height, 'soramaru');
        var scale = game.height / character.height;
        character.scale.set(scale,scale);
        character.anchor.set(1,1);

        game.time.events.add(500, function() {
             game.add.tween(this.bg).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.Out, true);
        }, this);
        game.time.events.add(500, function() {
             game.add.tween(character).to({x: character.width * 1.05}, 300, Phaser.Easing.Quadratic.Out, true);
        }, this);

        //points
        var scorearea = this._roundedRect(game.width, game.height * 0.48, game.width * 0.5, game.height * 0.25, '#fff', strokeScale * 2, '#ff6688', strokeScale * 4);

        var scoreY =  scorearea.height * 0.3;
        var scoreLabel = game.add.text(scorearea.width / 2.5, scoreY, 'SCORE', {font: fontWeight + textHeight * 1.5 + 'px' + font, fill: '#578'});
        scoreLabel.anchor.set(1, 0.5);
        scorearea.addChild(scoreLabel);

        var points = Phaser.Utils.pad(score.points.toString(10), 9, '0', 1);
        var scoreCounter  = game.add.text(scorearea.width - 20, scoreY, '  ' +points, {font: fontWeight + textHeight * 1.5 + 'px' + font, fill: '#f69'});
        scoreCounter.anchor.set(1, 0.5);
        scorearea.addChild(scoreCounter);

        var comboY =  scorearea.height * 0.7;
        var comboLabel = game.add.text(scorearea.width / 2.5, comboY, 'COMBO', {font: fontWeight + textHeight * 1.5 + 'px' + font, fill: '#578'});
        comboLabel.anchor.set(1, 0.5);
        scorearea.addChild(comboLabel);

        var combo = Phaser.Utils.pad(score.maxCombo.toString(10), 4, '0', 1);
        var comboCounter  = game.add.text(scorearea.width - 20, comboY, '  ' +combo, {font: fontWeight + textHeight * 1.5 + 'px' + font, fill: '#f69'});
        comboCounter.anchor.set(1, 0.5);
        scorearea.addChild(comboCounter);

        //scoreboard
        var scorebox = this._roundedRect(game.width, game.height * 0.75, game.width * 0.8, game.height * 0.2, '#fff', strokeScale * 2, '#ff6688', strokeScale * 4);
        scorebox.anchor.set(0, 0);
        var counterLabel = function(text, x, color, score){
            var labelY = scorebox.height * 0.33;
            var counterY = scorebox.height * 0.70;
            var label = game.add.text(x, labelY, text, {font: fontWeight + textHeight * 1 + 'px' + font, fill: '#fff', strokeThickness: strokeScale * 2.5, stroke: color});
            var count = Phaser.Utils.pad(score.toString(10), 4, '0', 1);
            var counter = game.add.text(x, counterY, count, {font: fontWeight + textHeight * 1.2 + 'px' + font, fill: '#f69'});
            label.anchor.set(0.5, 0.5);
            counter.anchor.set(0.5, 0.5);
            scorebox.addChild(label);
            scorebox.addChild(counter);
        };
        var perfectLabel = counterLabel('PERFECT', scorebox.width * 0.11, '#f66', score.perfect);
        var greatLabel = counterLabel('GREAT', scorebox.width * 0.3, '#f90', score.great);
        var goodLabel = counterLabel('GOOD', scorebox.width * 0.5, '#8d0', score.good);
        var badLabel = counterLabel('BAD', scorebox.width * 0.7, '#6af', score.bad);
        var missLabel = counterLabel('MISS', scorebox.width * 0.9, '#aaa', score.miss);

        game.time.events.add(700, function() {
             game.add.tween(scorebox).to({x: game.width * 0.1}, 300, Phaser.Easing.Quadratic.Out, true);
             game.add.tween(scorearea).to({x: game.width * 0.4}, 300, Phaser.Easing.Quadratic.Out, true);
            }, this);

        game.time.events.add(3000, function () {
            var pressb = game.add.text(game.world.centerX, game.height - textHeight / 2, "PRESS B", {font: 'bold ' + textHeight + 'px Arial', fill: '#f2ab41', strokeThickness: strokeScale, stroke: '#fff'});
            pressb.anchor.set(0.5, 0.5);
            pressb.alpha = 0.2;
            game.add.tween(pressb).to({alpha: 1}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

            var key = game.input.keyboard.addKey(Phaser.Keyboard.B);
            key.onDown.add(this.endGame, this);
            game.input.onDown.add(this.endGame, this);
        }, this);
    },
    _addPortraitScores: function(score) {
        var game = this.game;
        var font = ' Nunito';
        var fontWeight = '400 ';
        var aspect = game.windowHelper.getScreenRatio();
        var textHeight = game.height * 0.08;
        var strokeScale = Math.max(Math.floor(textHeight/6), 1);

        game.time.events.add(500, function() {
             game.add.tween(this.bg).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.Out, true);
        }, this);

        //points
        var scorebox = this._roundedRect(game.width, game.height * 0.10, game.width * 0.95, game.height * 0.88, '#fff', 7, '#ff6688', 20);
        scorebox.anchor.set(0, 0);
        var textX = scorebox.width * 0.05;
        var textRightX = scorebox.width * 0.95;
        var row = scorebox.height * 0.09;

        var scoreLabel = game.add.text(textX, row * 1, 'SCORE', {font: fontWeight + textHeight + 'px' + font, fill: '#578'});
        scoreLabel.anchor.set(0, 0.5);
        scorebox.addChild(scoreLabel);

        var points = Phaser.Utils.pad(score.points.toString(10), 9, '0', 1);
        var scoreCounter  = game.add.text(textRightX, row * 2, points, {font: fontWeight + textHeight + 'px' + font, fill: '#f69'});
        scoreCounter.anchor.set(1, 0.5);
        scorebox.addChild(scoreCounter);

        var comboLabel = game.add.text(textX, row * 3, 'COMBO', {font: fontWeight + textHeight + 'px' + font, fill: '#578'});
        comboLabel.anchor.set(0, 0.5);
        scorebox.addChild(comboLabel);

        var combo = Phaser.Utils.pad(score.maxCombo.toString(10), 4, '0', 1);
        var comboCounter  = game.add.text(textRightX, row * 4, combo, {font: fontWeight + textHeight + 'px' + font, fill: '#f69'});
        comboCounter.anchor.set(1, 0.5);
        scorebox.addChild(comboCounter);

        //scoreboard
        var counterLabel = function(text, y, color, score){
            var labelY = scorebox.height * 0.33;
            var counterY = scorebox.height * 0.70;
            var label = game.add.text(textX, y, text, {font: fontWeight + textHeight * 0.7 + 'px' + font, fill: '#fff', strokeThickness: strokeScale * 1.5, stroke: color});
            var count = Phaser.Utils.pad(score.toString(10), 4, '0', 1);
            var counter = game.add.text(textRightX, y, count, {font: fontWeight + textHeight * 0.9 + 'px' + font, fill: '#f69'});
            label.anchor.set(0, 0.5);
            counter.anchor.set(1, 0.5);
            scorebox.addChild(label);
            scorebox.addChild(counter);
        };
        var perfectLabel = counterLabel('PERFECT', row * 6, '#f66', score.perfect);
        var greatLabel = counterLabel('GREAT', row * 7, '#f90', score.great);
        var goodLabel = counterLabel('GOOD', row * 8, '#8d0', score.good);
        var badLabel = counterLabel('BAD', row * 9, '#6af', score.bad);
        var missLabel = counterLabel('MISS', row * 10, '#aaa', score.miss);

        game.time.events.add(700, function() {
             game.add.tween(scorebox).to({x: game.width * 0.02}, 300, Phaser.Easing.Quadratic.Out, true);
            }, this);

        // MC CLEAR!
        var titleY = textHeight * 0.5;
        var titleStroke1 = game.add.text(game.world.centerX, titleY, "MC CLEAR!", {font: '400 ' + textHeight * 0.5 + 'px ' + font, fill: '#fff', strokeThickness: strokeScale * 2, stroke: "#fff"});
        var titleStroke2 = game.add.text(game.world.centerX, titleY, "MC CLEAR!", {font: '400 ' + textHeight * 0.5 + 'px ' + font, fill: '#fff', strokeThickness: strokeScale * 1, stroke: "#5ec"});
        var titleStroke3 = game.add.text(game.world.centerX, titleY, "MC CLEAR!", {font: '400 ' + textHeight * 0.5 + 'px ' + font, fill: '#fff', strokeThickness: strokeScale, stroke: "#7cf"});
        titleStroke1.anchor.set(0.5, 0.5);
        titleStroke2.anchor.set(0.5, 0.5);
        titleStroke3.anchor.set(0.5, 0.5);
        var subtitle = game.add.text(game.world.centerX, textHeight * 0.75, "エムシー クリイア！", {font: 'bold ' + textHeight * 0.25 + 'px sans-serif', fill: '#8ab', strokeThickness: strokeScale, stroke: "#fff"});
        subtitle.anchor.set(0.5, 0);

        game.time.events.add(5000, function () {
            var pressb = game.add.text(game.world.centerX, game.height - textHeight  * 0.8, "PRESS B", {font: 'bold ' + textHeight * 0.8 + 'px Arial', fill: '#f2ab41', strokeThickness: strokeScale, stroke: '#fff'});
            pressb.anchor.set(0.5, 0.5);
            pressb.alpha = 0.2;
            game.add.tween(pressb).to({alpha: 1}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

            var key = game.input.keyboard.addKey(Phaser.Keyboard.B);
            key.onDown.add(this.endGame, this);
            game.input.onDown.add(this.endGame, this);
        }, this);
    },
    endGame: function(input) {
        if (!input.isMouse) { //only on tap or 'b', not click.
            var game = this.game;
            this.se.play();
            game.add.tween(game.world).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            game.time.events.add(2000, function () {
                document.querySelector('.hidden').className = '';
                window.addEventListener("keydown", function(e) {
                    if (e.keyCode == "66") { //b
                        location.reload();
                    }
                }, false);
                game.destroy();
                Phaser.SoundManager.context = null;
                this.webkitAudioContext = null;
            }, this);
        }
    }
};