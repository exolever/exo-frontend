import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TeamRating } from '@applications/service/shared/models/quiz.model';

@Component({
  selector: 'app-team-rank',
  templateUrl: './team-rank.component.html',
  styleUrls: ['./team-rank.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamRankComponent implements OnInit {
  @Input() teamRating: TeamRating;

  constructor() { }

  ngOnInit() {
    this.teamRating.ratings = this.teamRating.ratings.sort((x, y) => y - x);
  }

}
