import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResources, UrlService } from '@core/services';
import { Feedback } from '@applications/service/shared/models/feedback.model';
import { Task } from '@applications/service/shared/modules/tasks/models';

@Injectable()
export class ServiceInformationService {

  constructor(
    private authHttp: HttpClient,
    private urlService: UrlService
  ) { }

  markTaskAsDone(projectPk: string, teamPk: string, stepPk: string, task: Task): Observable<Task> {
    const url = this.urlService.resolveAPI( ApiResources.SERVICE_TASK_AS_DONE, projectPk, teamPk, stepPk);
    return this.authHttp.post<Task>(url, {pk_list: [task.pk]}).pipe(
      map(response => new Task(response[0]))
    );
  }

  markTasksAsDone(projectPk: string, teamPk: string, stepPk: string, tasks: Task[]): Observable<Task[]> {
    const url = this.urlService.resolveAPI( ApiResources.SERVICE_TASK_AS_DONE, projectPk, teamPk, stepPk);
    return this.authHttp.post<Task[]>(url, {pk_list: tasks.map(task => task.pk)}).pipe(
      map(response => response.map(task => new Task(task)))
    );
  }

  markTaskAsTodo(projectPk: string, teamPk: string, stepPk: string, task: Task): Observable<Task> {
    const url = this.urlService.resolveAPI( ApiResources.SERVICE_TASK_AS_TODO, projectPk, teamPk, stepPk);
    return this.authHttp.post<Task>(url, {pk_list: [task.pk]}).pipe(
      map(response => new Task(response[0]))
    );
  }

  markTasksAsToDo(projectPk: string, teamPk: string, stepPk: string, tasks: Task[]): Observable<Task[]> {
    const url = this.urlService.resolveAPI(ApiResources.SERVICE_TASK_AS_TODO, projectPk, teamPk, stepPk);
    return this.authHttp.post<Task[]>(url, {pk_list: tasks.map(task => task.pk)}).pipe(
      map(response => response.map(task => new Task(task)))
    );
  }

  sendFeedback(projectPk: string, teamPk: string, stepPk: string, feedback: Feedback): Observable<Feedback> {
    const url = this.urlService.resolveAPI(ApiResources.SERVICE_PROVIDE_FEEDBACK, projectPk, teamPk, stepPk);
    return this.authHttp.post<Feedback>(url, feedback);
  }
}
