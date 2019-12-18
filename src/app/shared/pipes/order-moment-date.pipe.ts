import {Pipe, PipeTransform} from '@angular/core';

/**
 * Order by Moment date attributes.
 * You can send an array of items (For example opportunities[]) and a props like ['dueDate'] or ['created']
 * and will return an array sorted by this field.
 */
@Pipe({
  name: 'orderMomentDate'
})
export class OrderMomentDatePipe implements PipeTransform {
  constructor() { }

  transform(arr: any[], props: string[]): any[] {
    return [...arr].sort((a, b) =>
      props.reduce((acc, prop) => {
        if (acc === 0) {
          const [p1, p2] = [b[prop], a[prop]];
          if (!p1 || !p2) {
            return;
          }
          acc = p1.toISOString() > p2.toISOString() ? 1 : p1.toISOString() < p2.toISOString() ? -1 : 0;
        }
        return acc;
      }, 0)
    );
  }
}
