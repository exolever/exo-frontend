import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'groupByDay' })
export class GroupByDay implements PipeTransform {
  /**
   * From an array of event model group by for the startDate field.
   * Return an array of GroupByItem
   */
  transform(value: Array<any>, fieldForGrouping: string): Array<any> {
    const data = value.reduce((prev, cur) => {
      const dateField = cur[fieldForGrouping];
      if (dateField) {
        const index = prev.length ? prev.length - 1 : 0;
        if (!prev.length || !prev[index][0].isSame(dateField, 'days')) {
          prev.push([dateField, [cur]]);
        } else {
          prev[index][1].push(cur);
        }
        return prev;
      }
    }, []);
    return Object.keys(data).map(key => ({ day: data[key][0], items: data[key][1] }));
  }
}
