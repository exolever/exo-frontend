import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { TestingUtilityModule } from '@testing/modules/testing-utility.module';
import { ActivatedRouteStub } from '@testing/stubs/router-stubs';
import { configTestBed } from '@testing/test.common.spec';
import { PromptDialogService } from '@shared/modules/prompt-dialog/prompt-dialog.service';
import { BreakPointService } from '@applications/break-point/break-point.service';
import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import { UsersState } from '../../../store/reducer/users.reducer';
import { ProjectsState } from '../../../store/reducer/index';
import * as fromUsers from '../../../store/reducer/index';
import { FakeProjectMemberFactory } from '../../../models/project-member-fake.model';
import { ProjectMembersComponent } from './project-members.component';


describe('ProjectMembersComponent', () => {
  let component: ProjectMembersComponent;
  let fixture: ComponentFixture<ProjectMembersComponent>;
  let translateService: TranslateService;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
  activatedRoute.testParams = { projectPk: '1' };

  const initialState: UsersState = {
    loading: false,
    loaded: false,
    count: undefined,
    pkSelected: undefined,
    pageSize: 15,
    pageIndex: 1,
    searchBy: '',
    ids: ['1'],
    entities: {'1': new FakeProjectMemberFactory() }
  };
  const moduleDef: TestModuleMetadata = {
    imports: [
      TestingUtilityModule,
      TranslateStubModule,
      StoreModule.forRoot({}, {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        }
      }),
      StoreModule.forFeature('workspaceProjects',
        fromUsers.reducers,
        { initialState: <ProjectsState>{ usersProjectSelected: initialState }}
      )
    ],
    declarations: [ProjectMembersComponent],
    providers: [
      TranslateService,
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: PromptDialogService, useValue: {} },
      { provide: BreakPointService, useValue: {} },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  };
  configTestBed(moduleDef);

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersComponent);
    translateService = TestBed.get(TranslateService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check function getMembers for Collaborators without team', () => {
    const collaboratorMember = new FakeProjectMemberFactory();
    const speakerLabel = SprintRoleEnum.toString(SprintRoleEnum.DISRUPTOR_SPRINT);
    collaboratorMember.projectRoles = [
      {
        code: SprintRoleEnum.DISRUPTOR_SPRINT,
        name: speakerLabel
      }
    ];
    const members = component.getMembers([collaboratorMember]);
    expect(members).toEqual([{member: collaboratorMember, description: `${speakerLabel}`}]);
  });

  it('check function getMembers for Collaborators with team', () => {
    const coachMember = new FakeProjectMemberFactory();
    const coachLabel = SprintRoleEnum.toString(SprintRoleEnum.SPRINT_COACH_SPRINT);
    coachMember.projectRoles = [
      {
        code: SprintRoleEnum.SPRINT_COACH_SPRINT,
        name: coachLabel
      }
    ];
    coachMember.teamRoles = [
      {
        exoRole: { code: SprintRoleEnum.SPRINT_COACH_SPRINT, name: coachLabel, description: null },
        teamPk: 11,
        name: 'team 1'
      }
    ];
    const members = component.getMembers([coachMember]);
    expect(members).toEqual([{member: coachMember, description: `${coachLabel} at team 1`}]);
  });

  it('check function getMembers for participant without team', () => {
    const noTeamLabel = translateService.instant(
      'ECOSYSTEM.WORKSPACE.PROJECTS.FORM.USERS.NO_TEAM_SELECTED').toLowerCase();
    const labelAt = translateService.instant('COMMON.AT');
    const participantMember = new FakeProjectMemberFactory();
    const participantLabel = SprintRoleEnum.toString(SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT);
    participantMember.projectRoles = [
      {
        code: SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT,
        name: participantLabel
      }
    ];
    const members = component.getMembers([participantMember]);
    expect(members).toEqual([{
      member: participantMember,
      description: `${participantLabel} ${labelAt} <span class="no-team">${noTeamLabel}</span>`
    }]);
  });

  it('check function getMembers for participant with team', () => {
    const participantLabel = SprintRoleEnum.toString(SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT);
    const participantMember = new FakeProjectMemberFactory();
    participantMember.projectRoles = [
      {
        code: SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT,
        name: participantLabel
      }
    ];
    participantMember.teamRoles = [
      {
        exoRole: { code: SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT, name: participantLabel },
        teamPk: 11,
        name: 'team 1'
      }
    ];
    const members = component.getMembers([participantMember]);
    expect(members).toEqual([{member: participantMember, description: `${participantLabel} at team 1`}]);
  });

});
