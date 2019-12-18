import { AfterContentInit, Component, ContentChildren, Directive, Input, OnDestroy, QueryList } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'mat-tab[routerLink]'
})
export class RouterTabDirective {
  constructor(public tab: MatTab, public link: RouterLink) {}
}

@Directive({
  selector: '[routerTabs]'
})
export class RouterTabsDirective implements AfterContentInit, OnDestroy {
  @ContentChildren(RouterTabDirective)
  routerTabs: QueryList<RouterTabDirective>;

  private subscription = new Subscription();

  constructor(private host: MatTabGroup, private router: Router) {}

  private setIndex() {
    this.routerTabs.find((tab, i) => {

      if (!this.router.isActive(tab.link.urlTree, false)) {
        return false;
      }

      tab.tab.isActive = true;
      this.host.selectedIndex = i;
    });
  }

  ngAfterContentInit(): void {
    this.setIndex();

    this.subscription.add(this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof NavigationEnd) {
        this.setIndex();
      }
    }));

    this.subscription.add(this.host.selectedTabChange.subscribe(_ => {
      const tab = this.routerTabs.find(item => item.tab.isActive);

      if (!tab) {
        return false;
      }

      this.router.navigateByUrl(tab.link.urlTree);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

@Component({
  selector: 'exo-router-tabs',
  templateUrl: './exo-router-tabs.component.html',
  styleUrls: ['./exo-router-tabs.component.scss'],
})
export class ExoRouterTabsComponent {
  @Input()
  tabs: { label: string, link: string, showBadge: boolean }[];
}
