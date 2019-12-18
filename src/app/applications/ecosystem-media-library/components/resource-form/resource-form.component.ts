import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from '@core/store/reducers';
import { KeywordModel } from '@applications/shared/models';

import { FilterOptionsService } from '../../services/filter.service';
import { ResourcesService } from '../../services/resources.service';
import { ValidateVideoURL } from '../../utils/url-validator';
import * as CrudActions from '../../store/crud/crud.actions';
import {Hubs} from '@ecosystem-media-library/store/resource.model';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})
export class ResourceFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  submitted = false;
  tags: KeywordModel[] = [];
  keywordModel: KeywordModel;
  editionMode = false;
  private subscriptions: Subscription[] = [];
  private sectionsSelected: Array<string> = [];
  /** data structure to generate the checkbox fields */
  mlProjectTypes = [
    { code: 'S', label: 'PROJECT.SECTIONS.EXO SPRINT', control: undefined },
    { code: 'A', label: 'PROJECT.SECTIONS.EXO AUTOMATED_SPRINT', control: undefined },
    { code: 'W', label: 'PROJECT.SECTIONS.EXO WORKSHOP', control: undefined },
    { code: 'F', label: 'PROJECT.SECTIONS.FASTRACK', control: undefined }
  ];

  mlHubs = Hubs;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ResourceFormComponent>,
    private tagsService: FilterOptionsService,
    private resourceService: ResourcesService,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    /** get project roles and hubs values */
    if (this.data) {
      this.editionMode = true;
      this.sectionsSelected = this.data.sections || [];
    }

    this.subscriptions.push(
      this.tagsService.getTags().subscribe( resp => this.tags = resp || [])
    );

    this.createForm();
    if (this.editionMode) {
      this.updateFormValue();
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      'origin': [{value: '', disabled: this.editionMode}, [Validators.required]],
      'url': [
        {value: '', disabled: this.editionMode},
        [Validators.required], // synchronous validations
        [ValidateVideoURL(this.resourceService)] // asynchronous validations
      ],
      'name': ['', [Validators.required, Validators.maxLength(50)]],
      'description': ['', [Validators.required, Validators.maxLength(300)]],
      'tags': [[], [Validators.required, Validators.minLength(1)]],
      'projectType': this.buildProjectType(),
      'hubs': this.buildUserRoles()
    });
  }

  private updateFormValue(): void {
    this.form.patchValue({
      url: this.data.link,
      name: this.data.name,
      description: this.data.description,
      tags: this.data.tags.map(tag => {
        const newTag = new KeywordModel(tag.name);
        newTag.pk = tag.pk;
        return newTag;
      })
    });
  }

  /**
   * form control checkbox builders
   */
  private buildProjectType(): any {
    const arrOfControls = Object.values(this.mlProjectTypes).map(projectType => {
      const formControl =
        this.fb.control(this.data && this.data.sections ?
          this.data.sections.includes(projectType.code) : false );
      projectType.control = formControl;
      return formControl;
    });
    return this.fb.array(arrOfControls);
  }
  private buildUserRoles(): any {
    const arrOfControls = Object.values(this.mlHubs).map(hub => {
      const formControl =
        this.fb.control(this.data && this.data.sections ?
          this.data.sections.includes(hub.code) : false );
      hub.control = formControl;
      return formControl;
    });
    return this.fb.array(arrOfControls);
  }

  /** getters for the from checkbox fields */
  get projectType(): FormArray {
    return <FormArray>this.form.get('projectType');
  }
  get hubs(): FormArray {
    return <FormArray>this.form.get('hubs');
  }

  /**
   * manages the selection and unselection of the section field, which consist of both the hubs and projectType fields
   * @param {string} code
   */
  setSectionSelected(code: string): void {
    this.sectionsSelected.includes(code) ?
      this.sectionsSelected.splice( this.sectionsSelected.indexOf(code), 1 ) :
      this.sectionsSelected.push(code);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      const params = {
        name: formData.name,
        url: formData.url,
        description: formData.description,
        tags: formData.tags.map(tag => tag.pk),
        sections: this.sectionsSelected
      };
      if (this.editionMode) {
        params['pk'] = this.data.pk;
        this.store.dispatch(new CrudActions.Update(params));
      } else {
        this.store.dispatch(new CrudActions.Upload(params));
      }
      this.dialogRef.close();
    } else {
      Object.keys(this.form.controls).forEach(field => this.form.get(field).markAsTouched({ onlySelf: true }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
