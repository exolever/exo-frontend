export interface IValidationForm {
  subscriptAnimationState: string;
  isSubmitted: boolean;
  showErrors(field: string): boolean;
}
