/*
 * Returns an array joined by the specified character, by default comma separated.
 * You can join the last position with the default connector of the app language by setting a parameter "last"
 * to false
 */
import { Pipe, PipeTransform  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  constructor(private translateSv: TranslateService) {}

  transform ( input: any, character: string = ', ', last: boolean = false ): any {
    /** init an empty string, this value will be returned in case the input format is not an array */
    let result: string;
    const connectorWithSpacing = ' ' + this.translateSv.instant('COMMON.CONNECTOR') + ' ';

    if (Array.isArray( input )) {
      /** if last is active and array has items */
      if (last && input.length) {
        result = input.length === 1 ?
          input.join(connectorWithSpacing) :
          input.slice(0, input.length - 1).join(character) + connectorWithSpacing + input[input.length - 1];
      } else {
        result = input.join( character );
      }
    }
    return result ? result : input;
  }
}
