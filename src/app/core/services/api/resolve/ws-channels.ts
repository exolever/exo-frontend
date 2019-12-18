export abstract class WebsocketChannel {
  static USER =                 'user/binding/';
  static PROJECT =              'project/%s/binding/';
  static MEDIA_LIBRARY =        'library/';
  static SWARM_ADVISORS =       'online/qa-session/%s/binding/';
  static SWARM_ADVISORS_TEAM =  'online/qa-session/%s/binding/team/';
  static REFRESH_SWARM =        'updates/qa-session/%s/binding/';
  static REFRESH_SWARM_TEAM =   'updates/qa-session/%s/binding/team/';
  static OPPORTUNITIES =        'chat/opportunities/%s/';
  static CONVERSATION =         'chat/conversation/%s/';
}
