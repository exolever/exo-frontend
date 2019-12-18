import {
  AfterViewChecked,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { removeDuplicatesFromArray } from '@shared/utils/array-remove-duplictes';
import { AppState } from '@core/store/reducers';
import { UserModel } from '@core/models/user/user.model';
import { ConsultantModel, UserApplicationModel } from '@applications/shared/models';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import * as fromUser from '@core/store/user/user.reducer';
import { UserChatComponent } from '@applications/shared/communication/components/user-chat/user-chat.component';
import { OverlayService } from '@overlay/services/overlay.service';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';
import { Conversation } from '@applications/shared/communication/model/communication.model';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';

import { PROFILE_VIEW_CONFIG } from '../../profile-view.config';
import * as profileActions from '../../store/user-profile.actions';
import * as fromProfile from '../../store/user-profile.reducer';

@Component({
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
})
export class ProfileContainerComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('profileContainer', {static: false}) profileContainer: ElementRef;
  profileUser: UserApplicationModel | ConsultantModel;

  skillsData: Array<any> = [];
  user$: Observable<UserModel>;
  loading$: Observable<boolean>;
  showChatButton: boolean;
  backgroundColorsApplied = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public route: ActivatedRoute,
    public location: Location,
    private store: Store<AppState>,
    private renderer: Renderer2,
    private breadCrumbService: BreadCrumbService,
    private cd: ChangeDetectorRef,
    private overlayService: OverlayService,
    private mailboxService: MailboxService,
    @Inject(PROFILE_VIEW_CONFIG) public config
  ) {}

  ngOnInit() {
    this.breadCrumbService.resetBreadcrumb();
    this.getInfoForProfileUser();
    this.loading$ = this.store.pipe(select(state => fromProfile.getLoadingState(state)));
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.subscriptions.push(
      this.store.pipe(select(state => fromProfile.getProfileUser(state))).subscribe(profileUser => {
        if (profileUser) {
          this.profileUser = profileUser;
          this.showChat();
          /** we only want to display the exo skills section if the user is a consultant */
          if (profileUser instanceof ConsultantModel) {
            this.skillsData = this.otherSkillsDataFormatter();
          }
        }
      })
    );
  }

  showChat() {
    const isInProjectContext = this.route.snapshot.queryParams['isInProjectContext'];
    this.subscriptions.push(
      this.user$.subscribe((loggedUser: UserModel) => {
        this.showChatButton = loggedUser && loggedUser.pk !== this.profileUser.pk && !isInProjectContext;
      })
    );
  }

  ngAfterViewChecked() {
    if (!this.backgroundColorsApplied) {
      this.defineSectionAlternateColors();
    }
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * determines weather we are in project context and if the user is different from the one stored in the store
   * triggers the action to retrieve the user from the backend
   */
  getInfoForProfileUser(): void {
    this.subscriptions.push(
      /** subscribe to params change to detect user profile change */
      this.route.params.subscribe(routeParams => {
        /** In case we are accessing the same user we have on the store, we will not trigger user reload */
        this.subscriptions.push(
          this.store.pipe(select(state => fromProfile.getCurrentSlug(state)))
            .subscribe((slug: string) => {
              if ( this.route.snapshot.params['slug'] !== slug ) {
                this.store.dispatch(new profileActions.LoadUser(routeParams['slug']));
                this.store.dispatch(new profileActions.SetCurrentSlug(routeParams['slug']));
              }
            })
        );
      })
    );
  }

  /**
   * gets the list of roles that the consultant has exercises, eliminating repeated ones
   * @returns {string}
   */
  getRolesList(): Array<string> {
    return this.profileUser ?
      removeDuplicatesFromArray(
        (<ConsultantModel>this.profileUser).rolesWithProjects
          .map(roleProject => roleProject.roles)
          .map(role => role.map( r => r.name ))
          .reduce((a, b) => a.concat(b))
      ) : undefined;
  }

  /**
   * formats the data that the other-skills component should receive
   */
  otherSkillsDataFormatter(): Array<any> {
    const skillsData = [];

    if ((<ConsultantModel>this.profileUser).expertises && (<ConsultantModel>this.profileUser).expertises.length) {
      skillsData.push({ label: 'Methodologies', data: (<ConsultantModel>this.profileUser).expertises });
    }
    if ((<ConsultantModel>this.profileUser).industries && (<ConsultantModel>this.profileUser).industries.length) {
      skillsData.push({ label: 'Industries', data: (<ConsultantModel>this.profileUser).industries });
    }
    if ((<ConsultantModel>this.profileUser).technologies && (<ConsultantModel>this.profileUser).technologies.length) {
      skillsData.push({ label: 'Exp Technologies', data: (<ConsultantModel>this.profileUser).technologies });
    }

    return skillsData;
  }

  /**
    * Determines weather the user can see the video me area
    */
  getCanSeeVideoMe(): boolean {
    return (this.profileUser.bioMe !== undefined && this.profileUser.bioMe !== null && this.profileUser.bioMe !== '') ||
      ((<ConsultantModel>this.profileUser).video !== undefined &&
      (<ConsultantModel>this.profileUser).video !== null);
  }

  openChat(): void {
    this.mailboxService.getUserConversationUuid(this.profileUser.uuid).subscribe((res: Conversation[]) => {
      if (res.length > 0) {
        this.store.dispatch(new actionCommunication.LoadConversationsSuccess(res));
        this.store.dispatch(new actionCommunication.ConversationSelected(res[0].id));
        this.store.dispatch(new actionCommunication.LoadConversationMessages1to1({idConversation: res[0].id}));
      }
      this.overlayService.open(<Component>UserChatComponent, {
        data: {
          conversation: res,
          user: this.profileUser,
          fromProfile: true
        }
      });
    });
  }

  private defineSectionAlternateColors(): void {
    if (this.profileContainer.nativeElement.querySelectorAll('.alternate-background').length) {
      this.profileContainer.nativeElement.querySelectorAll('.alternate-background').forEach(
        (el: HTMLElement, i: number) => {
          this.renderer.addClass(el, i % 2 === 0 ? 'primary' : 'secondary');
        }
      );
      this.backgroundColorsApplied = true;
    }
  }

}
