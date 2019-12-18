import { Component, OnInit } from '@angular/core';
import { Urls, UrlService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './toolkit.component.html',
  styleUrls: ['./toolkit.component.scss']
})
export class ToolkitComponent implements OnInit {

  constructor(private urlService: UrlService, private router: Router) {
  }

  ngOnInit() {
  }

  onSummit() {

  }

  onMeetup() {

  }

  onWorkshop() {
    const url = this.urlService.getPath([Urls.TOOLKIT_WORKSHOP]);
    this.router.navigate([url]);
  }

  onAwake() {
    const url = this.urlService.getPath([Urls.TOOLKIT_AWAKE]);
    this.router.navigate([url]);
  }
}
