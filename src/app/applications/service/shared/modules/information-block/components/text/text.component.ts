import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { InformationBlock } from '../../models/information-block.model';
import { OverlayService } from '@overlay/services/overlay.service';
import { TranslateService } from '@ngx-translate/core';
import { TypeFormIntegrationComponent } from '@shared/components/typeform-integration/typeform-integration.component';
import { UrlService } from '@app/core';
import { HttpClient } from '@angular/common/http';

enum PopupTypeEnum {
  TYPEFORM = 'typeform',
}

@Component({
  selector: 'app-service-text',
  templateUrl: './text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {

  @Input()
  textBlock: InformationBlock;

  @HostListener('click', ['$event'])
  listener(event) {
    const element = event.target;
    if (element && element.tagName === 'A' && element.dataset.popup === PopupTypeEnum.TYPEFORM) {
      event.preventDefault();
      this.popup(element.getAttribute('href'));
      return false;
    }
  }

  constructor(
    private overlayService: OverlayService,
    private translateService: TranslateService,
    private urlService: UrlService,
    private httpClient: HttpClient,
  ) { }

  popup(href: string) {
    this.httpClient.get(this.urlService.resolve(href)).subscribe((res) => {
      this.overlayService.open(
        <Component>TypeFormIntegrationComponent,
        {
          data: {
            title: this.translateService.instant('UTILS.TYPEFORM.QUIZ'),
            url: res['url']
          }
        });
    });
  }

}
