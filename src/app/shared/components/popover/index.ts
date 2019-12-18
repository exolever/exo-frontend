import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatPopoverComponent, MAT_POPOVER_DEFAULT_OPTIONS } from './popover-directive';
import { MatPopoverTriggerDirective, MAT_POPOVER_SCROLL_STRATEGY_PROVIDER} from './popover-trigger';


export * from './popover';

@NgModule({
  imports: [
    OverlayModule,
    CommonModule,
    MatCommonModule,
  ],
  exports: [ MatPopoverComponent, MatPopoverTriggerDirective, MatCommonModule ],
  declarations: [ MatPopoverComponent, MatPopoverTriggerDirective ],
  providers: [
    MAT_POPOVER_SCROLL_STRATEGY_PROVIDER,
    {
      provide: MAT_POPOVER_DEFAULT_OPTIONS,
      useValue: {
        overlapTrigger: true,
        xPosition: 'after',
        yPosition: 'below',
      },
    }
  ],
})
export class MatPopoverModule {}
