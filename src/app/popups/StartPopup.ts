import { animate } from "motion";
import { BlurFilter, Container, Sprite, Texture } from "pixi.js";
import { storage } from "../../engine/utils/storage";
import { engine } from "../getEngine";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { RoundedBox } from "../ui/RoundedBox";

export class StartPopup extends Container {
  /** The dark semi-transparent background covering current screen */
  public dropType = '';
  private bg: Sprite;
  /** Container for the popup UI components */
  private panel: Container;
  /** The popup title label */
  private title: Label;
  /** Button that closes the popup */
  private basketballButton: Button;
  private pingButton: Button;
  private blockButton: Button;
  /** The panel background */
  private panelBase: RoundedBox;

  constructor() {
    super();

    this.bg = new Sprite(Texture.WHITE);
    this.bg.tint = 0x0;
    this.bg.interactive = true;
    this.addChild(this.bg);

    this.panel = new Container();
    this.addChild(this.panel);

    this.panelBase = new RoundedBox({ height: 600, width: 900 });
    this.panel.addChild(this.panelBase);

    this.title = new Label({
      text: "Choose the item to drop!",
      style: { fill: 0xec1561, fontSize: 50 },
    });
    this.title.y = -250;
    this.panel.addChild(this.title);

    this.basketballButton = new Button({ text: "Basketball" });
    this.basketballButton.x = -300;
    this.basketballButton.y = 250;
    this.basketballButton.onPress.connect(() => {
      storage.setString('drop-type', 'basketball');
      engine().navigation.dismissPopup();
    });
    this.panel.addChild(this.basketballButton);

    this.pingButton = new Button({ text: "Ping Pong Ball" });
    this.pingButton.y = 250;
    this.pingButton.onPress.connect(() => {
      storage.setString('drop-type', 'ping pong');
      engine().navigation.dismissPopup();
    });
    this.panel.addChild(this.pingButton);

    this.blockButton = new Button({ text: "Block" });
    this.blockButton.y = 250;
    this.blockButton.x = 300;
    this.blockButton.onPress.connect(() => {
      storage.setString('drop-type', 'block');
      engine().navigation.dismissPopup();
    });
    this.panel.addChild(this.blockButton);
  }

  /** Resize the popup, fired whenever window size changes */
  public resize(width: number, height: number) {
    this.bg.width = width;
    this.bg.height = height;
    this.panel.x = width * 0.5;
    this.panel.y = height * 0.5;
  }

  /** Present the popup, animated */
  public async show() {
    const currentEngine = engine();
    if (currentEngine.navigation.currentScreen) {
      currentEngine.navigation.currentScreen.filters = [
        new BlurFilter({ strength: 5 }),
      ];
    }
    this.bg.alpha = 0;
    this.panel.pivot.y = -400;
    animate(this.bg, { alpha: 0.8 }, { duration: 0.2, ease: "linear" });
    await animate(
      this.panel.pivot,
      { y: 0 },
      { duration: 0.3, ease: "backOut" },
    );
  }

  /** Dismiss the popup, animated */
  public async hide() {
    const currentEngine = engine();
    if (currentEngine.navigation.currentScreen) {
      currentEngine.navigation.currentScreen.filters = [];
    }
    animate(this.bg, { alpha: 0 }, { duration: 0.2, ease: "linear" });
    await animate(
      this.panel.pivot,
      { y: -500 },
      { duration: 0.3, ease: "backIn" },
    );
  }
}
