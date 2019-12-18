import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';

import { ConsultantModel } from '@applications/shared/models';

import { PROFILE_VIEW_CONFIG, ProfileViewConfig } from '../../profile-view.config';

@Component({
  selector: 'app-my-skills',
  templateUrl: './my-skills.component.html',
  styleUrls: ['./my-skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MySkillsComponent implements OnChanges {

  @Input() profileUser: ConsultantModel;
  valueLabels: Array<string> = [];

  // mobile chart data
  formattedMTP: { name: string, level: number };
  formattedInternalExoAttributes: { name: string, level: number }[];
  formattedExternalExoAttributes: { name: string, level: number }[];

  constructor(
    @Inject(PROFILE_VIEW_CONFIG) public config: ProfileViewConfig
  ) {}

  ngOnChanges() {
    this.valueLabels = this.getChartValueLabels();
    this.formattedMTP = this.getFormattedMTP();
    this.formattedInternalExoAttributes = this.getFormattedInternalAttributes();
    this.formattedExternalExoAttributes = this.getFormattedExternalAttributes();
  }

  /**
   * gets the chart labels to display in a circular layout around the svg chart
   * @returns {Array<string>}
   */
  getChartValueLabels(): Array<string> {
    const valueLabels: Array<string> = [];
    valueLabels.push('MTP design');
    valueLabels.push(
      ...this.profileUser.getExternalEXOAttributes().map(attr => attr.name),
      ...this.profileUser.getInternalEXOAttributes().map(attr => attr.name)
    );
    return valueLabels;
  }

  /**
   * determines weather the user has set up his own ExoAttributes so we have the data available to display
   * the chart. This is used to display the empty moment in case the user can edit profile and hasn't set
   * the ExoAttributes
   * @returns {boolean}
   */
  hasExoAttributesSetup(): boolean {
    return ( this.profileUser.getExternalEXOAttributes().length +
             this.profileUser.getInternalEXOAttributes().length ) > 0;
  }

  /**
   * gets the formatted mtp of the user to display in the view
   * @returns {{name: string,  value: number}}
   */
  getFormattedMTP(): { name: string,  level: number } {
    return { name: 'MTP Design', level: this.profileUser.valueMTP || 0 };
  }

  /**
   * gets the formatted internal attributes of the user to display in the view
   * @returns {{name: string,  value: number}}
   */
  getFormattedInternalAttributes(): { name: string,  level: number }[] {
    return this.profileUser.getInternalEXOAttributes().length ?
      this.profileUser.getInternalEXOAttributes().map(pos => ({ name: pos.name, level: pos.level })) :
      [];
  }

  /**
   * gets the formatted external attributes of the user to display in the view
   * @returns {{name: string,  value: number}}
   */
  getFormattedExternalAttributes(): { name: string,  level: number }[] {
    return this.profileUser.getExternalEXOAttributes().length ?
      this.profileUser.getExternalEXOAttributes().map(pos => ({ name: pos.name, level: pos.level })) :
      [];
  }

}
