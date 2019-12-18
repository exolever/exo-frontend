import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';

import { ExoCommonModule } from '@shared/exo-common.module';
import { FakeOpportunityFactory } from '@opportunities/faker_factories/opportunityFake.model';
import {
  OpportunityActionEnum
} from '@ecosystem/modules/opportunities/models/opportunity.enum';
import { configTestBed } from '@testing/test.common.spec';

import { OpportunityMenuActionsComponent } from './opportunity-menu-actions.component';

describe('OpportunityMenuActionsComponent', () => {
  let component: OpportunityMenuActionsComponent;
  let fixture: ComponentFixture<OpportunityMenuActionsComponent>;
  const moduleDef: TestModuleMetadata = {
    imports: [
      ExoCommonModule,
      TranslateStubModule,
      NoopAnimationsModule
    ],
    declarations: [ OpportunityMenuActionsComponent ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityMenuActionsComponent);
    component = fixture.componentInstance;
    const opportunity = new FakeOpportunityFactory();
    opportunity.actions = [OpportunityActionEnum.R];
    component.opportunity = opportunity;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setUp the menu ', () => {
    component.setUpOptions();
    expect(component.actionsToShow.length).toEqual(1);
    const menuButton: DebugElement = fixture.debugElement.query(By.css('.mat-icon-button'));
    menuButton.nativeElement.click();
    const items: DebugElement[] = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
    expect(items.length).toEqual(component.actionsToShow.length);
  });

});
