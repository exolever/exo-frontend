import { Component, SimpleChanges, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { QuestionInterface } from '@applications/ecosystem/modules/opportunities/models/opportunity.interface';

@Component({
  selector: 'app-questions-management',
  templateUrl: './questions-management.component.html',
  styleUrls: ['./questions-management.component.scss']
})
export class QuestionsManagementComponent implements OnInit, OnChanges {
  @Input() questions: QuestionInterface[] = [];
  @Input() numberQuestions = 3;
  @Input() maxLengthQuestion = 500;
  form = new FormGroup({});
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeQuestionsFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.questions && changes.questions.currentValue) {
      this.initializeQuestionsFields();
    }
  }

  initializeQuestionsFields() {
    const controls = [];
    let index = 0;
    while (index < this.numberQuestions) {
      const value = this.questions && this.questions.length > index ? this.questions[index].title : '';
      controls.push(
        new FormControl(value, Validators.maxLength(this.maxLengthQuestion))
      );
      index += 1;
    }
    const questionsControl = this.formBuilder.array(controls);
    this.form.get('questions') ?
      this.form.setControl('questions', questionsControl) :
      this.form.addControl('questions', questionsControl);
  }

}
