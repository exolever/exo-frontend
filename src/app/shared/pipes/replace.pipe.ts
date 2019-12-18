import { Pipe, PipeTransform  } from '@angular/core';

@Pipe({
  name: 'replace'
})
/**
 * Replace the value of regex for an string.
 *
 * For example: 'SOLUTION_ACCELERATOR' | replace:'_':''; will return SOLUTION ACCELERATOR.
 */
export class ReplacePipe implements PipeTransform {
  transform( input: string, regex: any, replace: string ): any {
    return !input || input.length === 0 ? '' : input.replace(new RegExp(regex, 'gi'), replace);
  }
}
