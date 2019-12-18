import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router, UrlSegment } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { BreakPoint, DEFAULT_BREAKPOINTS, ɵMatchMedia, MediaObserver } from '@angular/flex-layout';

import { Observable, Subscription, fromEvent as observableFromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { WindowRef, Urls, UrlService } from '@app/core';
import { UserModel } from '@core/models/user/user.model';
import { AppState } from '@core/store/reducers';

import * as fromUser from '@core/store/user/user.reducer';
import { URL_TEAM_COMMUNICATION } from '@applications/service/shared/service.conf';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { Step } from '@applications/service/old-project/models/step.model';

import * as fromProjects from '../../store/project';
import * as fromService from '../../store/reducers';
import * as projectActions from '../../store/project/projects.actions';
import * as stepActions from '../../store/steps/step.actions';
import * as teamActions from '../../store/teams/team.action';
import { TeamModel } from '../../models/team.model';
import { ProjectModel } from '../../models/project.model';



@Component({
  templateUrl: './service-container.component.html',
  styleUrls: ['./service-container.component.scss'],
})
export class ServiceContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  isDesktop: boolean;
  isXSResolution: boolean;
  pkProject: string;
  pkTeam: string;
  project: ProjectModel;
  steps$: Observable<Step[]>;
  teams$: Observable<TeamModel[]>;
  teamSelected$: Observable<TeamModel>;
  subscriptions = new Subscription();
  Urls = Urls;
  user: UserModel;
  /** MatSidenav stuff */
  stepsFolded = true;
  topSpacing: number;
  isOpenedSidenav: boolean;
  /** template elements */
  @ViewChild('toolbar', {static: false, read: ElementRef}) toolbar: ElementRef;
  @ViewChild('drawer', {static: true}) drawer: MatSidenav;
  @ViewChild('teamSelectionBar', {static: false, read: ElementRef}) teamSelectionEl: ElementRef;


  // Conversations
  unreadConversations: number;
  showUnread = true;

  constructor(
    public urlService: UrlService,
    public router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private mediaObserver: MediaObserver,
    private mediaMatch: ɵMatchMedia,
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef,
    private communicationService: CommunicationService,
    private w: WindowRef,
    @Inject(DOCUMENT) private document: any,
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

  @HostListener('window:click', ['$event'])
  clickInside($event) {
    const pathEvent = $event.path || ($event.composedPath && $event.composedPath());
    if (!this.isDesktop
      && this.isOpenedSidenav
      && pathEvent.map(p => p.classList).filter(cl => !!cl).filter(cl => cl.contains('mobile-body')).length) {
      this.isOpenedSidenav = false;
    }
  }

  /** lifecycle hooks */
  ngOnInit() {
    const project = this.route.snapshot.data.project;
    this.communicationService.totalUnreadConversations(project.uuid).subscribe((unread) => {
      this.unreadConversations = unread.total;
    });

    // If we are in a step the stepper will be expanded
    if (this.router.url.includes('step')) {
      this.stepsFolded = false;
    }

    this.route.params.subscribe((params) => {
      this.pkProject = params.pkService;
      this.pkTeam = params.pkTeam;
      this.store.dispatch(new teamActions.SetTeamSelected(params.pkTeam));
      this.store.dispatch(new projectActions.GetProject(params.pkService));
      this.store.dispatch(new stepActions.LoadSteps({pkService: params.pkService, pkTeam: params.pkTeam}));
      this.store.dispatch(new teamActions.LoadTeams(params.pkService));
    });

    // subscriptions
    this.teamSelected$ = this.store.pipe(map(fromService.getTeamSelected));
    this.teams$ = this.store.pipe(select(fromService.getAllTeams));
    this.steps$ = this.store.pipe(select(fromService.getAllSteps));
    this.getUserProjectAndRole();
  }

  teamSelectionLoaded() {
    const newOffset = this.getOffsetTop();
    this.updateTopSpacing(newOffset);
  }

  updateTopSpacing(newValue: number) {
    this.topSpacing = newValue;
    // avoid expression changed after checked error
    this.cdRef.detectChanges();
  }

  getUserProjectAndRole(): void {
    this.store.pipe(
      select((state) => fromUser.getUser(state)),
      filter(user => user !== undefined)
    ).subscribe((user: UserModel) => {
      this.user = user;
      this.store.pipe(
        select(fromProjects.getSelectedProject),
        map(project => <ProjectModel>project)
      ).subscribe((project: ProjectModel) => {
        this.project = project;
      });
    });
  }

  ngAfterViewInit() {
    this.isOpened();
    this.subscriptions.add(
      // subscription to breakpoint
      this.mediaObserver.media$.subscribe(() => {
        this.isOpened();
      }));
    this.subscriptions.add(
      // subscription to scroll event
      observableFromEvent(this.w.nativeWindow, 'scroll').subscribe(
        (scroll: Event) => {
          // When a dialog is opened the global scroll is disabled using the block-scroll-strategy which add the
          // class cdk-global-scrollblock and trigger a scroll event. We need to avoid changes in these cases
          if (!this.document.documentElement.classList.contains('cdk-global-scrollblock')) {
            this.setSidenavTopOffset(scroll);
          }
        }
      )
    );
    const newOffset = this.getOffsetTop();
    this.updateTopSpacing(newOffset);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  isOpened() {
    this.isOpenedSidenav = this.isDesktop = this.mediaMatch.isActive(
      DEFAULT_BREAKPOINTS.find((bp: BreakPoint) => bp.alias === 'gt-sm').mediaQuery
    );

    // The top menu changes its size at this resolution, so we have to manage it.
    this.isXSResolution = this.mediaMatch.isActive(
      DEFAULT_BREAKPOINTS.find((bp: BreakPoint) => bp.alias === 'lt-sm').mediaQuery
    );
  }

  setSidenavTopOffset(scrollEv: Event): void {
    const scrollTop = (<any>scrollEv.target).scrollingElement.scrollTop;
    const offsetTop = this.getOffsetTop();
    const newOffset = scrollTop < offsetTop ? offsetTop - scrollTop : 0;
    this.updateTopSpacing(newOffset);
  }

  getOffsetTop(): number {
    const toolbarOffsetTop = this.toolbar ? this.toolbar.nativeElement.offsetTop : 0;
    const toolbarOffsetHeight = this.toolbar ? this.toolbar.nativeElement.offsetHeight : 0;
    return toolbarOffsetTop + toolbarOffsetHeight;
  }

  onSidenavToggle(): void {
    this.drawer.toggle();
    this.isOpenedSidenav = !this.isOpenedSidenav;
  }

  onChangeTeam(newTeam: number) {
    this.store.dispatch(new teamActions.SetTeamSelected(newTeam.toString()));
  }

  /**
   * gets the tooltip text for the logotype
   */
  navigateText(): string {
    const code = this.canGoEcosystem() ? 'GO_TO_COMMUNITY' : 'OPENEXO';
    return this.translate.instant('COMMON.' + code);
  }

  /**
   * determines if the user is participant and returns false so he/she cannot go to ecosystem
   */
  canGoEcosystem(): boolean {
    return this.user.pkConsultant ? true : this.user.isStaff || this.user.isSuperuser;
  }

}
