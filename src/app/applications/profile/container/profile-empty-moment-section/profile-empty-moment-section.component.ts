import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-empty-moment-section',
  templateUrl: './profile-empty-moment-section.component.html',
  styleUrls: ['./profile-empty-moment-section.component.scss']
})
export class ProfileEmptyMomentSectionComponent {
  @Input() img: { src: string, alt: string };
  @Input() title: string;
  @Input() subtitle: string;
  @Input() privateLock = false;
}
