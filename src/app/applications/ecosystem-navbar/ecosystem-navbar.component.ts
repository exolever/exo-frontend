import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakPoint, DEFAULT_BREAKPOINTS, MediaObserver, ɵMatchMedia } from '@angular/flex-layout';

import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { Observable, Subscription, timer as observableTimer } from 'rxjs';
import { filter } from 'rxjs/operators';

import { UserMenuComponent } from '@shared/components/user-menu/user-menu.component';
import { sectionsEnums } from '@core/enums';
import { Urls } from '@core/services';
import { UrlService, UserModel } from '@app/core';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import { NavigationEnd, Router } from '@angular/router';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';

@Component({
  selector: 'app-ecosystem-navbar',
  templateUrl: './ecosystem-navbar.component.html',
  styleUrls: ['./ecosystem-navbar.component.scss']
})
export class EcosystemNavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() showSections = true;

  selectedLink: string;
  isOpenedNavigationDropdown = false;
  dropdownConfig = { displayOverlay: false, opaque: true };
  links = [];
  urls = Urls;
  unread$: Observable<number>;

  circleLabel = this.translateService.instant('ECOSYSTEM.NAVBAR.CIRCLES');
  mediaLabel = this.translateService.instant('ECOSYSTEM.NAVBAR.MEDIA_LIBRARY');
  communityLabel = this.translateService.instant('ECOSYSTEM.NAVBAR.COMMUNITY');
  opportunitiesLabel = this.translateService.instant('ECOSYSTEM.NAVBAR.OPPORTUNITIES');
  jobsLabel = this.translateService.instant('ECOSYSTEM.NAVBAR.JOBS');

  @ViewChild('userMenu', {static: false}) userMenu: UserMenuComponent;
  @ViewChild( 'mobileDropdown', {static: false}) mobileDd: ElementRef;
  // user observable
  user: UserModel;
  private subscriptions = new Subscription();

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.elementRef.nativeElement.querySelector('.fullscreen-overlay').contains(event.target)) {
      this.onMobileDropdownToggle();
    }
  }

  constructor(
    private urlService: UrlService,
    private mediaObserver: MediaObserver,
    private mediaMatch: ɵMatchMedia,
    private store: Store<AppState>,
    private elementRef: ElementRef,
    private translateService: TranslateService,
    private router: Router,
    private mailboxService: MailboxService,
  ) {
    // Should be in the constructor instead OnInit for angular lifecycle components.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setNavbarTitle(event.url);
    });
  }

  setNavbarTitle(url: string): void {
    switch (url) {
      case Urls.ECOSYSTEM_CIRCLES:
        this.selectedLink = this.circleLabel;
        break;
      case Urls.ECOSYSTEM_RESOURCES:
      case Urls.ECOSYSTEM_MEDIA:
        this.selectedLink = this.mediaLabel;
        break;
      case Urls.ECOSYSTEM_BOOKS:
        this.selectedLink = this.translateService.instant('ECOSYSTEM.NAVBAR.RESOURCES');
        break;
      case Urls.ECOSYSTEM_DIRECTORY:
        this.selectedLink = this.communityLabel;
        break;
      case Urls.ECOSYSTEM_OPPORTUNITIES:
      case Urls.ECOSYSTEM_OPPORTUNITIES_ALL:
      case Urls.ECOSYSTEM_OPPORTUNITIES_DETAIL:
      case Urls.ECOSYSTEM_OPPORTUNITIES_PUBLISHED_YOU:
      case Urls.ECOSYSTEM_MARKETPLACE_CONDITIONS:
        this.selectedLink = this.opportunitiesLabel;
        break;
      case Urls.ECOSYSTEM_JOBS:
        this.selectedLink = this.jobsLabel;
        break;
      case Urls.ECOSYSTEM_TOOLS:
      case Urls.ECOSYSTEM_CANVAS:
      case Urls.ECOSYSTEM_EXQ:
        this.selectedLink = this.translateService.instant('ECOSYSTEM.NAVBAR.TOOLS');
        break;
      case Urls.ECOSYSTEM_CERTIFICATIONS:
      case Urls.ECOSYSTEM_CERTIFICATIONS_LIST:
        this.selectedLink = this.translateService.instant('ECOSYSTEM.NAVBAR.CERTIFICATIONS');
        break;
      default:
        this.selectedLink = this.circleLabel;
    }
  }

  ngOnInit() {
    this.store.dispatch(new actionCommunication.ConversationsConnectSocket());
    this.mailboxService.getAllConversations().subscribe((res) => {
      this.store.dispatch(new actionCommunication.ConversationSetTotalUnread1to1(res.reduce((a, b) =>  {
        return a + (b['unread'] || 0);
      }, 0)));
    });
    this.unread$ = this.store.pipe(select((state) => selectorsCommunication.selectTotalUnread(state)));
    this.subscriptions.add(
      this.store.pipe(select(state => fromUser.getUser(state)))
        .subscribe((user: UserModel) => {
          this.user = user;
          if (this.user) {
            this.createLinksForNavbar();
          }
        })
    );
    /**
     * the following subscription listens to the enter on desktop resolutions event and folds the dropdown in case
     * it is unfolded
     */
    this.subscriptions.add(this.mediaObserver.media$.subscribe(() => {
      if ( this.mediaMatch.isActive( DEFAULT_BREAKPOINTS
        .find((bp: BreakPoint) => bp.alias === 'md' || bp.alias === 'sm').mediaQuery )
      ) {
        this.isOpenedNavigationDropdown = false;
        this.manageDropdownAnimations();
      }
    })
  );
  }

  createLinksForNavbar() {
    this.links = [
      { label: this.circleLabel,
        url: [Urls.ECOSYSTEM_CIRCLES],
        isNew: false,
        children: [],
      },
      { label: this.communityLabel,
        url: [Urls.ECOSYSTEM_DIRECTORY],
        children: [],
      },
      { label: this.translateService.instant('ECOSYSTEM.NAVBAR.TOOLS'),
        url: [Urls.ECOSYSTEM_TOOLS],
        isNew: false,
        children: this.createToolSubmenu(),
      },
      { label: this.translateService.instant('ECOSYSTEM.NAVBAR.RESOURCES'),
        url: [Urls.ECOSYSTEM_RESOURCES],
        isNew: false,
        children: [
          { label: this.translateService.instant('ECOSYSTEM.NAVBAR.MEDIA_LIBRARY'),
            url: Urls.ECOSYSTEM_MEDIA,
          },
          { label: this.translateService.instant('ECOSYSTEM.NAVBAR.BOOKS'),
            url: Urls.ECOSYSTEM_BOOKS,
          },
          {
            label: this.translateService.instant('ECOSYSTEM.NAVBAR.SHARED'),
            url: Urls.ECOSYSTEM_RESOURCES_SHARED,
            external: true,
          },
          {
            label: this.translateService.instant('ECOSYSTEM.NAVBAR.COMMUNITY_CALENDAR'),
            url: Urls.ECOSYSTEM_RESOURCES_CALENDAR,
            external: true,
          },
        ],
      },
      { label: this.opportunitiesLabel,
        url: [Urls.ECOSYSTEM_OPPORTUNITIES],
        isNew: this.user && !this.user.hasVisited(sectionsEnums.Opportunities),
        children: [],
      },
      { label: this.jobsLabel,
        url: [Urls.ECOSYSTEM_JOBS],
        isNew: false,
        children: [],
      },
      {
        label: this.translateService.instant('ECOSYSTEM.NAVBAR.CERTIFICATIONS'),
        url: [Urls.ECOSYSTEM_CERTIFICATIONS],
        isNew: false,
        children: [],
      }
    ];
  }

  createToolSubmenu(): { label: string, url: string, external: boolean }[] {
    return [
      {
        label: this.translateService.instant('ECOSYSTEM.NAVBAR.EXO_CANVAS'),
        url: Urls.ECOSYSTEM_CANVAS,
        external: false
      },
      {
        label: this.translateService.instant('ECOSYSTEM.NAVBAR.EXQ'),
        url: Urls.ECOSYSTEM_EXQ,
        external: false
      },
      {
        label: this.translateService.instant('ECOSYSTEM.NAVBAR.EVENT_TOOLKITS'),
        url: Urls.ECOSYSTEM_TOOLKIT,
        external: false
      },
    ];
  }

  isCurrentMenu(link): boolean {
    return link.children.find(item => item.url === this.router.url);
  }

  ngAfterViewInit() {
    this.manageDropdownAnimations();
    if (this.userMenu) {
      this.subscriptions.add(
        this.userMenu.clickHoverMenuTrigger.menuOpened.subscribe(() => this.closeDropDown())
      );
    }
  }

  /**
   * actions to do when mobile menu toggle is clicked
   */
  onMobileDropdownToggle(): void {
    this.toggleDropdownState();
    this.manageDropdownAnimations();
  }

  /**
   * informs the component the state of the dropdown menu has been changed
   */
  toggleDropdownState() {
    this.isOpenedNavigationDropdown = !this.isOpenedNavigationDropdown;
  }

  /**
   * actions to perform to control folding and unfolding of the dropdown meny
   */
  manageDropdownAnimations() {
    /** gets the total spacing from the top of the screen to the bottom of the top menu at the moment of display */
    if ((<HTMLElement>document.querySelector('mat-toolbar'))) {
      const topMargin =
        (<HTMLElement>document.querySelector('section')).offsetTop +
        (<HTMLElement>document.querySelector('mat-toolbar')).offsetHeight;
      /** dropdown position toggle animation */
      this.mobileDd.nativeElement.style.top = this.isOpenedNavigationDropdown ?
        topMargin + 'px' : topMargin - this.mobileDd.nativeElement.offsetHeight - 200 + 'px';
      /** styles for the screen overlay on mobile */
      if (this.isOpenedNavigationDropdown) {
        this.openDropDown();
      } else {
        this.closeDropDown();
      }
    }
  }

  private openDropDown() {
    this.dropdownConfig.displayOverlay = true;
    /** a delay is needed in order to get the opacity transition animation */
    observableTimer(3).subscribe(() => this.dropdownConfig.opaque = false);
  }

  private closeDropDown() {
    this.isOpenedNavigationDropdown = false;
    observableTimer(3).subscribe(() => this.dropdownConfig.opaque = true);
    /** wait 200 milliseconds (the duration of the animation) to hide the overlay */
    observableTimer(200).subscribe(() => this.dropdownConfig.displayOverlay = false);
  }

  /**
   * the mobile view's dropdown toggle text
   * @param {boolean} isMobile
   */

  setSelectedLink( isMobile: boolean ) {
    isMobile ? this.onMobileDropdownToggle() : this.toggleDropdownState();
  }

  urlLogo() {
    return this.urlService.getPath([Urls.ECOSYSTEM]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
