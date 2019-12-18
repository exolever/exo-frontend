import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '@applications/breadcrumb/service/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-awake-es',
  templateUrl: './awake-es.component.html',
  styleUrls: ['./awake-es.component.scss']
})
export class AwakeEsComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  urlResource = 'https://help.openexo.com/en/articles/3457652-referring-people-to-openexo-and-the-consultant-certification';
  // tslint:disable-next-line:max-line-length
  pdfResource = 'https://drive.google.com/open?id=13JfIYefPp6OnCTH5uAkJ21-lEwqgH1js';

  constructor(
    private breadCrumbService: BreadCrumbService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.breadCrumbService.appendCrumb(
      this.translate.instant('ECOSYSTEM.BREADCRUMBS.TOOLKIT.AWAKE')
    );
  }

  onDownloadPdf() {
    window.open(this.pdfResource, '_blank');
  }
}
