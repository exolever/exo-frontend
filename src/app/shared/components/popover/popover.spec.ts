import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import {
  Component,
  ElementRef,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatPopoverModule,
  MatPopoverPanel,
  MatPopoverTriggerDirective,
  PopoverPositionX,
  PopoverPositionY,
  MatPopoverComponent
} from '.';

@Component({
  template: `
    <button [matPopoverTriggerFor]="popover" #triggerEl>Toggle popover</button>
    <mat-popover [xPosition]="'after'" [yPosition]="'below'" #popover="matPopover" matPopoverTrigger="click"
                 [overlapTrigger]="true">
      <button> Item </button>
      <button disabled> Disabled </button>
    </mat-popover>
  `
})
class SimplePopoverComponent {
  @ViewChild(MatPopoverTriggerDirective, {static: false}) trigger: MatPopoverTriggerDirective;
  @ViewChild('triggerEl', {static: false}) triggerEl: ElementRef;
  @ViewChild(MatPopoverComponent, {static: false}) popover: MatPopoverComponent;
}

@Component({
  template: `
    <button [matPopoverTriggerFor]="popover" #triggerEl>Toggle popover</button>
    <mat-popover [xPosition]="xPosition" [yPosition]="yPosition" #popover="matPopover" [overlapTrigger]="true">
      <button> Positioned Content </button>
    </mat-popover>
  `
})
class PositionedPopoverComponent {
  @ViewChild(MatPopoverTriggerDirective, {static: false}) trigger: MatPopoverTriggerDirective;
  @ViewChild('triggerEl', {static: false}) triggerEl: ElementRef;
  xPosition: PopoverPositionX = 'before';
  yPosition: PopoverPositionY = 'above';
}

@Component({
  selector: 'custom-popover',
  template: `
    <ng-template>
      Custom Popover header
      <ng-content></ng-content>
    </ng-template>
  `,
  exportAs: 'matCustomPopover',
})
class CustomPopoverPanelComponent implements MatPopoverPanel {
  xPosition: PopoverPositionX = 'after';
  yPosition: PopoverPositionY = 'below';
  overlapTrigger: true;
  matPopoverTrigger: 'hover';
  matPopoverDelay: 300;
  matPopoverPlacement: 'bottom';
  closeDisabled: false;

  @ViewChild(TemplateRef, {static: false}) templateRef: TemplateRef<any>;
  @Output() close = new EventEmitter<void>();
  focusFirstItem = () => {};
  setPositionClasses = () => {};
  _emitCloseEvent() {
    this.close.emit();
  }
}

@Component({
  template: `
    <button [matPopoverTriggerFor]="popover">Toggle popover</button>
    <custom-popover #popover="matCustomPopover">
      <button mat-popover-item> Custom Content </button>
    </custom-popover>
  `
})
class CustomPopoverComponent {
  @ViewChild(MatPopoverTriggerDirective, {static: false}) trigger: MatPopoverTriggerDirective;
}

