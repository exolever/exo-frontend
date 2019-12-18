import { Component, Inject, AfterViewInit, OnInit/*, NgZone*/ } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DATA } from '@overlay/services/overlay.service';
import { OverlayReference } from '@overlay/overlay-ref';
import * as typeformEmbed from '@typeform/embed';

@Component({
  selector: 'app-typeform-integration',
  templateUrl: './typeform-integration.component.html',
  styleUrls: ['./typeform-integration.component.scss']
})
export class TypeFormIntegrationComponent implements OnInit, AfterViewInit {
  url: string;

  constructor(
    private overlayRef: OverlayReference,
    @Inject(DOCUMENT) private document: any,
    @Inject(DATA) public data: any,
  ) { }

  ngOnInit() {
    if (this.data && this.data.hasOwnProperty('url')) {
      this.url = this.data.url;
    }
  }

  ngAfterViewInit() {
    const element = this.document.getElementById.call(document, 'my_typeform');
    typeformEmbed.makeWidget(element, this.url, { onSubmit: () => this.closeOverlay(true) });
  }

  closeOverlay(data?: any) {
    this.overlayRef.close(data);
  }

}
