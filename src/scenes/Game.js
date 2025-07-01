import Phaser from "phaser";

import { Player } from "../gameObjects/Player.js";

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  //this physics uses the arcade physics system. You must set the physics property before creating any physics
  //object or it will cause runtime errors.
  create() {
    this.add.image(400, 300, "sky");
    //this creates a new static physics group and assigns it to the local var platforms. Two types of physics in arcade mode:
    //dynamic: body can move around via forces like velocity or acceletarion. Can bounce and colilide with other object. Collision is infliences by the mass of the body.
    //static: simply has position and size, not affectec by gravity, no vlocity and it doesnt move when something collides against it (like the platforms)
    this.platforms = this.physics.add.staticGroup();
    // use group to control similar objects as one single unit
    //Physics group will automatically create physics enabled childred

    //this is the ground //refreshbody tells the physics world about the changes (setscale(2))
    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
    //these are the platforms
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");

    this.player = new Player(this, 100, 450);

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else {
      this.player.idle();
    }

    if (this.cursors.up.isDown) {
      this.player.jump();
    }
  }
  collectStar(player, star) {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      this.releaseBomb();
    }
  }

  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    this.time.delayedCall(2000, () => {
      this.scene.start("GameOver");
    });
  }

  releaseBomb() {
    var x =
      this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = this.bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 300), 20);
  }
}
