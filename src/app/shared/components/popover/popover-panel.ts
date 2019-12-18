import { EventEmitter, TemplateRef } from '@angular/core';
import { PopoverPositionX, PopoverPositionY } from './popover-positions';

export interface MatPopoverPanel {
  xPosition: PopoverPositionX;
  yPosition: PopoverPositionY;
  overlapTrigger: boolean;
  matPopoverTrigger: string;
  matPopoverDelay: number;
  matPopoverPlacement: string;
  closeDisabled: boolean;
  templateRef: TemplateRef<any>;
  close: EventEmitter<void>;
  focusFirstItem: () => void;
  setPositionClasses: (x: PopoverPositionX, y: PopoverPositionY) => void;
  _emitCloseEvent: () => void;
}
