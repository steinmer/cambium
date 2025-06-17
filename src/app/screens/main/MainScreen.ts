// This is the main screen where you run the simulation
import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import type { Text } from "pixi.js";
import { Container } from "pixi.js";
import * as PIXI from 'pixi.js';
import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { VacuumScreen } from './VacuumScreen';
import { LoadScreen } from '../LoadScreen';
import { AirScreen } from './AirScreen';
import { AtmosphereSelector } from './AtmosphereSelector';
import { Sprite, Texture } from "pixi.js";
import { storage } from "../../../engine/utils/storage";
import { Button } from "../../ui/Button";

export class MainScreen extends Container {
  public static assetBundles = ["main"];
  public dropType = '';
  public mainContainer: Container;
  private pauseButton: FancyButton;
  private restartButton: FancyButton;
  private startButton: FancyButton;  
  private menuButton: FancyButton;
  private paused = false;
  private atmosphereSelector: AtmosphereSelector;
  private elapsedTime = 0;
  private timerRunning = false;
  private timerText: Text;
  private currentScreen: Container | null = null;
  private vacuumScreen: VacuumScreen;
  private airScreen: AirScreen;
  private basketballSprite: Sprite;
  private pingSprite: Sprite;
  private bowlingSprite: Sprite;

  constructor() {
    super();
    // Initialize all containers and the selector
    this.mainContainer = new Container();
    this.addChild(this.mainContainer);
    this.vacuumScreen = new VacuumScreen();
    this.airScreen = new AirScreen();
    this.atmosphereSelector = new AtmosphereSelector();
    this.atmosphereSelector.selectorButton.onPress.connect(() => {
      const selected = this.atmosphereSelector.selectedOption;
      this.switchToScreen(selected.includes('Vacuum') ? 'vacuum' : 'air');
    });
    this.addChild(this.atmosphereSelector);
    this.switchToScreen('vacuum');

    const buttonAnimations = {
      hover: {
        props: {
          scale: { x: 1.1, y: 1.1 },
        },
        duration: 100,
      },
      pressed: {
        props: {
          scale: { x: 0.9, y: 0.9 },
        },
        duration: 100,
      },
    };

    // Pause Button
    this.pauseButton = new FancyButton({
      defaultView: "icon-pause.png",
      anchor: 0.5,
      animations: buttonAnimations,
    });
    this.pauseButton.onPress.connect(() =>
      engine().navigation.presentPopup(PausePopup),
    );
    this.addChild(this.pauseButton);

    //Timer Text
    this.timerText = new PIXI.Text('Time: 0.00s', {
      fill: '#ffffff',
      fontSize: 28,
    });
    this.timerText.anchor.set(0.5);
    this.addChild(this.timerText);

    //Restart Button
    this.restartButton = new Button({
      text: "Restart",
      width: 175,
      height: 110,
    });
     
    this.restartButton.onPress.connect(() => {
      this.elapsedTime = 0;
      this.timerText.text = 'Time: 0.00s';
      this.vacuumScreen.calcDisplay.updateTime(0);
      this.airScreen.calcDisplay.updateTime(0);
    });
    this.addChild(this.restartButton);

    //Main Menu Button
    this.menuButton = new Button({
      text: "Main Menu",
      width: 175,
      height: 110,
    });
   
    this.menuButton.onPress.connect(() => {
      engine().navigation.hideAndRemoveScreen(this);
      engine().navigation.showScreen(LoadScreen);
    });
    this.addChild(this.menuButton);

    //Start Button
    this.startButton = new Button({
      text: "Start",
      width: 175,
      height: 110,
    });

   this.startButton.onPress.connect(() => {
      this.timerRunning = !this.timerRunning;
      this.startButton.text = this.timerRunning ? 'Stop' : 'Start';
    });
    this.addChild(this.startButton);

    // Get drop type and show the correct picture.
    let drop = storage.getString('drop-type');
    const basketballTexture = Texture.from('basketball.jpg');
    this.basketballSprite = new Sprite(basketballTexture);
    
    const pingTexture = Texture.from('ping.jpg');
    this.pingSprite = new Sprite(pingTexture);

    const bowlTexture = Texture.from('bowling.jpg');
    this.bowlingSprite = new Sprite(bowlTexture);

    if(drop === 'basketball')
    {
        this.basketballSprite.anchor.set(0.5);
        this.basketballSprite.scale.set(0.5);
        this.addChild(this.basketballSprite);
    }

    if(drop === 'ping pong')
    {
        this.pingSprite.anchor.set(0.5);
        this.pingSprite.scale.set(0.8);
        this.addChild(this.pingSprite);
    }

    if(drop === 'bowling')
    {
        this.bowlingSprite.anchor.set(0.5);
        this.bowlingSprite.scale.set(0.5);
        this.addChild(this.bowlingSprite);
    }
  }

  /** Prepare the screen just before showing */
  public prepare() {}

  /** Update the screen */
  public update(ticker: Ticker) {
    if (this.paused) return;

    if (this.timerRunning) {
      this.elapsedTime += ticker.elapsedMS / 1000; // convert ms to seconds
      this.timerText.text = `Time: ${this.elapsedTime.toFixed(2)}s`;
      this.vacuumScreen.calcDisplay.updateTime(this.elapsedTime);
      this.airScreen.calcDisplay.updateTime(this.elapsedTime);
    }
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause() {
    this.mainContainer.interactiveChildren = false;
    this.paused = true;
  }

  /** Resume gameplay */
  public async resume() {
    this.mainContainer.interactiveChildren = true;
    this.paused = false;
  }

  /** Fully reset */
  public reset() {}

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    this.mainContainer.x = centerX;
    this.mainContainer.y = centerY;    
    this.basketballSprite.x = centerX;
    this.basketballSprite.y = centerY - 200;
    this.pingSprite.x = centerX;
    this.pingSprite.y = centerY - 200;
    this.bowlingSprite.x = centerX;
    this.bowlingSprite.y = centerY - 200;    
    this.menuButton.x = width - 100;
    this.menuButton.y = 50;
    this.pauseButton.x = 30;
    this.pauseButton.y = 30;
    this.startButton.x = width / 2 - 100;
    this.startButton.y = height - 75;
    this.restartButton.x = width / 2 + 100;
    this.restartButton.y = height - 75;
    this.timerText.x = width / 2;
    this.timerText.y = 50;
    this.atmosphereSelector.position.set(centerX - 75, 160);
    this.vacuumScreen.position.set(centerX, centerY);
    this.airScreen.position.set(centerX, centerY);
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    const elementsToAnimate = [
      this.pauseButton,
      this.restartButton,
      this.startButton,
    ];

    let finalPromise!: AnimationPlaybackControls;
    for (const element of elementsToAnimate) {
      element.alpha = 0;
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: "backOut" },
      );
    }

    await finalPromise;
    
  }

  /** Hide screen with animations */
  public async hide() {}

  /** Auto pause the app when window go out of focus */
  public blur() {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup);
    }
  }

  /** Switch between air and vaccum on button click  */
  private switchToScreen(type: 'vacuum' | 'air') {
    if (this.currentScreen) {
      this.removeChild(this.currentScreen);
    }

    if (type === 'vacuum') {
      this.currentScreen = this.vacuumScreen;
    } else {
      this.currentScreen = this.airScreen;
    }

    this.currentScreen.position.set(
      window.innerWidth / 2,
      window.innerHeight / 2);
    this.addChild(this.currentScreen);
  }
}
