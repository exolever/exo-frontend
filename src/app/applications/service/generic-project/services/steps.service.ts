import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UrlService, ApiResources } from '@core/services';
import { StepModel } from '@applications/workspace/projects/models/step.model';
import { Task } from '@applications/service/shared/modules/tasks/models';

import { Feedback } from '../../shared/models/feedback.model';

@Injectable()
export class StepsService {
  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) { }

  getSteps(projectPk: number, teamPk: number): Observable<StepModel[]> {
    const apiUrl = this.urlService.resolve(ApiResources.GENERIC_PROJECT_STEPS, projectPk, teamPk);
    return this.http.get<StepModel[]>(apiUrl).pipe(
      map(response => response.map(r => new StepModel(r)))
    );
  }

  getStep(projectPk: number, teamPk: number, stepPk: number): Observable<StepModel> {
    const apiUrl = this.urlService.resolve(ApiResources.GENERIC_PROJECT_STEP, projectPk, teamPk, stepPk);
    return this.http.get<StepModel[]>(apiUrl).pipe(
      map(response => new StepModel(response))
    );
  }

  markTaskAsDone(projectPk: number, teamPk: number, stepPk: number, task: Task): Observable<Task> {
    const url = this.urlService.resolve( ApiResources.GENERIC_PROJECT_TASK_AS_DONE, projectPk, teamPk, stepPk);
    return this.http.post<Task>(url, {pk_list: [task.pk]}).pipe(
      map(response => new Task(response[0]))
    );
  }

  markTasksAsDone(projectPk: number, teamPk: number, stepPk: number, tasks: Task[]): Observable<Task[]> {
    const url = this.urlService.resolve( ApiResources.GENERIC_PROJECT_TASK_AS_DONE, projectPk, teamPk, stepPk);
    return this.http.post<Task[]>(url, {pk_list: tasks.map(task => task.pk)}).pipe(
      map(response => response.map(task => new Task(task)))
    );
  }

  markTaskAsTodo(projectPk: number, teamPk: number, stepPk: number, task: Task): Observable<Task> {
    const url = this.urlService.resolve(ApiResources.GENERIC_PROJECT_TASK_AS_TODO, projectPk, teamPk, stepPk);
    return this.http.post<Task>(url, {pk_list: [task.pk]}).pipe(
      map(response => new Task(response[0]))
    );
  }

  markTasksAsToDo(projectPk: number, teamPk: number, stepPk: number, tasks: Task[]): Observable<Task[]> {
    const url = this.urlService.resolve(ApiResources.GENERIC_PROJECT_TASK_AS_TODO, projectPk, teamPk, stepPk);
    return this.http.post<Task[]>(url, {pk_list: tasks.map(task => task.pk)}).pipe(
      map(response => response.map(task => new Task(task)))
    );
  }

  sendFeedback(projectPk: number, teamPk: number, stepPk: number, feedback: Feedback): Observable<Feedback> {
    const url = this.urlService.resolve(ApiResources.GENERIC_PROJECT_PROVIDE_FEEDBACK, projectPk, teamPk, stepPk);
    return this.http.post<Feedback>(url, feedback);
  }
}
