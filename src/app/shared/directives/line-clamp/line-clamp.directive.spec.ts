import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material';

import { LineClampDirective } from '@shared/directives/line-clamp/line-clamp.directive';

@Component({
  template: `
    <!-- Add some style to the section container to test purpose -->
    <section style="width: 50px; height: 50px;">
      <p exoLineClamp [lines]="1" ellipsis="---">
        Simple text to test the line clamp Directive. Simple text to test the line clamp Directive.
        Simple text to test the line clamp Directive. Simple text to test the line clamp Directive
      </p>

      <div exoLineClamp>
        Div with text and some blocks like <strong>strong</strong> and with
        <span>span</span> to test the line clamp directive.
        Should be clamp by default with two lines and with ... as ellipsis.
      </div>

      <div style="display: flex; flex-direction: row">
        <p exoLineClamp>
          Test line clamp within a container with display flex. Test line clamp within a container with display flex.
          Test line clamp within a container with display flex. Test line clamp within a container with display flex.
        </p>
        <p>Other paragraph</p>
      </div>
    </section>
  `,
  styles: ['section, div, p { font-size: 16px; }']
})
class LineClampDirectiveSpecComponent { }

describe('ExoLineClamp', () => {
  let fixture: ComponentFixture<LineClampDirectiveSpecComponent>;
  let debugElements: DebugElement[];

  beforeEach(async(() => {
    fixture = TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [
        LineClampDirectiveSpecComponent,
        LineClampDirective
      ]
    }).createComponent(LineClampDirectiveSpecComponent);

    fixture.detectChanges();
    debugElements = fixture.debugElement.queryAll(By.directive(LineClampDirective));
  }));

  it('Should clamp two lines and ... as ellipsis by default', () => {
    expect(debugElements[1].nativeElement.textContent)
      .toContain(' Div with');
  });

  it('Should clamp a flex item', () => {
    expect(debugElements[2].nativeElement.textContent)
      .toContain(' T…');
  });
});
