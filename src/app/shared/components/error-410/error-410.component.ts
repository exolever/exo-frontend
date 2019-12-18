import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Urls } from '@core/services/navigate';
import { Error410EntityEnum } from '@core/services/interceptors/error-410.service';

@Component({
  templateUrl: 'error-410.component.html',
  styleUrls: ['./error-410.component.scss']
})
export class Error410Component implements OnInit {

  entity: string;
  goBackUrl: string;

  constructor(
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.entity = navigation.extras.state.entity;
  }

  ngOnInit(): void {
    this.goBackUrl = this.getGoBackUrl(this.entity);
  }

  private getGoBackUrl(entity: string): string {
    switch (entity) {
      case Error410EntityEnum.OPPORTUNITY:
        return Urls.ECOSYSTEM_OPPORTUNITIES_ALL;
      default:
        return Urls.ECOSYSTEM;
    }
  }
}
