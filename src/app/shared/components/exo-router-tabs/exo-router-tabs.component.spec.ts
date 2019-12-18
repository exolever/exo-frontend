import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExoRouterTabsComponent } from './exo-router-tabs.component';
import { MatTabsModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('ExoRouterTabsComponent', () => {
  let component: ExoRouterTabsComponent;
  let fixture: ComponentFixture<ExoRouterTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatTabsModule, RouterModule ],
      declarations: [ ExoRouterTabsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExoRouterTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
