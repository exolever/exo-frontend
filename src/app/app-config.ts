/* Language config */
export const LANGUAGES_CONF = {
  ALLOWED_LANGUAGES: ['en', 'es'],
  CHANGE_FORMAT_DATE_LANGUAGES: [],
  ACCOUNTS_LANGUAGES: {
    'ACCOUNTS.LANGUAGES.ENGLISH': 'en',
    'ACCOUNTS.LANGUAGES.SPANISH': 'es'
  },
  KEY_LOCALSTORAGE: 'exo-language',
  DEFAULT_LANGUAGE: 'en',
  // Used for Angular Universal flex-layout 5.0.0 integration
  // as long as we don't use Angular Universal for server side rendering, set value to false.
  SERVER_TOKEN: false
};
