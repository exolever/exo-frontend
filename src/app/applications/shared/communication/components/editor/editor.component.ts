import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { PickerFileMetadata } from 'filestack-js/build/main/lib/picker';
import { ConversationUsers } from '@applications/shared/communication/model/communication.model';
import { FILESTACK_SUCCESS_STATUS, FilestackService } from '@core/services/filestack.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnChanges {

  message: FormControl;

  @Input()
  user?: ConversationUsers;

  @Input()
  resources: FilestackUploadInterface[] = [];

  @Input()
  replyingMessage: boolean;
  disabledSubmit: boolean;

  @Output()
  submit: EventEmitter<{message: string, files: FilestackUploadInterface[]}> = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.message = new FormControl('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.replyingMessage && !changes.replyingMessage.isFirstChange()) {
      if (changes.replyingMessage.currentValue) {
        this.disabledSubmit = changes.replyingMessage.currentValue;
      } else {
        // Add 1 second delay to enable button, to allow refresh the DOM with the new message.
        setTimeout(() => {
          this.disabledSubmit = changes.replyingMessage.currentValue;
          this.cd.detectChanges();
        }, 1000);
      }
    }
  }

  addResource(file: PickerFileMetadata): void {
    if (!file.status) {
      file.status = FILESTACK_SUCCESS_STATUS;
    }
    this.resources.push(FilestackService.buildUploadedObject(file));
  }

  onSubmit(): void {
    this.message.markAsTouched({ onlySelf: true });

    if (this.message.value.trim() !== '') {
      this.submit.emit({
        message: this.message.value,
        files: this.resources,
      });
      this.message.reset('');
      this.resources = [];
    } else {
      this.message.setErrors({'required': true});
    }
  }

}
