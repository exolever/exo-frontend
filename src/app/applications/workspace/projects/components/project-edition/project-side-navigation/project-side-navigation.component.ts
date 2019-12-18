import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-side-navigation',
  templateUrl: './project-side-navigation.component.html',
  styleUrls: ['./project-side-navigation.component.scss']
})
export class ProjectSideNavigationComponent implements OnInit {
  url$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.url$ = this.route.firstChild.url.pipe(map(url => url[0].path));
  }

  navigateTo(data: MatSelectChange) {
    this.router.navigate([data.value], {relativeTo: this.route});
  }
}
