import {
  Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef,
  HostListener, ElementRef, Renderer2
} from '@angular/core';
import { BreakPoint, DEFAULT_BREAKPOINTS, ɵMatchMedia, MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router, UrlSegment } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { Urls, UrlService } from '@app/core';
import { UserModel } from '@core/models/user/user.model';
import { AppState } from '@core/store/reducers';

import * as fromUser from '@core/store/user/user.reducer';
import { URL_TEAM_COMMUNICATION } from '@service/shared/service.conf';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { StepModel } from '@applications/workspace/projects/models/step.model';
import { Team as TeamModel } from '@applications/workspace/projects/models/team.model';

import * as fromGProject from '../../store/reducer';
import * as teamActions from '../../store/actions/teams.actions';


@Component({
  templateUrl: './generic-service-container.component.html',
  styleUrls: ['./generic-service-container.component.scss'],
})
export class GenericServiceContainerComponent implements OnInit, OnDestroy {
  isMobile: boolean;
  pkProject: string;
  pkTeam: string;
  project: GenericProject;
  steps$: Observable<StepModel[]>;
  teams$: Observable<TeamModel[]>;
  teams: TeamModel[] = [];
  teamSelected$: Observable<TeamModel>;
  subscriptions = new Subscription();
  Urls = Urls;
  user$: Observable<UserModel>;

  stepsFolded = false;
  subscription = new Subscription();
  // Conversations
  unreadConversations: number;
  showUnread = true;
  @ViewChild('snav', { static: false }) snav: MatSidenav;
  @ViewChild('teamSelectionBar', { static: false, read: ElementRef }) teamSelectionEl: ElementRef;

  constructor(
    public urlService: UrlService,
    public router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private communicationService: CommunicationService,
    private changeDetectorRef: ChangeDetectorRef,
    private mediaMatch: ɵMatchMedia,
    private mediaObserver: MediaObserver,
    private renderer: Renderer2
  ) {
    // Prevent show the unread icon if we navigate to Team Communication section.
    this.subscriptions.add(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const tree = this.router.parseUrl(e.url);
      const segments: UrlSegment[] = tree.root.children[PRIMARY_OUTLET].segments;
      if (segments[segments.length - 1].path === URL_TEAM_COMMUNICATION) {
        this.showUnread = false;
      }
    }));
  }

  @HostListener('window:scroll', ['$event'])
  manageScroll($event: any) {
    const scrollOffset = $event.srcElement.children[0].scrollTop;
    const maxScroll = this.showTeamSelectionBar() ? 96 : 64;
    if (scrollOffset > maxScroll) {
      if (this.showTeamSelectionBar()) {
        this.renderer.addClass(this.teamSelectionEl.nativeElement, 'sticky-team-selection-bar');
      }
      this.snav.fixedInViewport = true;
      this.snav.fixedTopGap = this.showTeamSelectionBar() ? 32 : 0;
    } else {
      if (this.showTeamSelectionBar()) {
        this.renderer.removeClass(this.teamSelectionEl.nativeElement, 'sticky-team-selection-bar');
      }
      this.snav.fixedInViewport = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.checkResolution();
    this.project = this.route.snapshot.data.project;
    this.communicationService.totalUnreadConversations(this.project.uuid)
      .subscribe((unread) => this.unreadConversations = unread.total);

    this.route.params.subscribe((params) => {
      this.pkProject = params.pkService;
      this.pkTeam = params.pkTeam;
      this.store.dispatch(new teamActions.SetGProjectTeamSelected(params.pkTeam));
    });

    // // subscriptions
    this.teams$ = this.store.pipe(select(state => fromGProject.selectAllTeams(state.genericProject)));
    this.teamSelected$ = this.store.pipe(select(state => fromGProject.selectTeamSelected(state.genericProject)));
    this.user$ = this.store.pipe(
      select((state) => fromUser.getUser(state)),
      filter(user => user !== undefined)
    );

    this.subscription.add(
      this.teams$.subscribe(teams => this.teams = teams)
    );
  }

  checkResolution(): void {
    this.subscription.add(
      this.mediaObserver.media$.subscribe(() => {
        if (this.mediaMatch.isActive(DEFAULT_BREAKPOINTS.find((bp: BreakPoint) => bp.alias === 'gt-sm').mediaQuery)) {
          this.isMobile = false;
          this.snav.open();
        } else {
          this.isMobile = true;
          this.snav.close();
        }
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  showTeamSelectionBar(): boolean {
    return this.teams.length > 1;
  }

  /**
   * gets the tooltip text for the logotype
   */
  navigateText(user: UserModel): string {
    const code = this.canGoEcosystem(user) ? 'GO_TO_COMMUNITY' : 'OPENEXO';
    return this.translate.instant('COMMON.' + code);
  }

  /**
   * determines if the user is participant and returns false so he/she cannot go to ecosystem
   */
  canGoEcosystem(user: UserModel): boolean {
    return user.pkConsultant ? true : user.isStaff || user.isSuperuser;
  }

  onClickToNavigate() {
    if (this.isMobile) {
      this.snav.close();
    }
  }

  onChangeTeam(newTeam: number) {
    this.store.dispatch(new teamActions.SetGProjectTeamSelected(newTeam));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
