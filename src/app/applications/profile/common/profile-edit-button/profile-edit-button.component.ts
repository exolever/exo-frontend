import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-edit-button',
  templateUrl: './profile-edit-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEditButtonComponent {
  @Input() showEditIcon = true;
  @Input() buttonText;
  @Input() routerLinkPointer: Array<string> = ['./'];
  @Input() routerFragment;
}
