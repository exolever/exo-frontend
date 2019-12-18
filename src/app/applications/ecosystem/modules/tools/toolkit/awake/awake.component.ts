import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Urls } from '@app/core';
import { UserCertificationModel } from '@core/models/user/user-certification.model';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { RequiredCertificationDialogComponent } from '@shared/components';
import { select, Store } from '@ngrx/store';
import * as fromUser from '@core/store/user/user.reducer';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from '@core/store/reducers';
import { Subscription } from 'rxjs';
import { CertificationModel } from '@core/modules/certifications/models';

@Component({
  templateUrl: './awake.component.html',
  styleUrls: ['./awake.component.scss']
})
export class AwakeComponent implements OnInit, OnDestroy {
  tabs = [];
  subscriptions = new Subscription();
  allowed = false;

  constructor(
    private matDialog: MatDialog,
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.tabs = [
      {
        label: this.translate.instant('TOOLKIT.AWAKE.TABS.EN.TITLE'),
        link: Urls.AWAKE_EN
      },
      {
        label: this.translate.instant('TOOLKIT.AWAKE.TABS.ES.TITLE'),
        link: Urls.AWAKE_ES
      }
    ];
    this.subscriptions.add(
      this.store.pipe(select(state => fromUser.getUser(state))).subscribe(user => {
        this.allowAccess(user.certifications);
      })
    );
  }

  private allowAccess(certifications: UserCertificationModel[]) {
    this.allowed = !!certifications.find((cert: UserCertificationModel) => cert.code === CertificationEnum.FOUNDATION);
    if (!this.allowed) {
      this.matDialog.open(RequiredCertificationDialogComponent, {
        data: {
          certification: new CertificationModel(CertificationEnum.FOUNDATION, null, null, null),
          // Prefix will need in json file a TITLES and a MESSAGE object
          prefix: 'TOOLKIT.DIALOG',
        },
        panelClass: 'mw-960'
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
