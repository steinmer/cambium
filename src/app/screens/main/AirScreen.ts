// This is the screen that contains the display when air is selected
import { Container } from 'pixi.js';
import { AirVelocityDisplay } from './AirVelocityDisplay';
export class AirScreen extends Container {
  public calcDisplay: AirVelocityDisplay;
  
  constructor() {
    super();

    this.calcDisplay = new AirVelocityDisplay();
    this.addChild(this.calcDisplay);
  }
}