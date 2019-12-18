import { inject, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

import { TranslateStubModule } from '@testing/modules/translate-stub.module';
import { EffectRunner, EffectsTestingModule } from '@testing/modules/effects-testing.module';
import { configTestBed } from '@testing/test.common.spec';
import { URL_SERVICE_STUB_PROVIDER } from '@core/services/stubs';

import { UserService } from '../../services/user.service';
import { FakeProjectMemberFactory } from '../../models/project-member-fake.model';
import * as usersActions from '../action/user.action';
import * as fromUsers from '../reducer/index';
import { INITIAL_VALUES } from '../reducer/users.reducer';
import { UsersEffect } from './users.effect';
import { ProjectsState } from '../reducer/index';

describe('UsersEffect', () => {
  let runnerEffect: EffectRunner;
  let usersEffect: UsersEffect;
  let service: UserService;

  const member = new FakeProjectMemberFactory();

  const moduleDef: TestModuleMetadata = {
    imports: [
      EffectsTestingModule,
      TranslateStubModule,
      MatSnackBarModule,
      NoopAnimationsModule,
      RouterTestingModule,
      StoreModule.forRoot({}),
      StoreModule.forFeature('workspaceProjects',
        fromUsers.reducers,
        {
          initialState: <ProjectsState>{ usersProjectSelected: INITIAL_VALUES }
        }
      )
    ],
    providers: [
      TranslateService,
      { provide: UserService, useValue: {
          getUsers() {},
          createCollaborator() {},
          createParticipant() {},
          editCollaborator() {},
          editParticipant() {},
          editParticipantTeams() {},
          deleteUser() {}
        }
      },
      UsersEffect,
      URL_SERVICE_STUB_PROVIDER
    ]
  };

  configTestBed(moduleDef, false);

  beforeEach(inject([EffectRunner, UsersEffect], (runner: EffectRunner, effect: UsersEffect) => {
    service = TestBed.get(UserService);
    runnerEffect = runner;
    usersEffect = effect;
  }));

  it('Should return a LOAD_SUCCESS after OK execute a LOAD', () => {
    const spy = spyOn(service, 'getUsers').and.returnValue(observableOf({
      results: [member],
      count: '1',
      next: '',
      previous: ''
    }));

    usersEffect.loading$.subscribe((result: any) => {
      expect(spy).toHaveBeenCalled();
      expect(result.type).toEqual(usersActions.LoadSuccess);
    });

    runnerEffect.queue({
      type: usersActions.Load
    });
  });

  it('Should return a LOAD after OK execute a SEARCH', () => {
      usersEffect.searching$.subscribe((result: any) => {
      expect(result.type).toEqual(usersActions.Load);
    });

    runnerEffect.queue({
      type: usersActions.SetSearch
    });
  });

  it('Should return a LOAD after OK execute a PAGINATE', () => {
      usersEffect.paginating$.subscribe((result: any) => {
      expect(result.type).toEqual(usersActions.Load);
    });

    runnerEffect.queue({
      type: usersActions.SetPagination
    });
  });

  it('Should return a CREATE_COLLABORATOR_SUCCESS after OK execute a CREATE_COLLABORATOR', () => {
    spyOn(service, 'createCollaborator').and.returnValue(observableOf(member));

    runnerEffect.queue({
      type: usersActions.CreateCollaborator,
      payload: {
        data: { projectRoles: [1, 2], teams: [1] },
        projectPk: 1
      }
    });

    usersEffect.creatingCollaborator$.subscribe((result: any) => {
      expect(service.createCollaborator).toHaveBeenCalled();
      expect(result.type).toEqual(usersActions.CreateCollaboratorSuccess);
    });
  });

  it('Should return a EDIT_COLLABORATOR_SUCCESS after OK execute a EDIT_COLLABORATOR', () => {
    spyOn(service, 'editCollaborator').and.returnValue(observableOf(member));

    usersEffect.editingCollaborator$.subscribe((result: any) => {
      expect(service.editCollaborator).toHaveBeenCalled();
      expect(result.type).toEqual(usersActions.EditCollaboratorSuccess);
    });

    runnerEffect.queue({
      type: usersActions.EditCollaborator,
      payload: {
        data: { projectRoles: [1, 2], teams: [1] },
        projectPk: 1,
        userUuid: 'XXX'
      }
    });
  });

  it('Should return a CREATE_PARTICIPANT_SUCCESS after OK execute a CREATE_PARTICIPANT', () => {
    spyOn(service, 'createParticipant').and.returnValue(observableOf(member));

    runnerEffect.queue({
      type: usersActions.CreateParticipant,
      payload: {
        data: { name: 'kate', email: 'kate@example.com', teams: [1] },
        projectPk: 1
      }
    });

    usersEffect.creatingParticipant$.subscribe((result: any) => {
      expect(service.createParticipant).toHaveBeenCalled();
      expect(result.type).toEqual(usersActions.CreateParticipant);
    });
  });

  it('Should return a EDIT_PARTICIPANT_SUCCESS after OK execute a EDIT_PARTICIPANT', () => {
    spyOn(service, 'editParticipant').and.returnValue(observableOf(member));

    usersEffect.editingParticipant$.subscribe((result: any) => {
      expect(service.editParticipant).toHaveBeenCalled();
      expect(result.type).toEqual(usersActions.EditParticipantSuccess);
    });

    runnerEffect.queue({
      type: usersActions.EditParticipant,
      payload: {
        data: { name: 'kate', email: 'kate@example.com', teams: [1] },
        projectPk: 1,
        userUuid: 'XXX'
      }
    });
  });

  it('Should return a EDIT_PARTICIPANT_TEAMS_SUCCESS after OK execute a EDIT_PARTICIPANT_TEAMS', () => {
    spyOn(service, 'editParticipantTeams').and.returnValue(observableOf(member));

    usersEffect.editingParticipantTeams$.subscribe((result: any) => {
      expect(service.editParticipantTeams).toHaveBeenCalled();
      expect(result.type).toEqual(usersActions.EditParticipantTeamsSuccess);
    });

    runnerEffect.queue({
      type: usersActions.EditParticipantTeams,
      payload: {
        data: { name: 'kate', email: 'kate@example.com', teams: [1] },
        projectPk: 1,
        userUuid: 'XXX'
      }
    });
  });

  it('Should return a DELETE_SUCCESS after OK execute a DELETE', () => {
    spyOn(service, 'deleteUser').and.returnValue(observableOf(member));
    usersEffect.deleting$.subscribe((result: any) => {
      expect(service.deleteUser).toHaveBeenCalled();
      expect(result.type).toEqual(usersActions.DeleteSuccess);
    });
    runnerEffect.queue({
      type: usersActions.Delete,
      payload: new FakeProjectMemberFactory()
    });
  });
});

