import { nameFeedbackImageEnum } from './feedback-images.enum';

/* Don't export (either use) this constantes to other files */
const DEFAULT_TITLE_OK = 'Action done';
const DEFAULT_SUBTITLE_OK = 'Thank you for your collaboration!';
const DEFAULT_TITLE_KO = 'Sorry, your action has failed';
const DEFAULT_SUBTITLE_KO = 'Try again later or contact support@openexo.com';
const DEFAULT_BUTTON_TEXT = 'GO TO OpenExO';

export class FeedbackFormBehaviour {
  public showFeedbackMessage = false;
  public imageFeedback: nameFeedbackImageEnum;
  public titleFeedbackMessage: string;
  public subtitleFeedbackMessage: string;
  public body: string;
  public buttonText: string;

  // in this case if we need take callBack, you need to use into tag a class onClick
  createSuccessFeedbackMessage(
    title?: string, subtitle?: string, button?: string, body?: string, imageFeedback?: nameFeedbackImageEnum
  ) {
    this.imageFeedback = imageFeedback || nameFeedbackImageEnum.success;
    this.titleFeedbackMessage = title || DEFAULT_TITLE_OK;
    this.subtitleFeedbackMessage = subtitle || DEFAULT_SUBTITLE_OK;
    this.body = body;
    this.buttonText = button || DEFAULT_BUTTON_TEXT;
    this.showFeedbackMessage = true;
  }

  createWrongFeedbackMessage(title?: string, subtitle?: string, button?: string) {
    this.imageFeedback = nameFeedbackImageEnum.error;
    this.titleFeedbackMessage = title || DEFAULT_TITLE_KO;
    this.subtitleFeedbackMessage = subtitle || DEFAULT_SUBTITLE_KO;
    this.buttonText = button || DEFAULT_BUTTON_TEXT;
    this.showFeedbackMessage = true;
  }
}
