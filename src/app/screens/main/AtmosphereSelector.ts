// This is the class that holds the logic for selecting between air and vacuum
import { Container, Text } from 'pixi.js';
import { Button } from '../../ui/Button';

export class AtmosphereSelector extends Container {
  private labelText: Text;
  public selectorButton: Button;
  private options = ['No Air (Vacuum)', 'With Air'];
  private selectedIndex = 0;

  constructor() {
    super();

    this.labelText = new Text('Atmosphere Type:', {
      fill: '#ffffff',
      fontSize: 24,
    });
    this.labelText.anchor.set(0, 0.5);
    this.labelText.position.set(-130, -33);

    this.selectorButton = new Button({
      text: this.options[this.selectedIndex],
      width: 300,
      height: 100,
    });
    this.selectorButton.position.set(220, -30);

    this.selectorButton.onPress.connect(() => {
      this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
      this.selectorButton.text = this.options[this.selectedIndex];
    });

    this.addChild(this.labelText, this.selectorButton);
  }

  get selectedOption(): string {
    return this.options[this.selectedIndex];
  }
}