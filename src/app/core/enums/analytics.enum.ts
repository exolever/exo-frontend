

export enum Category {
  ONBOARDING = 'Onboarding',
  FOUNDATIONS = 'Foundations'
}

export enum Event {
  UPDATED = 'Updated',
  SIGNUP = 'SignUp',
  STARTED = 'Started'
}

export enum EventParams {
  SIGNUP_COMPLETED = 'signupCompleted',
  TOS_ACCEPTED = 'tosAccepted',
  TOS_DENIED = 'tosDenied',
  WELCOME_READ = 'welcomeRead',
  BASIC_INFO_FILLED = 'basicInfoFilled',
  ONBOARDING_COMPLETED = 'onboardingCompleted',
  SPANISH = 'spanish',
  ENGLISH = 'english',
  ONBOARDING = 'onboarding',
  CERTIFICATIONS = 'certifications',
  INTERCOM = 'intercom',
  MARKETPLACE = 'marketplace',
  CIRCLES = 'circles'
}

/**
 * DEPRECATED
 *
 * This enumerates were used to send events to Google Analitys. From segment integration, they
 * are deprecated.
 */

/*
export enum CategoryGA {
  Circles =                 'Circles',
  Opportunities =           'Opportunities',
  Landing =                 'Landing',
  Funnel =                  'Funnel',
  Projects =                'WS - Projects'
}

export enum ActionGA {
  OpenForm =                'Open new form',

  SeeFeed =                 'Click on feed tab',
  SeeSummary =              'Click on summary tab',

  CreateFromShortcut =      'Create post by shortcut',
  CreateFromList =          'Create post from post list',

  JoinFromCircle =          'Join to circle from post list',

  DetailsFromSummary =      'Go to post details from summary',
  DetailsFromFeed =         'Go to post details from feed',
  DetailsFromList =         'Go to post details from list',

  EditionFromSummary =      'Go to edition from summary',
  EditionFromFeed =         'Go to edition from feed',
  EditionFromList =         'Go to edition from list',

  DeletionFromSummary =     'Delete from summary',
  DeletionFromFeed =        'Delete from feed',
  DeletionFromList =        'Delete from list',

  DownloadBook =            'Download Book summary',
  DownloadCanvas =          'Download Canvas',

  Login =                   'Login',
  Onboarding =              'Onboarding',
  Signup =                  'Signup',
  Certification =           'Certification',
  Customer =                'Customer',

  CreateProject =           'Create Project'
}

export enum LabelGA {
  login =                   'login',
  password_set =            'password_set',
  agreement_accepted =      'agreement_accepted',
  agreement_rejected =      'agreement_rejected',
  welcome_onboarding_read = 'welcome_onboarding_read',
  signup =                  'signup',
  application =             'application_',
  certification_paid =      'certification_paid_',
  create_project =          'create_project',
  delete_project =          'delete_project',
  edit_project =            'edit_project'
}
*/
