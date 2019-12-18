export enum QuizStatus {
  ToDo = <any>'T',
  InProgress = <any>'P',
  Done = <any>'D'
}

export interface ITeamRank {
  pkTeam: string;
  nameTeam: string;
  ratings: number[];
  avg: number;
}

export class TeamRating {
  static readonly NOT_FILLED = -1;
  pkTeam: string;
  nameTeam: string;
  ratings: Array<number>;
  avg: number;

  constructor(data: ITeamRank) {
    Object.assign(this, data);
  }

  average(): number {
    return Math.round(this.avg * 10);
  }

}

interface IQuiz {
  url: string;
  status?: QuizStatus;
  personalRating?: number;
  teamRatings: Array<TeamRating>;
}

export class Quiz {
  url: string;
  status: QuizStatus;
  personalRating: number;
  teamRatings: Array<TeamRating>;
  constructor(data: IQuiz) {
    Object.assign(this, data);
    this.status = this.status || QuizStatus.ToDo;
    if (this.personalRating === TeamRating.NOT_FILLED) {
      this.status = QuizStatus.ToDo;
      this.personalRating = 0;
    } else {
      this.status = QuizStatus.Done;
    }

    if (this.teamRatings) {
      this.teamRatings = this.teamRatings.map(item => new TeamRating(item));
    }
  }
}
