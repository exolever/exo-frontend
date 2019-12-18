export const Feelings = [
  {icon: 'mood_bad', value: 1, class: 'mood-bad'},
  {icon: 'sentiment_very_dissatisfied', value: 2, class: 'sentiment-very-dissatisfied'},
  {icon: 'sentiment_dissatisfied', value: 3, class: 'sentiment-dissatisfied'},
  {icon: 'sentiment_satisfied_alt', value: 4, class: 'sentiment-satisfied-alt'},
  {icon: 'sentiment_very_satisfied', value: 5, class: 'sentiment-very-satisfied'}
];

export enum FeedbackFrom {
  Coach = 1,
  Team = 2
}


export interface ReceivedFeedback {
  averageFeelings?: number;
  averageRate?: number;
  origin: FeedbackFrom;
  results: Feedback[];
  target?: string;
  totalComments?: number;
  totalReviewers?: number;
}

export interface Feedback {
  comment: Comment;
  feeling?: number;
  fullName?: string;
  rate?: number;
  thumbnail?: string;
}

export interface Comment {
  date: Date;
  text: string;
}
