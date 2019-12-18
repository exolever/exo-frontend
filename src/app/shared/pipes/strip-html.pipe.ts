import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'striphtml'
})

export class StripHtmlPipe implements PipeTransform {
  transform(value: any): any {
    if ((value === null) || (value === '')) {
        return '';
    } else {
        return value.replace(/<\/?[^>]+(>|$)/g, '');
    }
  }
}
