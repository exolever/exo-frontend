import { Component } from '@angular/core';

import { Urls } from '@core/services';
import { ConsentService } from './consent.service';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent {
  urlHome = Urls.ECOSYSTEM;
  showQuestion = true;
  constructor(private consentService: ConsentService) { }

  sendAction(value: boolean) {
    this.consentService.sendConsent(value).subscribe(
      () => this.showQuestion = false
    );
  }
}
