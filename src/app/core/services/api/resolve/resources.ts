export abstract class ApiResources {
  // ASK ECOSYSTEM
  static A2E_QUESTION_LIST =   'forum/project/%s/team/%s/questions/';

  // SWARM Sessions
  static SWARM_SERVICE_SESSION_LIST            = 'swarms/project/%s/team/%s/swarms/';
  static SWARM_SERVICE_SESSION_ADVISORS        = 'swarms/project/%s/team/%s/swarms/%s/advisors/';
  static SWARM_SERVICE_QUESTION_LIST           = 'swarms/project/%s/team/%s/swarms/%s/questions/';
  static SWARM_SERVICE_QUESTION_DETAIL         = 'swarms/project/%s/team/%s/swarms/%s/questions/%s/';
  static SWARM_SERVICE_ANSWER_LIST             = 'swarms/project/%s/team/%s/swarms/%s/questions/%s/answers/';
  static SWARM_SERVICE_MENTIONS_QUESTION       = 'swarms/project/%s/team/%s/swarms/%s/questions/%s/mentions/';
  static SWARM_ECOSYSTEM_SESSION               = 'swarms/ecosystem/%s/';
  static SWARM_ECOSYSTEM_SESSION_QUESTIONS     = 'swarms/ecosystem/%s/questions/';
  static SWARM_ECOSYSTEM_SESSION_QUESTION      = 'swarms/ecosystem/%s/questions/%s/';
  static SWARM_ECOSYSTEM_SESSION_ANSWERS       = 'swarms/ecosystem/%s/questions/%s/answers/';
  static SWARM_ECOSYSTEM_MENTIONS_QUESTION     = 'swarms/ecosystem/%s/questions/%s/mentions/';

  // Circles
  static CIRCLE_LIST =        'circles/';
  static CIRCLE_DETAILS =     'circles/%s/';
  static CIRCLE_JOIN =        'circles/%s/join/';
  static CIRCLE_LEAVE =       'circles/%s/leave/';
  static CIRCLE_FOLLOWERS =   'circles/%s/followers/';
  static CIRCLE_FEED =        'forum/feed/';
  static CIRCLE_POSTS =       'forum/circles/%s/posts/';
  static CIRCLE_POST_CREATE = 'circles/%s/create/';
  static CIRCLE_POST_DETAIL = 'forum/post-slug/%s/';
  static CIRCLE_LEGACY_INFO = 'forum/post-slug/%s/legacy-details/';

  // Common urls for circles, swarm sessions and ask-to-ecosystem
  static FORUM_ANSWER_LIST =     'forum/post/%s/answers/';
  static FORUM_ANSWER_DETAILS =  'forum/answer/%s/';
  static FORUM_ANSWER_UNLIKE =   'forum/answer/%s/unlike/';
  static FORUM_ANSWER_LIKE =     'forum/answer/%s/like/';
  static FORUM_ANSWER_RATE =     'forum/answer/%s/rating/';
  static FORUM_ANSWER_CREATE =   'forum/post/%s/reply/';
  static FORUM_QUESTION_EDIT =   'forum/post/%s/';
  static FORUM_QUESTION_LIKE =   'forum/post/%s/like/';
  static FORUM_QUESTION_UNLIKE = 'forum/post/%s/unlike/';

  // Skill Assessment
  static LANGUAGES = 'core/languages/';
  static INDUSTRIES_LIST = 'industries/list/';

  // Roles
  static ROLES = 'exo-role/categories/';

  // Certifications
  static CERTIFICATIONS = 'exo-role/certifications/';

  // User
  static GO_TO =                     'accounts/go-to/';
  static ABOUT_ME =                  'accounts/me/';
  static ENDPOINT_PASSWORD_REQUEST = 'accounts/password/request-change/';
  static ENDPOINT_PASSWORD_CHANGE =  'accounts/password/change/';
  static USER_NOTIFICATIONS =        'account-config/config_param/%s/';
  static USER_NOTIFICATION_UPDATE =  'account-config/config_param/%s/update/%s/';
  static RESEND_VERIFICATION_EMAIL = 'accounts/resend-email/';
  static DISCARD_PENDING_EMAIL =     'accounts/discard-email/';
  static CHECK_EMAIL =               'accounts/check-email/';
  static CONSULTANT_AUTOCOMPLETE =   'consultant/consultant-autocomplete/';
  static CERTIFIED_CONSULTANTS =     'consultant/consultant-autocomplete/total-users/';
  static CONNECTED_USERS =           'api/subscriptors/%s/';

  // Auth
  static LOGIN = 'accounts/login/';
  static LOGOUT = 'accounts/logout/';
  static SIGNUP = 'accounts/signup/%s/';
  static DISCONNECT = 'accounts/disconnect/%s/';
  static DISCONNECT_LINKEDIN = 'accounts/disconnect/linkedin-oauth2/';
  static ACTIVITY_LIST = 'exo-activity/list/';


  // Api Graphql
  static GRAPHQL = 'graphql-jwt/';
  static PUBLIC_GRAPHQL = 'public-graphql/';
  // files
  static USER_RESOURCE_UPLOAD = 'files/user-resource-upload/';
  static USER_RESOURCE_REMOVE = 'files/resources/resources/%s/tag-remove/';
  static USER_RESOURCE_UNDO = 'files/resources/resources/%s/tag-add/';

  // Tickets
  static KEYWORD_LIST = 'keywords/autocomplete/';

  // Actions in persistent messages.
  static CLOSE_PERSISTENT_MESSAGE = 'internal-messages/messages/%s/close/';
  static PERSISTENT_MESSAGES_LIST = 'internal-messages/messages/';

  // Invitations
  static BOARDING_INVITATION =  'invitation/boarding/%s/';
  static ACCEPT_INVITATION =  'invitation/invitation/%s/accept/';
  static DECLINE_INVITATION = 'invitation/invitation/%s/decline/';

  // User Profile
  static PLATFORM_PROFILE_VIEW =            'profile-public/%s/';
  static PROFILE_EDIT_IMAGE_USER_PROFILE =  'profile/%s/update-image-profile/';
  static PROFILE_EDIT_INDUSTRIES =          'profile/%s/update-profile-industries/';
  static PROFILE_EDIT_VIDEO_USER_PROFILE =  'profile/%s/update-profile-video/';
  static PROFILE_EDIT_MTP =                 'profile/%s/update-profile-mtp/';
  static PROFILE_EDIT_ATTRIBUTES_USER =     'profile/%s/update-profile-exo-attributes/';
  static PROFILE_EDIT_ACTIVITIES_USER =     'profile/%s/update-profile-activities/';
  static PROFILE_EDIT_KEYWORDS =            'profile/%s/update-profile-keywords/';
  static PROFILE_EDIT_AREAS_USER =          'profile/%s/update-profile-core-pillars/';
  static PROFILE_EDIT_ECOSYSTEM_SUMMARY =   'profile/%s/summary/';
  static PROFILE_EDIT_ECOSYSTEM_ABOUT_YOU = 'profile/%s/about-you/';
  static PROFILE_CHANGE_PASSWORD =          'profile/%s/change-password/';
  static PROFILE_CHANGE_EMAIL =             'profile/%s/update-email/';
  static PROFILE_CHANGE_LANGUAGE =          'profile/%s/platform-language/';
  static PROFILE_CHANGE_CONTRACTING =       'profile/%s/update-contracting-data/';
  static PROFILE_START_CONVERSATION =       'profile/%s/start-conversation/';
  // Directory
  static ECOSYSTEM_MEMBERS = 'ecosystem/members/';
  static ECOSYSTEM_FILTER = 'ecosystem/filters/';

  // Media Library: Use only with resolveMediaLibrary
  static MEDIA_LIBRARY_SEARCH = 'api/resources/library/';
  static MEDIA_LIBRARY_PROJECT = 'api/resources/library-project/';
  static MEDIA_LIBRARY_TAGS = 'api/resources/tag/';
  static MEDIA_LIBRARY_UPLOAD = 'api/resources/library/';
  static MEDIA_LIBRARY_UPDATE = 'api/resources/library/%s/';
  static MEDIA_LIBRARY_DELETE = 'api/resources/library/%s/';
  static MEDIA_VALIDATE_URL = 'api/resources/validate-url/';

  // Automated sprint
  static SERVICE_STEPS =            'project/%s/team/%s/step/';
  static SERVICE_STEP =             'project/%s/team/%s/step/%s/';
  static SERVICE_TASK_AS_DONE =     'project/%s/team/%s/step/%s/tasks-done/';
  static SERVICE_TASK_AS_TODO =     'project/%s/team/%s/step/%s/tasks-undone/';
  static SERVICE_PROVIDE_FEEDBACK = 'project/%s/team/%s/step/%s/feedback/';
  static SERVICE_DOWNLOAD_REPORT =  'project/%s/team/%s/step/%s/download-report/';
  static SERVICE_UPLOAD_DELIVERABLE_STEP =  'files-versioned/upload-file/assignmentstepteam/%s/';
  static SERVICE_DELETE_DELIVERABLE_STEP =  'files-versioned/upload-file/assignmentstepteam/%s/%s/';
  static CHANGE_VISIBILITY_DELIVERABLE_STEP =   'files-versioned/%s/visibility-toggle/';

  // Generic project
  static GET_GENERIC_PROJECT =              'projects/api/view-project/%s/';
  static GET_GENERIC_PROJECT_MEMBERS =      'projects/api/view-project/%s/users/';
  static GENERIC_PROJECT_STEPS =            'projects/api/view-project/%s/steps/%s/';
  static GENERIC_PROJECT_STEP =             'projects/api/view-project/%s/steps/%s/%s/'; // .../steps/<teamPk>/<stepPk>/
  static GENERIC_PROJECT_TEAMS =            'projects/api/view-project/%s/teams/';
  static GENERIC_PROJECT_TASK_AS_TODO =     'projects/api/view-project/%s/steps/%s/%s/tasks-undone/';
  static GENERIC_PROJECT_TASK_AS_DONE =     'projects/api/view-project/%s/steps/%s/%s/tasks-done/';
  static GENERIC_PROJECT_PROVIDE_FEEDBACK = 'projects/api/view-project/%s/steps/%s/%s/feedback/';
  static GENERIC_PROJECT_DOWNLOAD_REPORT =  'projects/api/view-project/%s/team/%s/step/%s/download-report/';
  static GENERIC_PROJECT_UPLOAD_DELIVERABLE_STEP = 'projects/api/files-versioned/upload-file/assignmentstepteam/%s/';
  static GENERIC_PROJECT_DELETE_DELIVERABLE_STEP = 'projects/api/files-versioned/upload-file/assignmentstepteam/%s/%s/';
  static GENERIC_PROJECT_CHANGE_VISIBILITY_DELIVERABLE_STEP =  'projects/api/files-versioned/%s/visibility-toggle/';

  // Advisory Call
  static GET_ADVISORY_CALL_SETTINGS_PROJECT =    'opportunities/api/groups/%s/';
  static GET_ADVISORY_CALLS =    'opportunities/api/opportunity-group/%s/';


  // Opportunities - Ticket detail
  static OPPORTUNITIES_LIST =           'opportunities/api/opportunity/';
  static OPPORTUNITY_DETAIL =           'opportunities/api/opportunity/%s/';
  static OPPORTUNITY_DETAIL_ADMIN =     'opportunities/api/opportunity/%s/admin/';
  static APPLY_OPPORTUNITY =            'opportunities/api/opportunity/%s/apply/';
  static CREATE_OPPORTUNITY =           'opportunities/api/opportunity/';
  static PREVIEW_OPPORTUNITY =          'opportunities/api/opportunity/preview/';
  static CLOSE_OPPORTUNITY =            'opportunities/api/opportunity/%s/close/';
  static REOPEN_OPPORTUNITY =           'opportunities/api/opportunity/%s/re-open/';
  static ASSIGN_APPLICANT =             'opportunities/api/applicant/%s/assign/';
  static REJECT_APPLICANT =             'opportunities/api/applicant/%s/reject/';
  static FEEDBACK_APPLICANT =           'opportunities/api/applicant/%s/give_feedback/';
  static OPP_CREATE_CONVERSATION =      'opportunities/api/opportunity/%s/create_conversation/';
  static GET_DATA_INITIALIZE_SOW =      'opportunities/api/applicant/%s/init-sow/';
  static GET_DATA_SOW =                 'opportunities/api/applicant/%s/detail-sow/';
  static GET_ROLES =                    'opportunities/api/roles/';

  // Events
  static EVENTS = 'event/';
  static EVENTS_PERMISSIONS = 'event/permissions/';
  static EVENTS_GET_TYPES = 'event/events_types/';
  static EVENT_CHANGE_STATUS = 'event/%s/change_status/';
  static EVENT_BY_UUID = 'event/%s/';
  static EVENT_BY_UUID_REVIEW = 'event/manage/%s/';
  static EVENT_PARTICIPANTS = 'event/participants/%s/';
  static EVENT_PARTICIPANTS_DELETE = 'event/participants/%s/%s/';
  static EVENT_ATTENDEE_CERTIFICATE =  'event/participants/%s/%s/generate-certificate/';
  static EVENT_ATTENDEES_CERTIFICATE = 'event/%s/send-certificates/';
  static EVENT_ATTENDEES_FILE_UPLOAD = 'event/participants/%s/upload/';
  static EVENT_REVIEW_PUBLISH = 'event/manage/%s/publish/';
  static EVENT_REVIEW_REJECT = 'event/manage/%s/reject/';
  static EVENT_REQUEST_SUMMIT = 'event/request_summit/';


  // ExQ
  static EXQ_LIST = 'survey/';
  static EXQ_DETAIL = 'survey/%s/';
  static EXQ_RESULTS = 'survey-filled/';
  static EXQ_DELETE_RESULTS = 'survey-filled/%s/';
  static EXQ_DOWNLOAD_CSV = 'survey/%s/download-csv/';
  static EXQ_DOWNLOAD_PDF = 'survey-filled/%s/pdf/';

  // ExQ Agreements
  static GET_EXQ_AGREEMENT =    'agreement/exq/';
  static ACCEPT_EXQ_AGREEMENT =    'agreement/exq/%s/accept/';

  // My Jobs
  static MY_JOBS = 'api/';

  // Consent use image
  static SEND_CONSENT = 'consultant/consent/';

  // Agreements
  static GET_MARKETPLACE_AGREEMENT =    'marketplace/agreement/';
  static ACCEPT_MARKETPLACE_AGREEMENT =    'marketplace/agreement/%s/accept/';

  // Conversations
  static CONVERSATION_LIST = '%s/conversations/';
  static CONVERSATION_MESSAGES_LIST = '%s/conversations/%s/messages/';
  static CONVERSATION_REPLY = '%s/conversations/%s/reply/';
  static CONVERSATION_UNREAD = '%s/conversations/total-unread/';
  static CONVERSATION_MARK_AS_READ = '%s/conversations/%s/mark-as-read/';
  static CONVERSATION_MAILBOX = 'conversations/';
  static CONVERSATION_MAILBOX_LIST = 'conversations/%s/messages/';
  static CONVERSATION_MAILBOX_REPLY = 'conversations/%s/reply/';
  static CONVERSATION_MAILBOX_MARK_AS_READ = 'conversations/%s/mark-as-read/';

  // Certifications
  static GET_FIRST_LEVEL_CERTIFICATION_EN = 'project/join-level-1/en/';
  static GET_FIRST_LEVEL_CERTIFICATION_ES = 'project/join-level-1/es/';
  static GET_SECOND_LEVEL_CERTIFICATION = 'project/join-level-2/';
  static GET_THIRD_LEVEL_CERTIFICATION = 'project/join-level-3/';
  static COHORTS_GET = 'exo-certification/cohort/';

  // Early Parrot
  static GET_CAMPAIGNS = 'referral/campaigns/';
  static SUBSCRIBE_CAMPAIGNS = 'referral/campaigns/%s/subscribe/';

  // Projects
  static PROJECTS_LIST =                'projects/api/project/';
  static PROJECT_DETAIL =               'projects/api/project/%s/';
  static PROJECT_SETTINGS =             'projects/api/project/%s/settings/';
  static PROJECT_ADVISORY_CALL_SETTINGS =   'projects/api/project/%s/advisor-request-settings/';
  static PROJECT_STEPS =                'projects/api/project/%s/steps/';
  static PROJECT_STEP_DETAIL =          'projects/api/project/%s/steps/%s/';
  static PROJECT_TEAMS =                'projects/api/project/%s/teams/';
  static PROJECT_TEAM_DETAIL =          'projects/api/project/%s/teams/%s/';
  static PROJECT_TEAM_CREATE =          'projects/api/project/%s/teams/';
  static PROJECT_TEAM_UNSELECT =        'projects/api/project/%s/teams/%s/user/%s/';
  static PROJECT_TEAM_MOVE =            'projects/api/project/%s/teams/%s/move-user/%s/';
  static PROJECT_MEMBERS =              'projects/api/project/%s/users/';
  static PROJECT_PUBLISH =              'projects/api/project/%s/launch/';
  static PROJECT_TEAM_SELECT_PEOPLE =   'projects/api/project/%s/teams/%s/assign-users/';
  static PROJECT_MEMBER_DETAIL =        'projects/api/project/%s/users/%s/';
  static PROJECT_CREATE_COLLABORATOR =  'projects/api/project/%s/exo-collaborators/';
  static PROJECT_EDIT_COLLABORATOR =    'projects/api/project/%s/users/%s/edit-exo-collaborator/';
  static PROJECT_CREATE_PARTICIPANT =   'projects/api/project/%s/participants/';
  static PROJECT_EDIT_PARTICIPANT =     'projects/api/project/%s/users/%s/edit-participant/';
  static PROJECT_EDIT_PARTICIPANT_TEAMS =       'projects/api/project/%s/users/%s/edit-participant-teams/';
  static PROJECT_UPLOAD_PARTICIPANTS_BULK =     'projects/api/project/%s/participants/upload-user/';
  static PROJECT_PARSE_UPLOAD_BULK_PARTICIPANTS =     'projects/api/project/%s/participants/parse-upload-user/';
  static PROJECT_UNASSIGNED_USERS =     'projects/api/project/%s/users/no-team/';
}
