import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProjectMember } from '@applications/workspace/projects/models/project-member.model';
import { AppState } from '@core/store/reducers';
import { MemberCardInterface } from '@applications/service/shared/modules/member-card/member-card.inteface';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import * as fromGProject from '../../store/reducer';
import * as fromMemberActions from '../../store/actions/members.action';

@Component({
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectoryComponent implements OnInit, OnDestroy {

  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  members$: Observable<ProjectMember[]>;
  totalMembers$: Observable<number>;
  text$: Observable<string>;
  projectPk: number;
  searchBox = new FormControl('');
  subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private store: Store<AppState>,
  ) { }

  ngOnInit () {
    this.projectPk = this.route.snapshot.data.project.pk;
    this.store.dispatch(new fromMemberActions.LoadGProjectMembers(+this.projectPk));

    this.members$ = this.store.pipe(select(state => fromGProject.selectAllMembers(state.genericProject)));
    this.totalMembers$ = this.store.pipe(select(state => fromGProject.selectCountMembers(state.genericProject)));
    this.pageIndex$ = this.store.pipe(select(state => fromGProject.selectPageIndexMembers(state.genericProject)));
    this.pageSize$ = this.store.pipe(select(state => fromGProject.selectPageSizeMembers(state.genericProject)));
    this.text$ = this.store.pipe(select(state => fromGProject.selectSearchByMembers(state.genericProject)));

    this.subscriptions.add(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(value =>
        this.store.dispatch(
          new fromMemberActions.SetSearchGProjectMembers({projectPk: this.projectPk, searchBy: value})
        )
      )
    );

  }

  deserializeTeams(member: ProjectMember): string {
    return member.teamRoles ? member.teamRoles.map(t => t.name).join(', ') : '';
  }

  deserializeRoles(member: ProjectMember): string {
    return member.projectRoles ? member.projectRoles.map(p => p.name).join(', ') : '';
  }

  deserializerItemCard(member: ProjectMember): MemberCardInterface {
    const extraInformation = [];
    const teams = this.deserializeTeams(member);
    if (teams) {
      extraInformation.push({
        icon: 'supervisor_account',
        description: teams,
        tooltip: this.translateService.instant('ECOSYSTEM.DIRECTORY.CARD.TEAMS')
      });
    }
    return {
      user: Object.assign(member.user, {slug: member.user.slug}),
      description: this.deserializeRoles(member),
      extraInformation: extraInformation
    };
  }

  belongEcosystem(member: ProjectMember): boolean {
    const rolesToExclude = [
      SprintRoleEnum.SPRINT_PARTICIPANT_SPRINT,
      SprintRoleEnum.DELIVERY_MANAGER_SPRINT
    ];
    const roles = member.projectRoles ? member.projectRoles.map(p => p.code).join(', ') : '';
    return member && !(rolesToExclude.toString().includes(roles));
  }

  paginatorChange($event) {
    const pageIndex = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.store.dispatch(new fromMemberActions.SetPaginationGProjectMembers({
      projectPk: +this.projectPk,
      pageIndex: pageIndex + 1,
      pageSize: pageSize
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}

