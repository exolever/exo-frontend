import { TypeElementArea } from '../../shared/enums';

export class ConfigAddResources {
  public title = '';
  public availableProgressBar = true;
  constructor(
    public typeElement: TypeElementArea = TypeElementArea.dragAndDrop
  ) { }
  addTitle(msg: string): void {
    this.title = msg;
  }
  showProgressBar(isAvailable: boolean): void {
    this.availableProgressBar = isAvailable;
  }
}
