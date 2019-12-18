import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-advisory-call-detail-layout',
  templateUrl: './advisory-call-detail-layout.component.html',
  styleUrls: ['./advisory-call-detail-layout.component.scss']
})
export class AdvisoryCallDetailLayoutComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
