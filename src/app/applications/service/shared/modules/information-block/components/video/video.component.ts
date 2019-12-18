import { ChangeDetectionStrategy, Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { OverlayMediaService } from '@ecosystem-media-library/components/overlay-media/services/overlay-media.service';
import { Resource } from '@ecosystem-media-library/store/resource.model';
import { MEDIA_MODAL } from '@applications/service/shared/service.conf';
import { TrackingService } from '@core/services/tracking/tracking.service';

@Component({
  selector: 'app-service-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit {
  @Input() embed = false;
  @Input() video: Resource;
  @ViewChild('frame', { static: false }) frame: ElementRef;

  constructor(
    private overlayMediaService: OverlayMediaService,
    private tracking: TrackingService
  ) {}

  ngAfterViewInit(): void {
    this.tracking.trackVideo(this.frame.nativeElement.getElementsByTagName('iframe')[0]);
  }

  openVideo() {
    this.overlayMediaService.open({
      video: this.video,
      fromAssignments: true,
      maxWidth: MEDIA_MODAL.maxWidth
    });
  }
}
