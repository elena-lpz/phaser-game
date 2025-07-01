import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(400, 300, "background");

    this.add.image(400, 300, "phaser").setScale(0.5);

    this.add
      .text(512, 460, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(1);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
