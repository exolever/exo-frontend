import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GenericProject } from '@applications/workspace/projects/models/project.model';

@Component({
  selector: 'app-project-status-label',
  templateUrl: './project-status-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStatusLabelComponent {
  @Input() project: GenericProject;

}
