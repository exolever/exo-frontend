import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import {  Observable } from 'rxjs';

import { Step } from '@service/old-project/models/step.model';
import { StepModel as StepGProject} from '@applications/workspace/projects/models/step.model';
import { ProjectModel } from '@applications/service/old-project/models/project.model';
import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { HeaderAssignmentService } from '../../services/header-assignment.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignmentComponent implements OnInit {
  @Input() loading: boolean;
  @Input() selectedStep: Step | StepGProject;
  @Input() project: GenericProject | ProjectModel;
  showHeader$: Observable<boolean>;

  constructor(
    private headerService: HeaderAssignmentService
  ) { }

  ngOnInit() {
    this.showHeader$ = this.headerService.assignmentHeader$;
  }

  showReflectTab (): boolean {
    return this.project instanceof GenericProject ?
      this.selectedStep.enabledReflect &&
        (this.project.settings.feedbackEnabled || this.project.settings.quizesEnabled) :
      this.selectedStep.enabledReflect;
  }
}
