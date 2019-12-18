import { Post } from '@applications/forum/interfaces/post.interface';
import { KeywordModel } from '@applications/shared/models/keyword.model';
import { CertificationModel } from '@core/modules/certifications/models';

export enum TypeCircle {
  PUBLIC = 'P',
  CERTIFIED = 'C',
  OPEN = 'O',
  SECRET = 'S'
}

export enum TypeRelation {
  GUEST = 'G',
  MEMBER = 'M'
}

export enum SlugCircle {
  ALUMNI = 'alumni',
  AMBASSADORS = 'ambassadors',
  COACHES = 'coaches',
  ECOSYSTEM = 'ecosystem',
  CONSULTANTS = 'consultants',
  BOOKCOLLABORATORS = 'ext-book-collaborators',
  INVESTORS = 'investors',
  TRAINERS = 'trainers',
  ANNOUNCEMENTS = 'announcements',
  PARTICIPANTQUESTIONS = 'participant-questions'
}

export class Circle {
  name: string;
  description: string;
  slug: string;
  questions?: Post[];
  totalMembers?: number;
  image: string;
  canPost?: boolean;
  canEdit?: boolean;
  canLeave?: boolean;
  tags?: KeywordModel[];
  userStatus?: TypeRelation;
  type: TypeCircle;
  certificationRequired: CertificationModel;

  constructor(obj) {
    Object.assign(this, obj);
    this.questions = obj.questions ? obj.questions.map(question => new Post(question)) : [];
  }

  everyoneCanJoin(): boolean {
    return this.type === TypeCircle.OPEN;
  }

  needCertificationToJoin(): boolean {
    return this.type === TypeCircle.CERTIFIED;
  }

  isGuest(): boolean {
    return this.userStatus === TypeRelation.GUEST;
  }
}
