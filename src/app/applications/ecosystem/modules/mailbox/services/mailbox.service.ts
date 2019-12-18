import { Injectable } from '@angular/core';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { map, take } from 'rxjs/operators';
import { Conversation } from '@applications/shared/communication/model/communication.model';
import { UserService } from '@app/core';
import { Observable } from 'rxjs';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';

@Injectable({
  providedIn: 'root'
})
export class MailboxService {

  constructor(
    private communicationService: CommunicationService,
    private userService: UserService,
  ) { }

  getAllConversations(): Observable<Conversation[]> {
    return this.communicationService.getMailboxConversations()
      .pipe(
        map(res => this.serializeMailboxResponse(res))
      );
  }

  getMessages(id: number, cursor: string) {
    return this.communicationService.getMailboxMessages(id, cursor).pipe(
        map(res => res)
      );
  }

  getUserConversationUuid(uuid: string) {
    return this.communicationService.getUserConversationUuid(uuid).pipe(
      map((res: any) => {
        if (res.length === 0) {
          return res;
        }
        return this.serializeMailboxResponse(res);
      })
    );
  }

  userStartConversation(pk, data) {
    return this.communicationService.userStartConversation(pk, data);
  }

  replyConversation(id: string, data: { message: string, files: FilestackUploadInterface[]}) {
    return this.communicationService.replyConversationMailbox(id, data);
  }

  serializeMailboxResponse(conversations): Conversation[] {
    return conversations.map((c) => {
      let userIcon;
      this.userService.user$.pipe(
        take(1)
      ).subscribe((user) => {
        userIcon = c.users.find(u => u.uuid !== user.uuid);
        c.icon = userIcon.profilePicture;
        c.name = userIcon.name;
      });
      return new Conversation(c);
    });
  }

  public markAsRead1to1(id: number) {
    return this.communicationService.markAsRead1to1(id);
  }

}
