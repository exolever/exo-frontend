import { SafeHtmlPipe } from '@shared/pipes/safeHtml.pipe';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';

describe ('SafeHtmlPipe', () => {
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule
      ],
      providers: [
        DomSanitizer
      ]
    });
  });

  it('should create pipe instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SafeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));

  it('should transform html', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SafeHtmlPipe(domSanitizer);
    const iframe = '<iframe src="https://player.vimeo.com/video/257413242" width="640" height="360" frameborder="0"' +
    ' title="Smart contracts - Simply Explained" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    const transform: any = pipe.transform(iframe);
    expect(transform.changingThisBreaksApplicationSecurity).toEqual(iframe);
  }));
});
