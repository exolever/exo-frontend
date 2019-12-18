import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as fromCertifications from '@core/modules/certifications/store/certifications.reducer';
import { CertificationsService } from '@core/modules/certifications/services';
import { CertificationModel } from '@core/modules/certifications/models';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { Languages } from '@ecosystem/components/first-level-certification/enum/languages';
import { TrackingService } from '@core/services/tracking/tracking.service';
import { Category, Event, EventParams } from '@core/enums/analytics.enum';

@Component({
  selector: 'app-foundation-certification',
  templateUrl: './foundation-certification-dialog.component.html',
  styleUrls: ['./foundation-certification-dialog.component.scss']
})
export class FoundationCertificationDialogComponent implements OnInit {
  @Input() entryPoint: string;
  image: string;
  lang = Languages;
  certification$: Observable<CertificationModel>;

  constructor(
    private store: Store<AppState>,
    private certificationsService: CertificationsService,
    private tracking: TrackingService
  ) { }

  ngOnInit() {
    this.certification$ = this.store.pipe(
      select(state => fromCertifications.getCertification(state.certifications, {code: CertificationEnum.FOUNDATION})),
      filter(certification => certification !== undefined));
  }

  sendAction(certification: CertificationModel, language: Languages) {
    if (language === Languages.english) {
      this.tracking.track(
        Category.FOUNDATIONS,
        Event.STARTED,
        {
          language: EventParams.ENGLISH,
          foundationsEntryPoint: this.entryPoint
        }
      );
    }

    if (language === Languages.spanish) {
      this.tracking.track(
        Category.FOUNDATIONS,
        Event.STARTED,
        {
          language: EventParams.SPANISH,
          entryPoint: this.entryPoint
        }
      );
    }

    this.certificationsService.joinCertification(certification, language).subscribe((data: {nextURL: string}) => {
      if (data.nextURL) {
        window.location.href = data.nextURL;
      }
    });
  }

  getImage(certification: CertificationModel) {
    return this.certificationsService.getCertificateImage(certification);
  }
}
