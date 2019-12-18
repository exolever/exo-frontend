import { OnInit, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { GridLayoutInterface } from './gridLayout.interface';

export class MixinGridLayoutComponent implements OnInit, OnDestroy {
  private querySubscriptions: Subscription;
  protected listGridLayout: Array<GridLayoutInterface> = [];
  public cardsPerRow: number;

  constructor(
    protected mediaService: MediaObserver
  ) { }

  ngOnInit() {
    this.startGridLayout();
    this.adaptGridLayoutToResolution();
  }

  adaptGridLayoutToResolution(): void {
    this.querySubscriptions = this.mediaService.media$.subscribe((change: MediaChange) => {
      const sizeGrid = this.listGridLayout.find(grid => change.mqAlias === grid.breakpoint);
      if (sizeGrid) { this.cardsPerRow = sizeGrid.cardsNumber; }
    }
    );
  }
  startGridLayout() {
    const sizeGrid = this.listGridLayout.find(grid => this.mediaService.isActive(grid.breakpoint));
    if (sizeGrid) { this.cardsPerRow = sizeGrid.cardsNumber; }
  }

  ngOnDestroy(): void {
    if (this.querySubscriptions) { this.querySubscriptions.unsubscribe(); }
  }
}
