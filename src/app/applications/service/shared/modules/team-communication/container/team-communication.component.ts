import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { Conversation, ConversationUsers } from '@applications/shared/communication/model/communication.model';
import { ProjectModel } from '@applications/service/old-project/models/project.model';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { TeamModel } from '@service/old-project/models/team.model';
import { Team as TeamGProject } from '@applications/workspace/projects/models/team.model';
import { OverlayService } from '@overlay/services/overlay.service';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { ActivatedRoute } from '@angular/router';
import { Urls, UrlService } from '@app/core';
import {
  MessagesDialogComponent
} from '@applications/shared/communication/components/messages/messages-dialog/messages-dialog.component';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';

@Component({
  templateUrl: './team-communication.component.html',
  styleUrls: ['./team-communication.component.scss']
})
export class TeamCommunicationComponent implements OnInit, OnDestroy {

  conversations$: Observable<Conversation[]>;
  messages: any;
  team: TeamModel | TeamGProject;
  conversationSelected$: Observable<Conversation>;
  replyingMessage$: Observable<boolean>;
  project: ProjectModel | GenericProject;
  smallDevices: boolean;
  subscriptions: Subscription = new Subscription();
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private urlService: UrlService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.breakpointObserver.observe('(max-width: 960px)')
      .subscribe((bpState: BreakpointState) => {
        this.smallDevices = bpState.matches;
      }));
    this.project = this.route.snapshot.data.project;
    this.team = this.route.snapshot.data.teamSelected;
    this.store.dispatch(new actionCommunication.LoadConversations(this.project.uuid));
    this.store.dispatch(new actionCommunication.ConversationsConnectSocket());

    this.conversations$ = this.store.pipe(select(state => selectorsCommunication.selectAllConversations(state)));
    this.conversationSelected$ = this.store.pipe(select(selectorsCommunication.getSelectConversation));
    this.replyingMessage$ = this.store.pipe(select((state) => selectorsCommunication.selectReplyingMessages(state)));
    this.loading$ = this.store.pipe(select((state) => selectorsCommunication.selectLoadingConversations(state)));
    this.loaded$ = this.store.pipe(select((state) => selectorsCommunication.selectLoadedConversations(state)));
  }

  selectConversation(conversation: Conversation) {
    this.store.dispatch(new actionCommunication.ConversationSelected(conversation.id));
    this.loadMessages(conversation);
    if (this.smallDevices) {
      this.overlayService.open(<Component>MessagesDialogComponent, {
        data: {
          entity: this.project,
        }
      });
    }
  }

  onSubmit(value: {message: string, files: FilestackUploadInterface[]}, conversation: Conversation) {
    this.store.dispatch(new actionCommunication.ConversationReply(
      { uuid: this.project.uuid, id: conversation.id, data: { message: value.message, files: value.files } }
    ));
  }

  onScroll(direction: string, conversation: Conversation) {
    if (direction === 'down') {
      this.store.dispatch(new actionCommunication.ConversationResetUnread(conversation));
      this.store.dispatch(new actionCommunication.ConversationSeeMessages({
        uuid: this.project.uuid,
        id: conversation.id,
      }));
    }

    if (direction === 'up') {
      this.subscriptions.add(this.store.pipe(
        select(selectorsCommunication.selectNextPageConversations),
        take(1)
      ).subscribe((cursor: string) => {
        if (cursor) {
          this.loadMessages(conversation, cursor);
        }
      }));
    }
  }

  loadMessages(conversation: Conversation, cursor?: string) {
    this.store.dispatch(
      new actionCommunication.LoadConversationMessages({ uuid: this.project.uuid, id: conversation.id, cursor })
    );
  }

  goToProfile($event, member: ConversationUsers): void {
    $event.stopPropagation();
    $event.preventDefault();
    window.open(this.urlService.getPath([Urls.PROFILE_PUBLIC, member.slug]), '_blank');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actionCommunication.ConversationsReset());
    this.subscriptions.unsubscribe();
  }

}
