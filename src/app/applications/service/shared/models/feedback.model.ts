export enum FeedbackType {
  Coach = 1,
  HeadCoach = 2,
  DeliveryManager = 3
}

export interface Feedback {
  comments?: string;   // Comments about my feelings/coordianator
  rate?: number;        // rating for my Coach / ExO Head Coach
  feedback?: number;    // how I felt
  target: FeedbackType;
}
