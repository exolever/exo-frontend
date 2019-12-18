import { Component, ContentChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'show-hide-password',
  templateUrl: './passwordinput.component.html',
  styleUrls: ['./passwordinput.component.scss']
})

export class PasswordinputComponent {

  private show = false;
  @ContentChild('showHideInput', {static: false}) input;

  constructor(private renderer: Renderer2) { }

  /**
   * toggles the type attribute of the password field between visible text and hidden characters
   * @param event
   */
  toggleShowHidePassword(event) {
    this.show = !this.show;

    this.renderer
      .setProperty(this.input.nativeElement, 'type', this.getValuesToApply().type);
    this.renderer
      .setProperty(event.currentTarget, 'textContent', this.getValuesToApply().textContent);
  }

  /**
   * gets the values to apply to the password field properties depending on the state of the show property
   * of this component
   * @returns {{type: string; textContent: string}}
   */
  getValuesToApply(): { type: string, textContent: string } {
    return this.show ?
      {type: 'text', textContent: 'visibility_off'} :
      {type: 'password', textContent: 'visibility'};
  }
}
