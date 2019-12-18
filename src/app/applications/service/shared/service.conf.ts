import { MatSnackBarConfig } from '@angular/material';
import { MatDialogConfig } from '@angular/material/dialog/typings/dialog-config';
import { OverlayConfig } from '@angular/cdk/overlay';

export const SNACK_BAR_CONFIG: MatSnackBarConfig =  {
  duration: 12000 // 120 seg
};

export const DIALOG_CONFIG: MatDialogConfig = {
  maxWidth: '448px'
};

export const MEDIA_MODAL: OverlayConfig = {
  maxWidth: '960px'
};

export const URL_TEAM_COMMUNICATION = 'team-communication';
