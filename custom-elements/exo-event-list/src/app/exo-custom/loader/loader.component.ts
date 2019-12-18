import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'exo-loader',
  template: '<div class="lds-css ng-scope"><div class="lds-dual-ring"><div></div></div></div>',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent { }
