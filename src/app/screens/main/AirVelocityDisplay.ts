// This is the class that contains the logic for dropping a ball with air
import { Container, Text } from 'pixi.js';
import { storage } from "../../../engine/utils/storage";

export class AirVelocityDisplay extends Container {
  private velocityText: Text;
  private gravityText: Text;
  private dragText: Text;
  private netText: Text;
  private buoyancyText: Text;
  private digits = 0;
  private time = 0;
  private mass = 0; 
  private area = 0; 
  private volume = 0 
  
  // Static values for all objects
  private gravity = 9.8; //for earth
  private dragCoefficient = 0.47; //for a sphere
  private airDensity = 1.225; //sea level

  constructor() {
    super();
    // Get drop type and assign mass, area, and volume
    let dropType = storage.getString('drop-type');
    if(dropType === 'basketball')
    {
      this.mass = 0.625; //in kg
      this.area = 0.0452; //meters squared 
      this.volume = 0.0079 //cubic meters
      this.digits = 3;
    }

    if(dropType === 'ping pong')
    {
      this.mass = 0.0027; //in kg
      this.area = 0.0012566; //meters squared 
      this.volume = 0.0000335 //cubic meters
      this.digits = 4;
    }

    if(dropType === 'bowling')
    {
      this.mass = 6.80389; //in kg (15lbs)
      this.area = 0.038; //meters squared 
      this.volume = 0.00547 //cubic meters
      this.digits = 2;
    }

    // Display the initial calculated texts as 0
    this.velocityText = new Text('Velocity: 0 m/s', {
      fill: '#ffffff',
      fontSize: 24,
    });
    this.velocityText.anchor.set(0.5);
    this.velocityText.position.set(0, -50);
    this.addChild(this.velocityText);

    this.gravityText = new Text('Downward Gravity Force: 0 N', {
      fill: '#ffffff',
      fontSize: 24,
    });
    this.gravityText.anchor.set(0.5);
    this.gravityText.position.set(0, 0);
    this.addChild(this.gravityText);

    this.dragText = new Text('Upward Drag Force: 0 N', {
      fill: '#ffffff',
      fontSize: 24,
    });
    this.dragText.anchor.set(0.5);
    this.dragText.position.set(0, 50);
    this.addChild(this.dragText);

    this.buoyancyText = new Text('Upward Buoyancy Force: 0 N', {
      fill: '#ffffff',
      fontSize: 24,
    });
    this.buoyancyText.anchor.set(0.5);
    this.buoyancyText.position.set(0, 100);
    this.addChild(this.buoyancyText);

    this.netText = new Text('Net Force: 0 N', {
      fill: '#ffffff',
      fontSize: 24,
    });
    this.netText.anchor.set(0.5);
    this.netText.position.set(0, 150);
    this.addChild(this.netText);
  }

  // Calculates the velocity and force values whenever the time is updated
  public updateTime(timeInSeconds: number) {
    this.time = timeInSeconds;
    //these don't change based on time
    const buoyForce = this.airDensity * this.volume * this.gravity;
    const gravityForce = this.mass * this.gravity;
    //formulas for various velocities and forces
    const terminalVelocity = Math.sqrt((2 * (this.mass * this.gravity - buoyForce)) / (this.dragCoefficient * this.airDensity * this.area))
    const velocity = terminalVelocity * Math.tanh((this.gravity * this.time) / terminalVelocity);
    const dragForce =  0.5 * this.dragCoefficient * this.airDensity * this.area * velocity ** 2;
    const netForce = gravityForce - dragForce - buoyForce;
    //display it all
    this.velocityText.text = `Velocity: ${velocity.toFixed(this.digits)} m/s`;
    this.gravityText.text = `Downward Gravity Force: ${gravityForce.toFixed(this.digits)} N`;
    this.dragText.text = `Upward Drag Force: ${dragForce.toFixed(this.digits)} N`;
    this.buoyancyText.text = `Upward Buoyancy Force: ${buoyForce.toFixed(this.digits)} N`;
    this.netText.text = `Net Force: ${netForce.toFixed(this.digits)} N`;
  }
}