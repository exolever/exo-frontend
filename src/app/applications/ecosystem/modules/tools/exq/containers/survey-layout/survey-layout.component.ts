import { Component } from '@angular/core';
import { Urls } from '@app/core';

@Component({
  templateUrl: './survey-layout.component.html',
  styleUrls: ['./survey-layout.component.scss']
})
export class SurveyLayoutComponent {

  newSurveyAddress = Urls.ECOSYSTEM_EXQ_NEW;

}
