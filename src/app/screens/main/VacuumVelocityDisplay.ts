// This is the class that contains the logic for dropping a ball in a vacuum
import { Container, Text } from 'pixi.js';

export class VacuumVelocityDisplay extends Container {
  private resultText: Text;
  private gravity = 9.8;
  private time = 0;

  constructor() {
    super();

    // Display the initial calculated velocity as 0
    this.resultText = new Text('Velocity: 0 m/s', {
      fill: '#ffffff',
      fontSize: 24,
    });
    this.resultText.anchor.set(0.5);
    this.resultText.position.set(0, 0);

    this.addChild(this.resultText);
  }

  // Calculates the velocity value whenever the time is updated
  public updateTime(timeInSeconds: number) {
    this.time = timeInSeconds;
    const velocity = this.gravity * this.time;
    this.resultText.text = `Velocity: ${velocity.toFixed(2)} m/s`;
  }
}