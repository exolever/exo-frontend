import { TypeListEnum } from '../../shared/enums';

export class ConfigListResources {
  constructor(
    public canBeDeleted: boolean = false,
    public canBeDownloaded: boolean = false,
    public showTargetText: boolean = false,
    public showDivider: boolean = false,
    public typeElement: TypeListEnum = TypeListEnum.mdList
  ) { }

}
