export enum PublicMessageStatusEnum {
  InvalidEmail,
  AuthAlreadyAssociated,
  AuthCanceled,
  AuthFailed,
  SocialAuthNotLinked,
  SocialAuthNotAvailable
}


export function getPublicMessage(status: PublicMessageStatusEnum, msg: String): string {

  let message: string;
  switch (status) {
    case PublicMessageStatusEnum.InvalidEmail:
      message = 'PUBLIC.ERROR_MESSAGES.INVALID_EMAIL';
      break;
    case PublicMessageStatusEnum.AuthAlreadyAssociated:
      message = 'PUBLIC.ERROR_MESSAGES.AUTH_ALREADY_ASSOCIATED';
      break;
    case PublicMessageStatusEnum.AuthFailed:
      if (msg.indexOf('user cancelled') < 0) {
        message = 'PUBLIC.ERROR_MESSAGES.AUTH_FAILED';
      }
      break;
    case PublicMessageStatusEnum.SocialAuthNotLinked:
      message = 'PUBLIC.ERROR_MESSAGES.SOCIAL_AUTH_NOT_LINKED';
      break;
    case PublicMessageStatusEnum.SocialAuthNotAvailable:
      message = 'PUBLIC.ERROR_MESSAGES.SOCIAL_AUTH_NOT_AVAILABLE';
      break;
    default:
      message = 'PUBLIC.ERROR_MESSAGES.INVALID_EMAIL';
  }

  return message;
}
