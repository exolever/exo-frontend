
export enum TypeEventEnum {
  WORKSHOP = 'W',
  TALK = 'T',
  BOOK = 'B',
  SUMMIT = 'S'
}

export interface Speaker {
  bio: string;
  linkedin: string;
  name: string;
  profilePicture: string;
  profileUrl: string;
  title: string;
}

export interface Trainer {
  email: string;
  picture: string;
  profileUrl: string;
  username: string;
}

export interface Participants {
  id: number;
  uuid: string;
  fullName?: string;
  userEmail?: string;
  userTitle?: string;
  thumbnail?: string;
  order?: number;
  role: string;
  roleName: string;
  status?: string;
}

export class Event {
  category: TypeEventEnum;
  typeEventName: string;
  eventImage?: string;
  start: Date;
  end?:  Date;
  url?: string;
  uuid?: string;
  comment?: string;
  location?: string;
  price?: string;
  name?: string;
  followType?: string;
  languages?: string[];
  country?: string;
  speakers?: Speaker[];
  trainer?: Trainer;
  link?: string;
  linkPreview?: string;
  published?: boolean;

  // new fields
  description: string;
  showPrice: boolean;
  title: string;
  participants: Participants[];
  followTypeName: string;

  constructor(data: any) {
    Object.assign(this, data);
    // this.start = data.start ? new Date(data.start) : undefined;
    // this.end = data.end ?  new Date(data.end) : undefined;
  }
}
