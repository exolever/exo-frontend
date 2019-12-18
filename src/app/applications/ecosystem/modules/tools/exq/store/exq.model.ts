import * as MomentTZ from 'moment-timezone';
import { SectionExqEnum } from '../exq.enum';

export interface SurveyResultsInterface {
  answers: {section: SectionExqEnum, name: string, value: string}[];
  email: string;
  industryName: number;
  name: string;
  organization: string;
  pk: number;
  results: {section: SectionExqEnum, score: number, maxScore: number}[];
  total: number;
}

export interface Results {
  searchTerms: string;
  pageSize: number;
  page: number;
  totalResults: number;
}
export const ResultsInitialState = {
  searchTerms: '',
  pageSize: 10,
  page: 1,
  totalResults: undefined
};

export class Survey {
  pk: number;
  created: MomentTZ.Moment;
  name: string;
  language: string;
  publicUrl: string;
  slug: string;
  totalAnswers: number;
  results: SurveyResultsInterface[] = [];

  constructor(data: any) {
    Object.assign(this, data);
  }
}
