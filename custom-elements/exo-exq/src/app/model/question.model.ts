export interface Step {
  section: string;
  questions: Question[];
}

export interface Question {
  name: string;
  options: Answers[];
  section: string;
  pk: number;
}

export interface Answers {
  pk: number;
  value: string;
}

export interface Industry {
  pk: number;
  name: string;
}
