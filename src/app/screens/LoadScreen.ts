// This is the initial screen where you select which ball to drop
import { Container, Sprite, Texture } from "pixi.js";
import { storage } from "../../engine/utils/storage";
import { engine } from "../getEngine";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { MainScreen } from "../screens/main/MainScreen";

export class LoadScreen extends Container {
  public static assetBundles = ["preload", "main"];
  public dropType = '';
  private title: Label;
  private basketballButton: Button;
  private pingButton: Button;
  private bowlingButton: Button;

  constructor() {
    super();

    // Title
    this.title = new Label({
      text: "Choose the item to drop!",
      style: { fill: 0xec1561, fontSize: 50 },
    });
    this.addChild(this.title);

    // Basketball Button
    const basketballTexture = Texture.from('basketball.jpg');
    this.basketballButton = new Button({ width: 300, height: 400 });
    const basketballSprite = new Sprite(basketballTexture);
    basketballSprite.anchor.set(0.5);
    basketballSprite.scale.set(0.8);
    this.basketballButton.addChild(basketballSprite);
    this.basketballButton.onPress.connect(() => {
      storage.setString('drop-type', 'basketball');
      engine().navigation.hideAndRemoveScreen(this);
      engine().navigation.showScreen(MainScreen);
    });
    this.addChild(this.basketballButton);

    // Ping Pong Button
    const pingTexture = Texture.from('ping.jpg');
    this.pingButton = new Button({ width: 300, height: 400 });
    const pingSprite = new Sprite(pingTexture);
    pingSprite.anchor.set(0.5);
    this.pingButton.addChild(pingSprite);
    this.pingButton.onPress.connect(() => {
      storage.setString('drop-type', 'ping pong');
      engine().navigation.hideAndRemoveScreen(this);
      engine().navigation.showScreen(MainScreen);
    });
    this.addChild(this.pingButton);

    // Bowling Ball Button
    const bowlingTexture = Texture.from('bowling.jpg');
    this.bowlingButton = new Button({ width: 300, height: 400 });
    const bowlingSprite = new Sprite(bowlingTexture);
    bowlingSprite.anchor.set(0.5);
    bowlingSprite.scale.set(0.5);
    this.bowlingButton.addChild(bowlingSprite);
    this.bowlingButton.onPress.connect(() => {
      storage.setString('drop-type', 'bowling');
      engine().navigation.hideAndRemoveScreen(this);
      engine().navigation.showScreen(MainScreen);
    });
    this.addChild(this.bowlingButton);
  }

   /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    this.basketballButton.x = centerX;
    this.basketballButton.y = centerY;
    this.pingButton.x = centerX - 400;
    this.pingButton.y = centerY;
    this.bowlingButton.x = centerX + 400;
    this.bowlingButton.y = centerY;
    this.title.y = 100;
    this.title.x = centerX;
  }

}
