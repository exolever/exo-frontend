import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { environment } from '../environments/environment';
import { Industry, Question, Step } from './model/question.model';
import { English, LanguagesEnum, Spanish } from './translations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'exo-exq-container',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() slug: string;
  @Input() lang: string;
  @Input() domain: string;

  stepList: Step[];
  industries: Industry[];
  steps: FormArray;
  total: number;
  selectedIdx = 0;
  showResults: boolean;
  isValidSlug: boolean;
  checkedSlug: boolean;
  form: FormGroup;
  submitted = false;
  showIntro = true;
  translations: any;
  checkedAgreement: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      organization: [],
      email: ['', Validators.required],
      industry: ['', Validators.required],
      steps: this.formBuilder.array([])
    });
    this.getParams();
    this.checkSlug();
    this.getQuestions();
    this.getIndustries();
    this.initializeTranslations();
  }

  initializeTranslations() {
    if ( this.lang === LanguagesEnum.English ) {
      this.translations = English;
    }
    if ( this.lang === LanguagesEnum.Spanish ) {
      this.translations = Spanish;
    }
  }

  groupBy = (xs, key) =>
    xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {})

  onSubmit() {
    const data = this.parseData();
    let params = new HttpParams();
    params = params.set('lang', this.lang);
    this.http.post(`${ this.domain }/exq/api/fill/${ this.slug }/`, data, {params}).subscribe((resp: any) => {
      this.submitted = true;
      this.total = resp.total;
      this.showResults = resp.showResults;
    });
  }

  setAsDone($event) {
    this.selectedIdx = $event.selectedIndex;
    document.getElementsByClassName('mat-step-icon-selected')[0].classList.add('mat-step-done');
  }

  private getQuestions() {
    let params = new HttpParams();
    params = params.set('lang', this.lang);
    this.http.get(`${ this.domain }/exq/api/questions/`, {params})
      .subscribe((data: Question[]) => {
        const groupSteps = this.groupBy(data, 'section');
        this.stepList = Object.keys(groupSteps).map(key => ({section: key, questions: groupSteps[key]}));
        this.addFormControl();
      });
  }

  private addFormControl() {
    this.stepList.map(sect => {
      const fb = this.formBuilder.group({});
      sect.questions.map(quest => {
        fb.addControl(quest.pk.toString(), new FormControl('', Validators.required));
      });
      this.steps = this.form.get('steps') as FormArray;
      this.steps.push(fb);
    });
  }

  private getIndustries() {
    let params = new HttpParams();
    params = params.set('lang', this.lang);
    this.http.get(`${ this.domain }/exq/api/industry/`, {params})
      .subscribe((data: Industry[]) => this.industries = data);
  }

  private parseData() {
    const data: any = {};
    const quest = {};
    const q = [...this.form.get('steps').value];
    data.name = this.form.get('name').value;
    data.organization = this.form.get('organization').value ? this.form.get('organization').value : '';
    data.email = this.form.get('email').value;
    data.industry = this.form.get('industry').value;
    q.map(o => Object.assign(quest, o));
    data.answers = Object.keys(quest).map((key) =>
      ({question: Number(key), option: quest[key]}));
    return data;
  }

  private checkSlug() {
    this.http.get(`${ this.domain }/exq/api/check-slug/`, {
      params: {slug: this.slug}
    })
      .subscribe((res: boolean) => {
        this.isValidSlug = res;
        this.checkedSlug = true;
      });
  }

  onReset() {
    this.submitted = false;
    this.goToTop();
  }

  /**
   * Get input values or queryParams from url. English will be language by default.
   */
  private getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    this.slug = this.slug ? this.slug : urlParams.get('slug');
    this.lang = this.lang ? this.lang : urlParams.get('lang') || LanguagesEnum.English;
    this.domain = this.domain ? this.domain : environment['baseUrl'];
  }

  onStart() {
    this.showIntro = !this.showIntro;
  }

  printTitle(selectedIdx: number) {
    return `${selectedIdx + 1} ${this.translations.of} ${this.stepList.length + 1}`;
  }

  goToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  onCheck($event) {
    this.checkedAgreement = $event;
  }
}
