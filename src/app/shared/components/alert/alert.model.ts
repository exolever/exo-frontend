import { getValueEnum } from '../../helpers/enum.helper';

export enum typeAlertEnum {
  information,
  warning,
  error,
}

export class AlertModel {
  public icon = 'notifications_none';
  public color = 'accent';

  setTypeAlert(typeAlert: typeAlertEnum) {
    switch (getValueEnum(typeAlertEnum, typeAlert)) {
      case typeAlertEnum.information:
        this.color = 'primary';
        break;
      case typeAlertEnum.error:
        this.setCustomAlert('error', 'error');
        break;
    }
  }
  setIcon(icon: string) {
    this.icon = icon;
  }
  setColor(color: string) {
    this.color = color;
  }
  setCustomAlert(color: string, icon: string) {
        this.color = color;
        this.icon = icon;
    }
}
