import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderAssignmentService {

  showHeader = new BehaviorSubject<boolean>(true);
  public assignmentHeader$ = this.showHeader.asObservable();

  showAssignmentHeader(): void {
    this.showHeader.next(true);
  }

  hideAssignmentHeader(): void {
    this.showHeader.next(false);
  }

}
