import { Component } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';

import { TeamSelectionBarComponent } from '@service/shared/components/team-selection-bar/team-selection-bar.component';
import { configTestBed } from '@testing/test.common.spec';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { FakeUserModelFactory } from '@core/faker_factories';
import { TeamModel } from '@applications/service/old-project/models/team.model';
import * as fromProject from '@applications/service/old-project/store/project';
import { UrlService } from '@app/core';

@Component({
  template: '<div>example</div>'
})
export class FakeComponent {}

describe('TeamSelectionBarComponent', () => {
  let component: TeamSelectionBarComponent;
  let fixture: ComponentFixture<TeamSelectionBarComponent>;

  const initialState = {
    entities: {},
    ids: [],
    selectedProjectPk: undefined
  };

  const moduleDef: TestModuleMetadata = {
    imports: [
      TranslateStubModule,
      MatIconModule,
      MatMenuModule,
      RouterTestingModule.withRoutes(
        [{path: 'platform/service/:pkService/team/:pkTeam/step/:pkStep/reflect', component: FakeComponent}]
      ),
      NoopAnimationsModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('projects', fromProject.reducers, {
        initialState: {
          projects: initialState
        }
      }),
    ],
    declarations: [
      TeamSelectionBarComponent,
      FakeComponent
    ],
    providers: [
      UrlService
    ]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSelectionBarComponent);
    component = fixture.componentInstance;

    component.user = new FakeUserModelFactory();
    component.teams = [
      new TeamModel({pk: '1', name: 'Team one'}),
      new TeamModel({pk: '2', name: 'Team Rocket'}),
    ];
    component.teamSelected = new TeamModel({pk: '2', name: 'Team Rocket'});

    fixture.detectChanges();
  });

  it('Should be created', () => {
    expect(component).toBeTruthy();
  });

  it('Should navigate when the team is changed', () => {
    const router = TestBed.get(Router);
    component.pkService = '1';
    router.navigate(['/platform/service/1/team/1/step/3/reflect']).then(() => {
      const navigateSpy = spyOn(router, 'navigate');
      component.selectTeam(<TeamModel>component.teams[1]);
      expect(navigateSpy).toHaveBeenCalledWith(['/platform/service/1/team/2/step/3/reflect']);
    });
  });

  /**
   * TODO - Set the intial state for entities
   *
   *
   *
  it('Should render a menu with two item', () => {
    component.store.source.value = {
      entities: {
        '1': {pk: '1', name: 'project name', consultantsRoles: [{pkUser: '1', nameRole: 'a', codeRole: 'A'}] }
      },
      ids: ['1'],
      selectedProjectPk: '1'
    };

    const barSelection: DebugElement = fixture.debugElement.query(By.css('.team-selection'));
    barSelection.nativeElement.click();

    const items: DebugElement[] = fixture.debugElement.queryAll(By.css('button.mat-menu-item'));

    expect(items.length).toBe(component.teams.length);
    expect(items[0].nativeElement.textContent).toEqual('Team one');
    expect(items[1].nativeElement.textContent).toEqual('Team Rocket');
  });
*/
});

