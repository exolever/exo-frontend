import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EarlyParrotService } from '@core/services/early-parrot.service';

@Injectable()
export class EarlyParrotResolver implements Resolve<any> {

  constructor(
    private earlyParrotService: EarlyParrotService
  ) { }

  resolve() {
    return this.earlyParrotService.getCampaigns();
  }

}