describe('MatPopover', () => {
  let overlayContainerElement: HTMLElement;
  let dir: Direction;

  beforeEach(async(() => {
    dir = 'ltr';
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatPopoverModule
      ],
      declarations: [
        SimplePopoverComponent,
        CustomPopoverPanelComponent,
        CustomPopoverComponent,
        PositionedPopoverComponent,
      ],
      providers: [
        { provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            overlayContainerElement.classList.add('cdk-overlay-container');
            document.body.appendChild(overlayContainerElement);
            // remove body padding to keep consistent cross-browser
            document.body.style.padding = '0';
            document.body.style.margin = '0';
            return { getContainerElement: () => overlayContainerElement };
          }},
        { provide: Directionality, useFactory: () => ({value: dir}) }
      ]
    });

    TestBed.compileComponents();
  }));

  afterEach(() => {
    document.body.removeChild(overlayContainerElement);
  });

  it('should open the popover as an idempotent operation', () => {
    const fixture = TestBed.createComponent(SimplePopoverComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openPopover();
      fixture.componentInstance.trigger.openPopover();

      expect(overlayContainerElement.textContent).toContain('Item');
      expect(overlayContainerElement.textContent).toContain('Disabled');
    }).not.toThrowError();
  });

  it('should close the popover when a click occurs outside the popover', () => {
    const fixture = TestBed.createComponent(SimplePopoverComponent);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openPopover();

    const backdrop = <HTMLElement>overlayContainerElement.querySelector('.cdk-overlay-backdrop');
    backdrop.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(overlayContainerElement.textContent).toBe('');
    });
  });

  it('should open a custom popover', () => {
    const fixture = TestBed.createComponent(CustomPopoverComponent);
    fixture.detectChanges();
    expect(overlayContainerElement.textContent).toBe('');
    expect(() => {
      fixture.componentInstance.trigger.openPopover();
      fixture.componentInstance.trigger.openPopover();

      expect(overlayContainerElement.textContent).toContain('Custom Popover header');
      expect(overlayContainerElement.textContent).toContain('Custom Content');
    }).not.toThrowError();
  });

  it('should set the panel direction based on the trigger direction', () => {
    dir = 'rtl';
    const fixture = TestBed.createComponent(SimplePopoverComponent);
    fixture.detectChanges();
    fixture.componentInstance.trigger.openPopover();
    fixture.detectChanges();
    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-connected-position-bounding-box');
    expect(overlayPane.getAttribute('dir')).toEqual('rtl');
  });

  describe('positions', () => {
    let fixture: ComponentFixture<PositionedPopoverComponent>;
    let panel: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(PositionedPopoverComponent);
      fixture.detectChanges();

      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the bottom edge of viewport,so it has space to open "above"
      trigger.style.position = 'absolute';
      trigger.style.bottom = '0';
      // Push trigger to the right, so it has space to open "before"
      trigger.style.right = '0';

      fixture.componentInstance.trigger.openPopover();
      fixture.detectChanges();
      panel = overlayContainerElement.querySelector('.mat-popover-panel') as HTMLElement;
    });

    it('should append mat-popover-before if the x position is changed', () => {
      expect(panel.classList).toContain('mat-popover-before');
      expect(panel.classList).not.toContain('mat-popover-after');

      fixture.componentInstance.xPosition = 'after';
      fixture.detectChanges();

      expect(panel.classList).toContain('mat-popover-after');
      expect(panel.classList).not.toContain('mat-popover-before');
    });

    it('should append mat-popover-above if the y position is changed', () => {
      expect(panel.classList).toContain('mat-popover-above');
      expect(panel.classList).not.toContain('mat-popover-below');

      fixture.componentInstance.yPosition = 'below';
      fixture.detectChanges();

      expect(panel.classList).toContain('mat-popover-below');
      expect(panel.classList).not.toContain('mat-popover-above');
    });

    it('should default to the "below" and "after" positions', () => {
      fixture.destroy();

      const newFixture = TestBed.createComponent(SimplePopoverComponent);

      newFixture.detectChanges();
      newFixture.componentInstance.trigger.openPopover();
      newFixture.detectChanges();
      panel = overlayContainerElement.querySelector('.mat-popover-panel') as HTMLElement;

      expect(panel.classList).toContain('mat-popover-below');
      expect(panel.classList).toContain('mat-popover-after');
    });

  });

  describe('fallback positions', () => {

    it('should fall back to "before" mode if "after" mode would not fit on screen', () => {
      const fixture = TestBed.createComponent(SimplePopoverComponent);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the right side of viewport, so it doesn't have space to open
      // in its default "after" position on the right side.
      trigger.style.position = 'absolute';
      trigger.style.right = '0';

      fixture.componentInstance.trigger.openPopover();
      fixture.detectChanges();
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      // In "before" position, the right sides of the overlay and the origin are aligned.
      // To find the overlay left, subtract the popover width from the origin's right side.
      const expectedLeft = triggerRect.right - overlayRect.width;
      expect(substract(overlayRect.left, expectedLeft)).toBeLessThan(1);
      // The y-position of the overlay should be unaffected, as it can already fit vertically
      expect(substract(overlayRect.top, triggerRect.top)).toBeLessThan(1);
    });

    // TODO: Research why the component don't refresh well in the bitbucket pipelines and the ClientRect is different.
    xit('should fall back to "above" mode if "below" mode would not fit on screen', () => {
      const fixture = TestBed.createComponent(SimplePopoverComponent);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // Push trigger to the bottom part of viewport, so it doesn't have space to open
      // in its default "below" position below the trigger.
      trigger.style.position = 'absolute';
      trigger.style.bottom = '0';

      fixture.componentInstance.trigger.openPopover();
      fixture.detectChanges();
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      // In "above" position, the bottom edges of the overlay and the origin are aligned.
      // To find the overlay top, subtract the popover height from the origin's bottom edge.
      const expectedTop = triggerRect.bottom - overlayRect.height;
      expect(substract(overlayRect.top, expectedTop)).toBeLessThan(1);
      // The x-position of the overlay should be unaffected, as it can already fit horizontally
      expect(substract(overlayRect.left, triggerRect.left)).toBeLessThan(1);
    });

    xit('should re-position popover on both axes if both defaults would not fit', () => {
      const fixture = TestBed.createComponent(SimplePopoverComponent);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;

      // push trigger to the bottom, right part of viewport, so it doesn't have space to open
      // in its default "after below" position.
      trigger.style.position = 'absolute';
      trigger.style.right = '0';
      trigger.style.bottom = '0';

      fixture.componentInstance.trigger.openPopover();
      fixture.detectChanges();
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();
      const expectedLeft = triggerRect.right - overlayRect.width;
      const expectedTop = triggerRect.bottom - overlayRect.height;
      expect(substract(overlayRect.left, expectedLeft)).toBeLessThan(1);
      expect(substract(overlayRect.top, expectedTop)).toBeLessThan(1);
    });

    it('should re-position a popover with custom position set', () => {
      const fixture = TestBed.createComponent(PositionedPopoverComponent);
      fixture.detectChanges();
      const trigger = fixture.componentInstance.triggerEl.nativeElement;
      fixture.componentInstance.trigger.openPopover();
      fixture.detectChanges();
      const overlayPane = getOverlayPane();
      const triggerRect = trigger.getBoundingClientRect();
      const overlayRect = overlayPane.getBoundingClientRect();

      // As designated "before" position won't fit on screen, the popover should fall back
      // to "after" mode, where the left sides of the overlay and trigger are aligned.
      expect(substract(overlayRect.left, triggerRect.left)).toBeLessThanOrEqual(1);
      // As designated "above" position won't fit on screen, the popover should fall back
      // to "below" mode, where the top edges of the overlay and trigger are aligned.
      expect(substract(overlayRect.top, triggerRect.top)).toBeLessThanOrEqual(1);
    });

    function getOverlayPane(): HTMLElement {
      return overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    }
  });

  describe('destroy', () => {
    it('does not throw an error on destroy', () => {
      const fixture = TestBed.createComponent(SimplePopoverComponent);
      expect(fixture.destroy.bind(fixture)).not.toThrow();
    });
  });

});

function substract(a, b): number {
  return a > b ? a - b : b - a;
}
