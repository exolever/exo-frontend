import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configTestBed } from '@testing/test.common.spec';

import { TeamRating } from '@applications/service/shared/models';
import { TeamRankComponent } from './team-rank.component';

describe('TeamRankComponent', () => {
  let component: TeamRankComponent;
  let fixture: ComponentFixture<TeamRankComponent>;

  const moduleDef: TestModuleMetadata = {

    declarations: [
      TeamRankComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
  };

  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamRankComponent);
    component = fixture.componentInstance;
    component.teamRating = new TeamRating({
      pkTeam: '1',
      nameTeam: 'Team name',
      ratings: [3, 2, 1, -1],
      avg: 1
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
