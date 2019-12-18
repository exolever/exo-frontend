import { Pipe, PipeTransform } from '@angular/core';
/*
    Case of use when we have enums in these way
    enum Example{
        'Text1': 'A',
        'Text2': 'B',
        ....
        'C': 'Text3'
    }
    <mat-option *ngFor="let feq of Example | letterKeys" [value]="feq.key">
      <div class="text-truncate"> {{ feq.value }}</div>
    </mat-option>
    --->
    <option value="A">Text1</option>
    <option value="B">Text2</option>
    <option value="C">Text3</option>
*/
@Pipe({ name: 'letterKeys' })
export class LetterKeysPipe implements PipeTransform {
  transform(value): any {
    const keys = [];
    for (const enumMember in value) {
      if (enumMember.length === 1) {
        keys.push({ key: enumMember, value: value[enumMember] });
      }
    }
    return keys;
  }
}
