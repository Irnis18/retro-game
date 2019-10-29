import 'phaser';
import Button from '../objects/button';
import AlignGrid from '../objects/alignGrid';

let player;
let consolls;
let restartButton;
let bombs;
let goal;
let platforms;
let cursors;
let score = 0;
let retryButton;
let gameOver = false;
let scoreText;

export default class GameMapOneScene extends Phaser.Scene {
  constructor() {
    super('GameMapOne');
  }

  preload() {
    this.load.image('forest', 'assets/img/maps/map4.png');
    this.load.image('ground', 'assets/img/platform/platform.png');
    this.load.image('consoll', 'assets/img/consolle-small.png');

    this.load.image('bomb', 'assets/img/bomb.png');
    this.load.image('goal', 'assets/img/goal.png');
    this.load.spritesheet('dude', 'assets/img/dude2.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
  }

  goalReached(player, goal) {}

  collectConsoll(player, consoll) {
    consoll.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (consolls.countActive(true) === 0) {
      //  A new batch of stars to collect
      consolls.children.iterate(function(child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  create() {
    this.gameMapOneSceneGrid = new AlignGrid({
      scene: this,
      cols: 9,
      rows: 9
    });

    this.add.image(400, 300, 'forest');

    platforms = this.physics.add.staticGroup();

    platforms
      .create(400, 568, 'ground')
      .setScale(2)
      .refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(60, 420, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.5);
    player.setCollideWorldBounds(true);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    consolls = this.physics.add.group({
      key: 'consoll',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    consolls.children.iterate(function(child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(consolls, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, consolls, this.collectConsoll, null, this);

    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    this.physics.add.overlap(player, goal, this.goalReached, null, this);
  }

  update() {
    if (score >= 500) {
    }
    if (gameOver) {
      retryButton;
    }
    if (!gameOver) {
      retryButton = null;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);

      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }else if (cursors.down.isDown) {
      player.setVelocityY(200);
    }
  }
}