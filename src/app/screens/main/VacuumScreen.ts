// This is the screen that contains the display when vacuum is selected
import { Container } from 'pixi.js';
import { VacuumVelocityDisplay } from './VacuumVelocityDisplay';
export class VacuumScreen extends Container {
    
  public calcDisplay: VacuumVelocityDisplay;
  constructor() {
    super();

    this.calcDisplay = new VacuumVelocityDisplay();
    this.addChild(this.calcDisplay);
  }
}