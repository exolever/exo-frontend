import { Component, OnInit, Input } from '@angular/core';
import { AlertModel, typeAlertEnum } from './alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() typeAlert: typeAlertEnum;
  @Input() icon: string;
  @Input() color: string;
  @Input() message = '';

  public styleAlert: AlertModel;

  ngOnInit() {
    this.styleAlert = new AlertModel();
    if (typeof this.typeAlert !== 'undefined') {
      this.styleAlert.setTypeAlert(this.typeAlert);
    } else if (this.icon && this.color) {
      this.styleAlert.setCustomAlert(this.color, this.icon);
    } else if (this.icon) {
      this.styleAlert.setIcon(this.icon);
    } else if (this.color) {
      this.styleAlert.setColor(this.color);
    }
    this.message = this.parseMessage(this.message);
  }
  // this function will deserialize the message you need put % between word or phrase that you want put the color.
  // example the %message%
  parseMessage(message: string): string {
    const arrayMessage = message.split('%');
    return arrayMessage.map((mess, index) => {
      return index % 2 === 0 || mess === '' ?
        mess :
        '<label class="' + this.styleAlert.color + '-color">' + mess + '</label>';
    }).join('');
  }

}
