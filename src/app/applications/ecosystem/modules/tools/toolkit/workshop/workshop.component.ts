import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { Resource, ResourceStatus, ResourceType } from '@ecosystem-media-library/store/resource.model';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as fromUser from '@core/store/user/user.reducer';
import { AppState } from '@core/store/reducers';
import { Subscription } from 'rxjs';
import { UserCertificationModel } from '@core/models/user/user-certification.model';
import { CertificationEnum } from '@core/modules/certifications/enums';
import { RequiredCertificationDialogComponent } from '@shared/components';
import { CertificationModel } from '@core/modules/certifications/models';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit, OnDestroy {
  documents = [
    new Resource({
      pk: new Date().getTime().toString(),
      name: 'Guidelines to Run an ExO Workshop Deck.pdf',
      type: ResourceType.Pdf,
      status: ResourceStatus.Available,
      description: 'Description',
      mimetype: 'application/Pdf',
      link: 'https://cdn.filestackcontent.com/qmIzM46cTuKFHNl66Q7L'
    }),
    new Resource({
      pk: new Date().getTime().toString(),
      name: '1-day ExO Workshop - Template.pptx',
      type: ResourceType.Slides,
      status: ResourceStatus.Available,
      description: 'Description',
      mimetype: 'application/x-mspowerpoint',
      link: 'https://cdn.filestackcontent.com/Wkl09t0S0urmLAuc7uLg'
    })
  ];

  materials = [
    new Resource({
      pk: new Date().getTime().toString(),
      name: 'Business Model Generation Canvas.pdf',
      type: ResourceType.Pdf,
      status: ResourceStatus.Available,
      description: 'Description',
      mimetype: 'application/Pdf',
      link: 'https://cdn.filestackcontent.com/5JZyxrxlTYiZiKX80pqe'
    }),
    new Resource({
      pk: new Date().getTime().toString(),
      name: 'ExO Canvas.pdf',
      type: ResourceType.Pdf,
      status: ResourceStatus.Available,
      description: 'Description',
      mimetype: 'application/Pdf',
      link: 'https://cdn.filestackcontent.com/eo6gsrETKOZfgNtPUiFg'
    })
  ];
  subscriptions = new Subscription();
  allowed = false;

  constructor(
    private breadCrumbService: BreadCrumbService,
    private translate: TranslateService,
    private matDialog: MatDialog,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.breadCrumbService.appendCrumb(
      this.translate.instant('ECOSYSTEM.BREADCRUMBS.TOOLKIT.WORKSHOP')
    );
    this.subscriptions.add(
      this.store.pipe(select(state => fromUser.getUser(state))).subscribe(user => {
        this.allowAccess(user.certifications);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private allowAccess(certifications: UserCertificationModel[]) {
    this.allowed = !!certifications.find((cert: UserCertificationModel) => cert.code === CertificationEnum.TRAINER);
    if (!this.allowed) {
      this.matDialog.open(RequiredCertificationDialogComponent, {
        data: {
          certification: new CertificationModel(CertificationEnum.TRAINER, null, null, null),
          // Prefix will need in json file a TITLES and a MESSAGE object
          prefix: 'TOOLKIT.DIALOG',
        },
        panelClass: 'mw-960'
      });
    }
  }

}
