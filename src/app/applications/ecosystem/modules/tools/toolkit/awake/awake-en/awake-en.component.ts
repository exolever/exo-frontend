import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';

@Component({
  templateUrl: './awake-en.component.html',
  styleUrls: ['./awake-en.component.scss']
})
export class AwakeEnComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  urlResource = 'https://help.openexo.com/en/articles/3457652-referring-people-to-openexo-and-the-consultant-certification';
  // tslint:disable-next-line:max-line-length
  pdfResource = 'https://drive.google.com/open?id=12YrBIkwVVy8SGZ7VG9SJU95NNDe1K-Ke';

  constructor(
    private breadCrumbService: BreadCrumbService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.breadCrumbService.appendCrumb(
      this.translate.instant('ECOSYSTEM.BREADCRUMBS.TOOLKIT.AWAKE')
    );
  }

  onDownloadPdf() {
    window.open(this.pdfResource, '_blank');
  }
}
