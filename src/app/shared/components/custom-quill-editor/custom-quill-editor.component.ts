import { Component, ViewChild, OnInit, AfterViewInit,
  Input, OnChanges, Optional, Self, OnDestroy, HostBinding, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, FormBuilder } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { FocusMonitor } from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import { HttpClient } from '@angular/common/http';

import { QuillModules, QuillEditorComponent } from 'ngx-quill';
import * as filestackQuillJs from 'filestack-js';
import { Subject, Subscription } from 'rxjs';
import 'quill-mention';

import { environment } from '@environments/environment';
import { UserModel } from '@core/models';
import { Pagination } from '@core/interfaces/pagination.interface';
import { StripHtmlPipe } from '@shared/pipes/strip-html.pipe';


@Component({
  selector: 'app-custom-quill-editor',
  templateUrl: './custom-quill-editor.component.html',
  styleUrls: ['./custom-quill-editor.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: CustomQuillEditorComponent }
  ]
})
export class CustomQuillEditorComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit,
  ControlValueAccessor, MatFormFieldControl<CustomQuillEditorComponent> {
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  set disabled( disabled ) {
    this._disabled = disabled;
  }
  get disabled() {
    return this._disabled;
  }
  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  get value(): any {
    return this._value;
  }
  set value( newValue: any ) {
    this._value = newValue;
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this._errorState;
  }
  set errorState( nextState: boolean ) {
    if ( this.stateChanges ) {
      this._errorState = nextState;
      this.stateChanges.next();
    }
  }
  get empty() {
    return this._empty;
  }

  set empty(empty: boolean) {
    this._empty = empty;
  }

  get shouldLabelFloat() { return this.focused ||  !this.empty; }

  constructor(
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private http: HttpClient,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  static nextId = 0;
  @ViewChild(QuillEditorComponent, {static: false}) editor: QuillEditorComponent;
  stateChanges = new Subject<void>();
  focused = false;

  isDisabled: boolean;
  quillConfig: QuillModules;
  textControl = new FormControl(undefined);
  subscriptions = new Subscription();

  private _errorState = false;
  private _disabled = false;
  private _empty = true;
  private _value = undefined;
  private _placeholder = undefined;
  private _required = undefined;

  @HostBinding() id = `app-custom-quill-editor-${CustomQuillEditorComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  @Input() isSubmitted: boolean;
  @Input() maxLength: number;
  @Input() mentionsAPI: string;

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onChange = (_: any) => {};
  onTouch = () => {};

  ngOnInit() {
    this.configEditor();
  }

  ngOnChanges() {
    if (this.isSubmitted) {
      this.checkErrorState();
    }
  }

  ngAfterViewInit() {
    this.editor.quillEditor.getModule('toolbar').addHandler('image', () => {
      const range = this.editor.quillEditor.getSelection();
      const setUpFilepicker = {
        accept: 'image/*',
        maxSize: (10 * 1024 * 1024),
        dropPane: {},
        onUploadDone: files =>
          this.editor.quillEditor.insertEmbed(range.index, 'image', files.filesUploaded[0].url, 'user')
      };
      filestackQuillJs.init(environment.FILESTACK_API_KEY).picker(setUpFilepicker).open();
    });
  }

  private configEditor(): void {
    this.quillConfig = {
      magicUrl: true,
      imageResize: {},
      toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image']
      ]
    };
    if (this.mentionsAPI) {
      this.quillConfig['mention'] = {
        allowedChars: /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*$/,
        mentionDenotationChars: ['@', '#'],
        dataAttributes: ['id', 'value', 'profilePictures', 'slug', 'mentiontype', 'mentionuuid', 'profileUrl'],
        renderItem: (item, searchTerm) => `<img src="${item.profilePictures}"> ${item.value}`,
        source: (searchTerm, renderList) => {
          const url = this.mentionsAPI.concat(`?search=${searchTerm}`);
          this.subscriptions.add(
            this.http.get(url).subscribe((response: Array<UserModel> | Array<Pagination<UserModel>>) => {
              const results = Object.keys(response).includes('results') ? response['results'] : response;
              renderList(results.map(item => {
                item['id'] = item['pk'];
                item['value'] = item['fullName'];
                item['profilePictures'] = item['profilePictures'][0]['url'];
                item['link'] = item['profileUrl'];
                item['mentiontype'] = 'user';
                item['mentionuuid'] = item['pk'];
                return item;
                })
              );
            })
          );
        }
      };
    }
  }

  writeValue(newValue: string): void {
    this.value = newValue;
    if (this.value) {
      this.textControl.setValue(this.value);
    }
    this.checkErrorState();
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  saveInformation() {
    // Avoid make changes first time is initialized with a value
    if (this.value !== this.textControl.value) {
      this.onChange(this.textControl.value);
      this.checkErrorState();
    }
  }

  onContainerClick() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.checkErrorState();
  }

  checkErrorState(): void {
    if (!this.focused) {
      const pipeStripHtml = new StripHtmlPipe();
      this.errorState = (!this.textControl.value && this.required) ||
        ( this.maxLength &&
          this.textControl.value &&
          pipeStripHtml.transform(this.textControl.value).length > this.maxLength
        );
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.subscriptions.unsubscribe();
  }

}
