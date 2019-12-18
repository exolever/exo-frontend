import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';

import { ConsultantModel } from '@applications/shared/models/consultant.model';
import { MemberCardInterface } from '@applications/service/shared/modules/member-card/member-card.inteface';
import { AppState } from '@core/store/reducers';

import * as DirectoryActions from '../store/directory.actions';
import * as fromDirectory from '../store/directory.reducer';

@Component({
  selector: 'app-people',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl : './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  @Input() isStaff: boolean;

  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  consultants$: Observable<ConsultantModel[]>;
  totalConsultants$: Observable<number>;

  constructor(
    private translateService: TranslateService,
    private store: Store<AppState>,
  ) { }

  ngOnInit () {
    this.consultants$ = this.store.pipe(select(state => fromDirectory.getResults(state)));
    this.totalConsultants$ = this.store.pipe(select(state => fromDirectory.getTotalResults(state)));
    this.pageIndex$ = this.store.pipe(select(state => fromDirectory.getPage(state)));
    this.pageSize$ = this.store.pipe(select(state => fromDirectory.getPageSize(state)));
  }

  deserializerItemCard(consultant: ConsultantModel): MemberCardInterface {
    const extraInformation = [];
    if (consultant.location) {
      extraInformation.push({
        icon: 'home',
        description: consultant.location,
        tooltip: this.translateService.instant('TOOLTIP.LOCATION'),
        dataE2E: 'location'
      });
    }
    if (consultant.purpose) {
      extraInformation.push({
        icon: 'center_focus_strong',
        description: consultant.purpose,
        tooltip: this.translateService.instant('TOOLTIP.PURPOSE')
      });
    }
    return {
      user: consultant,
      isActive: consultant.isActive(),
      certificates: consultant.certifications ? consultant.certifications : [],
      description: consultant.userTitle,
      extraInformation: extraInformation
    };
  }

  paginatorChange($event) {
    const pageIndex = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.store.dispatch(new DirectoryActions.Paginate({
      pageIndex: pageIndex + 1,
      pageSize: pageSize
    }));
  }

}
