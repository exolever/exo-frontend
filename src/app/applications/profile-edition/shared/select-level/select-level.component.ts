import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IExOAttribute } from '@applications/shared/interfaces/exo-attribute.interface';
import { TranslateService } from '@ngx-translate/core';

enum LevelTypes {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

@Component({
  selector: 'app-select-level',
  templateUrl: './select-level.component.html',
  styleUrls: ['./select-level.component.scss']
})
export class SelectLevelComponent implements OnInit {

  @Input()
  item: IExOAttribute;

  @Output()
  submitLevel = new EventEmitter();

  levelList = [1, 2, 3];
  levels = {
    '0': { level: 0, selected: false },
    '1': { level: 1, selected: false },
    '2': { level: 2, selected: false },
    '3': { level: 3, selected: false },
  };

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.setLevel(this.item.level);
  }

  /**
   * mouseenter in a new level.
   * @param level
   */
  hoverLevel(level) {
    this.setLevel(level);
  }

  /**
   * mouseleave from a level.
   */
  blurLevel() {
    this.setLevel(this.item.level);
  }

  /**
   * Set selected as true to show rating color in the differents levels.
   * @param level
   */
  setLevel(level) {
    this.reset();
    do {
      this.levels[level].selected = true;
      level--;
    } while (level >= 0);
  }

  reset() {
    this.levelList.forEach((item) => {
      this.levels[item].selected = false;
    });
  }

  /**
   * Emit a new event with the new value from item to save.
   * @param level
   */
  emitLevel(level) {
    this.item.level = level;
    this.submitLevel.emit(this.item);
  }

  getLevel(item) {
    switch (item) {
      case 1:
        return LevelTypes.BEGINNER;
      case 2:
        return LevelTypes.INTERMEDIATE;
      case 3:
        return LevelTypes.ADVANCED;
      default:
        return '';
    }
  }

  description(level: number) {
    switch (level) {
      case 1:
        return this.translateService.instant('ECOSYSTEM.PROFILE.EDIT.EXPERTISE_AREAS.BEGINNER');
      case 2:
        return this.translateService.instant('ECOSYSTEM.PROFILE.EDIT.EXPERTISE_AREAS.INTERMEDIATE');
      case 3:
        return this.translateService.instant('ECOSYSTEM.PROFILE.EDIT.EXPERTISE_AREAS.ADVANCED');
      default:
        return '';
    }
  }
}
