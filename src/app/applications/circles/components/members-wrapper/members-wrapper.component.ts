import {
  Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, startWith, switchMap } from 'rxjs/operators';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { SearchConfig } from '@applications/shared/models';
import { Pagination } from '@core/interfaces/pagination.interface';
import { UserModel } from '@core/models';
import { CircleService } from '../../services/circle.service';

@Component({
  selector: 'app-members-wrapper',
  templateUrl: './members-wrapper.component.html',
  styleUrls: ['./members-wrapper.component.scss']
})
export class MembersWrapperComponent implements OnInit, OnChanges, OnDestroy {
  @Input() circleSlug: string;
  @ViewChild('perfectscroll', {static: true}) ps !: PerfectScrollbarComponent;
  private subscriptions: Array<Subscription> = [];
  private requestsStream$: Subject<any> = new Subject();
  filterForm = new FormControl();
  searchConfig: SearchConfig = {
    page: 1,
    pageSize: 15,
    search: ''
  };
  people: Array<UserModel> = [];
  totalResults: number;
  loadingData = false;
  enableSearch: boolean = undefined;
  participantsLabel = '';
  constructor(
    private membersService: CircleService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.requestsStream$.pipe(
        startWith(this.searchConfig),
        distinctUntilChanged((prev, next) => JSON.stringify(prev) !== JSON.stringify(next)),
        tap(() => {
          this.loadingData = true;
          this.ps.disabled = true;
        }),
        switchMap(params => this.getData(this.circleSlug, params)),
        tap((data: Pagination<UserModel>) => {
          this.totalResults = +data.count;
          if (this.enableSearch === undefined) {
            this.enableSearch = this.totalResults > 10;
          }
          this.participantsLabel = this.getParticipantsLabel();
          this.people = this.people.concat(data.results);
          this.searchConfig.page = this.getNextPage(data.next);
          this.loadingData = false;
          this.ps.disabled = false;
          this.changeDetector.detectChanges();
        })
      ).subscribe()
    );

    this.subscriptions.push(
      this.filterForm.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(() => {
        this.searchConfig.search = this.filterForm.value;
        this.resetListPeople();
      })
    );
  }

  public getNextPage(url: string) {
    const segment = new RegExp(/page=\d+/).exec(url);
    return segment ?  + segment[0].split('=')[1] : undefined;
  }

  public clearForm(): void {
    this.filterForm.setValue('');
  }

  private getData(circleSlug: string, params: SearchConfig): Observable<Pagination<UserModel>> {
    return this.membersService.getFollowers({
      circleSlug: circleSlug,
      pageIndex: params.page,
      pageSize: params.pageSize,
      searchBy: params.search
    });
  }

private getParticipantsLabel(): string {
  if (['announcements', 'participant-questions', 'marketplace', 'platform-feedback'].includes(this.circleSlug)) {
    return '';
  }
  if (['coaches', 'consultants', 'trainers'].includes(this.circleSlug)) {
    // Advisors, Coaches, Consultants, Speakers, Trainers
    return this.totalResults > 1 ?
      'ECOSYSTEM.CIRCLES.SEARCH_MEMBERS.PROFESSIONALS' :
      'ECOSYSTEM.CIRCLES.SEARCH_MEMBERS.PROFESSIONAL';
  }

  return this.totalResults > 1 ?
    'ECOSYSTEM.CIRCLES.SEARCH_MEMBERS.MEMBERS' :
    'ECOSYSTEM.CIRCLES.SEARCH_MEMBERS.MEMBER';
  }

  resetListPeople() {
    this.people = [];
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

  ngOnChanges(changes: SimpleChanges)	{
    if (changes.circleSlug && !changes.circleSlug.isFirstChange()) {
      this.resetListPeople();
    }
  }

  seeLess(): void {
    this.searchConfig.search = '';
    this.resetListPeople();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
