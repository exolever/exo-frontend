import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { Observable } from 'rxjs';
import { IBreadCrumb } from '@applications/breadcrumb/store/breadcrumb.reducers';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadCrumb$: Observable<IBreadCrumb[]>;

  constructor(
    private breadCrumbService: BreadCrumbService
  ) {}

  ngOnInit() {
    this.breadCrumb$ = this.breadCrumbService.getBreadCrumb();
  }
}
