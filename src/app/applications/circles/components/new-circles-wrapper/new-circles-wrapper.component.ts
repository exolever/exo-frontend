import {
  Component, OnInit, OnDestroy,  ViewChild, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subscription, Subject, Observable, of } from 'rxjs';
import { distinctUntilChanged, tap, startWith, switchMap } from 'rxjs/operators';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Store, select } from '@ngrx/store';

import { SearchConfig } from '@applications/shared/models';
import { Pagination } from '@core/interfaces/pagination.interface';
import { Circle } from '@applications/circles/models/circle.model';
import { UrlService , Urls} from '@core/services';
import { AppState } from '@core/store/reducers';
import {
  RequiredCertificationDialogComponent
} from '@shared/components/dialogs/required-certification-dialog/required-certification-dialog.component';

import * as fromStore from '../../store/reducer/index';
import { CircleService } from '../../services/circle.service';
import * as CircleActions from '../../store/action/circles.action';
import { EventParams } from '@core/enums/analytics.enum';

@Component({
  selector: 'app-new-circles-wrapper',
  templateUrl: './new-circles-wrapper.component.html',
  styleUrls: ['./new-circles-wrapper.component.scss']
})
export class NewCirclesWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('perfectscroll', {static: true}) ps: PerfectScrollbarComponent;
  private subscriptions = new Subscription();
  private requestsStream$: Subject<any> = new Subject();
  totalResults: number;
  searchConfig: SearchConfig = {
    page: 1,
    pageSize: 15,
    search: ''
  };
  suggestedCircles$: Observable<Circle[]>;
  loadingData = false;
  constructor(
    private router: Router,
    private urlService: UrlService,
    private circleService: CircleService,
    private store: Store<AppState>,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.suggestedCircles$ = this.store.pipe(select(state => fromStore.selectSuggestedCircles(state.circles)));

    this.subscriptions.add(
      this.requestsStream$.pipe(
        startWith(this.searchConfig),
        distinctUntilChanged((prev, next) => JSON.stringify(prev) !== JSON.stringify(next)),
        tap(() => {
          this.loadingData = true;
          this.ps.disabled = true;
        }),
        switchMap(params => this.getData(params)),
        tap((data: Pagination<Circle>) => {
          this.totalResults = +data.count;
          this.store.dispatch(new CircleActions.UpdateSuggestedCircles(data.results));
          this.searchConfig.page = +data.next;
          this.loadingData = false;
          this.ps.disabled = false;
          this.changeDetector.detectChanges();
        })
      ).subscribe()
    );
  }

  private getData(params: SearchConfig): Observable<Pagination<Circle>> {
    return this.circleService.getCircles(true);
  }

  onJoin(circle: Circle) {
    if (circle.everyoneCanJoin()) {
      this.circleService.join(circle.slug).subscribe(() => {
        this.navigateCircleDetail(circle);
      });
    }
    if (circle.needCertificationToJoin()) {
      this.dialog.open(RequiredCertificationDialogComponent, {
        data: {
          certification: circle.certificationRequired,
          prefix: 'ECOSYSTEM.CIRCLES.JOIN',
          source: EventParams.CIRCLES
        },
      });
    }
  }

  navigateCircleDetail(circle: Circle) {
    const url = this.urlService.getPath([Urls.ECOSYSTEM_CIRCLE_DETAIL, circle.slug]);
    this.router.navigate([url]);
  }

  resetList() {
    this.suggestedCircles$ = of([]);
    this.searchConfig.page = 1;
    this.searchConfig.pageSize = 15;
    this.requestsStream$.next(this.searchConfig);
  }

  seeMore(): void {
    if (this.searchConfig.page) {
      this.requestsStream$.next(this.searchConfig);
      this.ps.directiveRef.scrollToBottom();
    }
  }

  seeLess(): void {
    this.searchConfig.search = '';
    this.resetList();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
