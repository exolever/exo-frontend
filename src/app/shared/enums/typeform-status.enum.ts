// To control if the webhook is received before the callback to manage the loader.
export const enum TypeformStatus {
  INITIAL,
  DEFAULT,
  SENT,
  RECEIVE
}

export const enum typeformRecommend {
  PR_NAME = 'project_name',
  TCK_TITLE = 'ticket_title',
  FULLNAME = 'full_name',
  EMAIL = 'mail'
}
