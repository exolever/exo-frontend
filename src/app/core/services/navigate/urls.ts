export abstract class Urls {
  // Auth
  static LOGIN =            'auth/login/';
  static PASSWORD_REQUEST = 'auth/password';

  // Auth social network
  static LOGIN_FACEBOOK = 'login/facebook/';
  static LOGIN_LINKEDIN = 'login/linkedin-oauth2/';
  static LOGIN_MEDIUM =   'login/medium/';
  static LOGIN_TWITTER =  'login/twitter/';

  // Service
  static BROWSER_NOT_SUPPORTED =  'browser-not-supported';

  // Profile
  static ACCOUNT_SETTINGS_WITHIN_PLATFORM_SERVICE =         '/platform/service/%s/team/%s/profile/accounts/%s/';
  static ACCOUNT_SETTINGS_WITHIN_PLATFORM_GENERIC_SERVICE = '/platform/service/exo/%s/team/%s/profile/accounts/%s/';
  static PROFILE_WITHIN_PLATFORM_SERVICE =                  '/platform/service/%s/team/%s/profile/%s/';
  static PROFILE_EDIT_WITHIN_PLATFORM_SERVICE =             '/platform/service/%s/team/%s/profile/%s/edit';
  static PROFILE_WITHIN_PLATFORM_GENERIC_SERVICE =          '/platform/service/exo/%s/team/%s/profile/%s/';
  static PROFILE_EDIT_WITHIN_PLATFORM_GENERIC_SERVICE =     '/platform/service/exo/%s/team/%s/profile/%s/edit';
  static ECOSYSTEM_PROFILE_ACCOUNT =                        '/ecosystem/profile/accounts/%s/';
  static ECOSYSTEM_PROFILE_EDIT =                           '/ecosystem/profile/%s/edit/summary';
  static ECOSYSTEM_PROFILE_VIEW =                           '/ecosystem/profile/%s/';
  static PROFILE_PUBLIC =                                   'public/profile/%s/';

  // Service in platform
  static BASE_SERVICE =           '/platform/service';
  static BASE_GENERIC_PROJECT =   '/platform/service/exo';

  static BASE_ADVISOR_REQUEST =         '/%s/team/%s/requests';
  static BASE_ADVISOR_REQUEST_DETAIL =  '/%s/team/%s/requests/%s';
  static BASE_ASK_ECOSYSTEM =           '/%s/team/%s/ask-ecosystem';
  static BASE_DELIVER =                 '/%s/team/%s/step/%s/deliver';
  static BASE_DIRECTORY =               '/%s/team/%s/members';
  static BASE_LEARN =                   '/%s/team/%s/step/%s/learn';
  static BASE_MEDIA =                   '/%s/team/%s/media';
  static BASE_REFLECT =                 '/%s/team/%s/step/%s/reflect';
  static BASE_STEP =                    '/%s/team/%s/step/%s';
  static BASE_TASK =                    '/%s/team/%s/step/%s/task/%s';
  static BASE_TEAM =                    '/%s/team/%s';
  static BASE_TEAM_TALKS =              '/%s/team/%s/team-communication';

  static ADVISOR_REQUEST =        Urls.BASE_SERVICE + Urls.BASE_ADVISOR_REQUEST;
  static ADVISOR_REQUEST_DETAIL = Urls.BASE_SERVICE + Urls.BASE_ADVISOR_REQUEST_DETAIL;
  static ASK_ECOSYSTEM =          Urls.BASE_SERVICE + Urls.BASE_ASK_ECOSYSTEM;
  static DELIVER =                Urls.BASE_SERVICE + Urls.BASE_DELIVER;
  static DIRECTORY =              Urls.BASE_SERVICE + Urls.BASE_DIRECTORY;
  static LEARN =                  Urls.BASE_SERVICE + Urls.BASE_LEARN;
  static MEDIA =                  Urls.BASE_SERVICE + Urls.BASE_MEDIA;
  static REFLECT =                Urls.BASE_SERVICE + Urls.BASE_REFLECT;
  static TASK =                   Urls.BASE_SERVICE + Urls.BASE_TASK;
  static TEAM =                   Urls.BASE_SERVICE + Urls.BASE_TEAM;
  static TEAM_TALKS =             Urls.BASE_SERVICE + Urls.BASE_TEAM_TALKS;
  static STEP =                   Urls.BASE_SERVICE + Urls.BASE_STEP;
  static STEP_GENERIC_PROJECT =   Urls.BASE_GENERIC_PROJECT + Urls.BASE_STEP;

  static GENERIC_ADVISOR_REQUEST =        Urls.BASE_GENERIC_PROJECT + Urls.BASE_ADVISOR_REQUEST;
  static GENERIC_ADVISOR_REQUEST_DETAIL = Urls.BASE_GENERIC_PROJECT + Urls.BASE_ADVISOR_REQUEST_DETAIL;
  static GENERIC_ASK_ECOSYSTEM =          Urls.BASE_GENERIC_PROJECT + Urls.BASE_ASK_ECOSYSTEM;
  static GENERIC_DELIVER =                Urls.BASE_GENERIC_PROJECT + Urls.BASE_DELIVER;
  static GENERIC_DIRECTORY =              Urls.BASE_GENERIC_PROJECT + Urls.BASE_DIRECTORY;
  static GENERIC_LEARN =                  Urls.BASE_GENERIC_PROJECT + Urls.BASE_LEARN;
  static GENERIC_MEDIA =                  Urls.BASE_GENERIC_PROJECT + Urls.BASE_MEDIA;
  static GENERIC_REFLECT =                Urls.BASE_GENERIC_PROJECT + Urls.BASE_REFLECT;
  static GENERIC_TASK =                   Urls.BASE_GENERIC_PROJECT + Urls.BASE_TASK;
  static GENERIC_TEAM =                   Urls.BASE_GENERIC_PROJECT + Urls.BASE_TEAM;
  static GENERIC_TEAM_TALKS =             Urls.BASE_GENERIC_PROJECT + Urls.BASE_TEAM_TALKS;
  static GENERIC_STEP =                   Urls.BASE_GENERIC_PROJECT + Urls.BASE_STEP;
  static GENERIC_STEP_GENERIC_PROJECT =   Urls.BASE_GENERIC_PROJECT + Urls.BASE_STEP;

  // Ecosystem in platform
  static ECOSYSTEM =                 '/ecosystem';
  static ECOSYSTEM_CIRCLES =         '/ecosystem/circles';
  static ECOSYSTEM_FEED =            'feed';
  static ECOSYSTEM_SUMAMRY =         'summary';
  static ECOSYSTEM_CIRCLES_FEED =     Urls.ECOSYSTEM_CIRCLES + '/' + Urls.ECOSYSTEM_FEED;
  static ECOSYSTEM_CIRCLES_SUMMARY =  Urls.ECOSYSTEM_CIRCLES + '/' + Urls.ECOSYSTEM_SUMAMRY;
  static ECOSYSTEM_CIRCLES_POST =    '/ecosystem/circles/%s/%s';
  static ECOSYSTEM_CIRCLES_JOIN =    '/ecosystem/circles/%s/join';
  static ECOSYSTEM_CIRCLE_DETAIL =   '/ecosystem/circles/%s';
  static ECOSYSTEM_CIRCLES_ACCESS =  '/ecosystem/circles/access';
  static ECOSYSTEM_DIRECTORY =       '/ecosystem/directory';
  static ECOSYSTEM_JOBS =            '/ecosystem/jobs';
  static ECOSYSTEM_CERTIFICATIONS =  '/ecosystem/certifications';
  static ECOSYSTEM_FIRST_LEVEL =     '/ecosystem/first-level-certification';
  static ECOSYSTEM_CERTIFICATIONS_LIST =  '/ecosystem/certifications/list';
  static ECOSYSTEM_RESOURCES =       '/ecosystem/resources';
  static ECOSYSTEM_TOOLS =            '/ecosystem/tools';
  static ECOSYSTEM_OPPORTUNITIES =   '/ecosystem/opportunities';
  static ECOSYSTEM_EVENTS_LIST =     '/ecosystem/events';
  static ECOSYSTEM_MARKETPLACE_CONDITIONS = '/ecosystem/marketplace-conditions';
  static ECOSYSTEM_EXQ_CONDITIONS = '/ecosystem/tools/exq-conditions';
  static ECOSYSTEM_MAILBOX =         '/ecosystem/mailbox';

  // Resources
  static ECOSYSTEM_MEDIA =           '/ecosystem/resources/media';
  static ECOSYSTEM_BOOKS =           '/ecosystem/resources/books';
  static ECOSYSTEM_RESOURCES_SHARED = 'https://drive.google.com/drive/folders/13T7-k5JJnyInbzxjEORk9WLsValV1s9S';
  // tslint:disable-next-line:max-line-length
  static ECOSYSTEM_RESOURCES_CALENDAR = 'https://calendar.google.com/calendar/embed?src=exolever.com_vkepq77t8ec3h00qg2o12obvg0@group.calendar.google.com&ctz=America/New_York';

  // Tools
  static ECOSYSTEM_CANVAS =          '/ecosystem/tools/canvas';
  static ECOSYSTEM_EXQ =             '/ecosystem/tools/exq';
  static ECOSYSTEM_TOOLKIT =         '/ecosystem/tools/toolkit';
  static TOOLKIT_AWAKE =             '/ecosystem/tools/toolkit/awake';
  static TOOLKIT_WORKSHOP =          '/ecosystem/tools/toolkit/workshop';
  static AWAKE_EN =                  '/ecosystem/tools/toolkit/awake/en';
  static AWAKE_ES =                  '/ecosystem/tools/toolkit/awake/es';
  static ECOSYSTEM_EXQ_LIST =        '/ecosystem/tools/exq/list';
  static ECOSYSTEM_EXQ_NEW =         '/ecosystem/tools/exq/new';
  static ECOSYSTEM_EXQ_RESULTS =     '/ecosystem/tools/exq/%s/results';

  // swarm
  static BASE_SWARM_SESSIONS_SERVICE_UNSELECTED = '/%s/team/%s/swarm-session';
  static SWARM_SESSIONS_SERVICE_UNSELECTED =      Urls.BASE_SERVICE + Urls.BASE_SWARM_SESSIONS_SERVICE_UNSELECTED;
  static SWARM_SESSIONS_SERVICE =                 Urls.BASE_SERVICE + '/%s/team/%s/swarm-session/%s/';
  // tslint:disable-next-line: max-line-length
  static GENERIC_SWARM_SESSIONS_SERVICE_UNSELECTED = Urls.BASE_GENERIC_PROJECT + Urls.BASE_SWARM_SESSIONS_SERVICE_UNSELECTED;
  static GENERIC_SWARM_SESSIONS_SERVICE =         Urls.BASE_GENERIC_PROJECT + '/%s/team/%s/swarm-session/%s/';
  static SWARM_SESSIONS_ECOSYSTEM =               '/ecosystem/jobs/swarm-session/%s/';

  // ecosystem opportunities
  static ECOSYSTEM_OPPORTUNITIES_ALL =            '/ecosystem/opportunities/all';
  static ECOSYSTEM_OPPORTUNITIES_PUBLISHED_YOU =  '/ecosystem/opportunities/admin';
  static ECOSYSTEM_OPPORTUNITIES_DETAIL =         '/ecosystem/opportunities/%s/';
  static ECOSYSTEM_OPPORTUNITY_ADMIN =            '/ecosystem/opportunities/admin/%s/';
  static ECOSYSTEM_OPPORTUNITY_ADMIN_CONVERSATIONS = '/ecosystem/opportunities/admin/%s/conversations';
  static ECOSYSTEM_OPPORTUNITY_CREATE =           '/ecosystem/opportunities/new/';
  static ECOSYSTEM_OPPORTUNITY_EDIT =             '/ecosystem/opportunities/edit/%s/';

  // WORkSPACE PROJECTS
  static ECOSYSTEM_WORKSPACE_PROJECTS =            '/ecosystem/workspace/projects';
  static ECOSYSTEM_WORKSPACE_PROJECTS_SUMMARY =    '/ecosystem/workspace/projects/%s/summary/';
  static ECOSYSTEM_WORKSPACE_PROJECTS_EDIT =       '/ecosystem/workspace/projects/%s/edit/general/';
  static ECOSYSTEM_WORKSPACE_PROJECTS_REGEXP =      '\\/ecosystem\\/workspace\\/projects\\/[0-9]+\\/edit\\/(.*)';
  // ecosystem errors
  static ECOSYSTEM_ERROR_410 =            '/ecosystem/error-410';

  // Related to ECOSYSTEM_OPPORTUNITY_ADMIN to manage opportunities in the breadcrumb service.
  static ECOSYSTEM_OPPORTUNITY_ADMIN_REGEXP =    '\\/ecosystem\\/opportunities\\/admin\\/\\d+';

  // tslint:disable-next-line:max-line-length
  static ECOSYSTEM_EVENT_PROFILE_REGEXP = '\\/ecosystem\\/projects\\/profile\\/(.+)\\/(information|attendees|speakers|website|materials)';

  // REFERRAL
  static REFERRALS = '/ecosystem/referrals';

  static NOT_FOUND = '/not-found';
}
