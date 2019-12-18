import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@core/services/localStorage.service';

import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { SwarmSession } from '../models/session.model';
import { empty } from 'rxjs';

@Injectable()
export class SwarmPromptService {
  static readonly KEY_SHOWN = 'shown';
  constructor(
    private promptDialogService: PromptDialogService,
    private translate: TranslateService,
    private localStorage: LocalStorageService
  ) { }

  /**
   * opens a dialog with the appropriate text the session expired dialog in the ecosystem
   */
  ecosystemSessionExpiredDialog(session: SwarmSession) {
    if (this.localStorage.getItem('EcosystemSessionExpired-' + session.pk) !== SwarmPromptService.KEY_SHOWN) {
      this.localStorage.setItem('EcosystemSessionExpired-' + session.pk, SwarmPromptService.KEY_SHOWN);
      const config = this.getEcosystemSessionExpiredConfig();
      return this.promptDialogService.open(config);
    } else {
      return empty();
    }
  }

  /**
   * opens a dialog with the appropriate text the session expired dialog in the service area
   */
  platformSessionExpiredDialog(session: SwarmSession) {
    if (this.localStorage.getItem('ServiceSessionExpired-' + session.pk) !== SwarmPromptService.KEY_SHOWN) {
      this.localStorage.setItem('ServiceSessionExpired-' + session.pk, SwarmPromptService.KEY_SHOWN);
      const config = this.getServiceSessionExpiredConfig();
      return this.promptDialogService.open(config);
    } else {
      return empty();
    }
  }

  /**
   * opens a dialog with the appropriate text the session expired dialog in the service area
   */
  platformSessionStartedDialog(session: SwarmSession) {
    if (this.localStorage.getItem('ServiceSessionStarted-' + session.pk) !== SwarmPromptService.KEY_SHOWN) {
      this.localStorage.setItem('ServiceSessionStarted-' + session.pk, SwarmPromptService.KEY_SHOWN);
      const config = this.getSessionStartedConfig(session);
      return this.promptDialogService.open(config);
    } else {
      return empty();
    }
  }

  cleanPrompts(session: SwarmSession) {
    this.localStorage.setItem('ServiceSessionStarted-' + session.pk, undefined);
    this.localStorage.setItem('ServiceSessionExpired-' + session.pk, undefined);
    this.localStorage.setItem('EcosystemSessionExpired-' + session.pk, undefined);
  }

  private getEcosystemSessionExpiredConfig() {
    return {
      title: this.translate.instant('SWARM.DIALOGS.SESSION_END.TITLE'),
      messages: [this.translate.instant('SWARM.DIALOGS.SESSION_END.MESSAGE')],
      primaryButton: this.translate.instant('SWARM.DIALOGS.SESSION_END.BUTTON')
    };
  }

  private getServiceSessionExpiredConfig() {
    return {
      title: this.translate.instant('SWARM.DIALOGS.SERVICE_SESSION_END.TITLE'),
      messages: [this.translate.instant('SWARM.DIALOGS.SERVICE_SESSION_END.MESSAGE')],
      primaryButton: this.translate.instant('SWARM.DIALOGS.SERVICE_SESSION_END.BUTTON')
    };
  }

  private getSessionStartedConfig(session: SwarmSession) {
    const hourDiff = session.endAt.diff(session.startAt, 'hours');
    const hourLabel = hourDiff === 1 ?
      this.translate.instant('COMMON.HOURS').toLowerCase() :
      this.translate.instant('COMMON.HOUR').toLowerCase();

    return {
      title: this.translate.instant('SWARM.DIALOGS.SERVICE_SESSION_START.TITLE'),
      messages: [
        this.translate.instant(
          'SWARM.DIALOGS.SERVICE_SESSION_START.MESSAGE',
          { duration: `${hourDiff} ${hourLabel}`,
            startTime: session.startAt.format('YYYY-MM-DD HH:mm'),
            endTime: session.endAt.format('YYYY-MM-DD HH:mm')
          }
        )
      ],
      primaryButton: this.translate.instant('SWARM.DIALOGS.SERVICE_SESSION_START.BUTTON')
    };
  }

}
