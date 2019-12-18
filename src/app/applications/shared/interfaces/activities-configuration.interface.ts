export interface ActivityInterface {
  code: string;
  color: string;
  icon: string;
}

export const ActivitiesConfigurationArray = [
  { code: 'advising', color: '#f06292', icon: 'ring_volume' }, // pink 300
  { code: 'coaching', color: '#ba68c8', icon: 'lightbulb_outline' }, // purple 300
  { code: 'consulting', color: '#ff8a65', icon: 'assignment' }, // deep-orange 300
  { code: 'speaking', color: '#4db6ac', icon: 'mic_none' }, // teal 300
  { code: 'business_development', color: '#7986cb', icon: 'work' }, // indigo 300
  { code: 'content_generation', color: '#90a4ae', icon: 'content_paste' }, // blue-gray 300
  { code: 'investor', color: '#ffd54f', icon: 'monetization_on' }, // amber 300
  { code: 'entrepreneurship', color: '#aed581', icon: 'flight_takeoff' }, // light-green 300
  { code: 'training', color: '#9575cd', icon: 'school' }, // deep-purple 300
  { code: 'company_development', color: '#4dd0e1', icon: 'developer_board' } // cyan 300
];
