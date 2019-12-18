import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { PickerResponse } from 'filestack-js/build/main/lib/picker';

import { ConsultantModel } from '@applications/shared/models/consultant.model';
import { FilestackService } from '@core/services/filestack.service';
import { ProfileEditSnackBarService } from '@applications/profile-edition/services/snack-bar.service';
import { ProfileEditionService } from '@applications/profile-edition/services/profile-edition.service';

@Component({
  selector: 'app-profile-video',
  templateUrl: './profile-video.component.html',
  styleUrls: ['./profile-video.component.scss']
})
export class ProfileVideoComponent implements OnInit {

  @Input() user: ConsultantModel;
  @Input() video: any;
  @ViewChild('videoInput', {static: false}) videoInput;
  // view config
  uploadVideoContainerWidth = '360px';

  constructor(
    private profileEditionService: ProfileEditionService,
    private fileStackService: FilestackService,
    private snackBar: ProfileEditSnackBarService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.fileStackService.init();
  }

  openFilePicker(): void {
    this.fileStackService.open({
      accept: 'video/*',
      onUploadDone: (res: PickerResponse) => this.saveVideo(res)
    });
  }

  saveVideo(video: PickerResponse) {
    this.profileEditionService.updateVideoProfile(this.user.pkConsultant, video.filesUploaded[0].url)
      .subscribe((res) => {
        this.snackBar.success(this.translateService.instant('DIALOGS.VIDEO_UPDATED'));
        this.user.setVideo(res.video_url);
      });
  }

}
