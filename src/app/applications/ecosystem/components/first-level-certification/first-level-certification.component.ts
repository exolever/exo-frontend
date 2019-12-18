import {Component, ChangeDetectionStrategy, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-first-level-certification',
  templateUrl: './first-level-certification.component.html',
  styleUrls: ['./first-level-certification.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirstLevelCertificationComponent implements OnInit, OnDestroy {
  entryPoint: string;
  subscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParamMap.subscribe(params => this.entryPoint = params.get('source'))
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
