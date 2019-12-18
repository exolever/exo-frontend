import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert bytes into nice formated string.
 * Takes an unit argument that defaults to MB.
 * Takes an precision argument that defaults to 2.
 *
 * Usage:
 *   bytes | fileSize: unit: precision
 * Example:
 *   {{ 1024 |  fileSize: 'MB': 2}}
 *   formats to: 1.00 MB
*/
@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  transform(
    bytes = 0, unit = 'MB',
    precision = 2): string {

    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      throw new Error(`bytes should be a valid number: '${bytes}'`);
    }

    let index = this.units.indexOf(unit);
    if (index === -1) {
      throw new Error(`unit should be one of the '${this.units}'`);
    }

    while (index > 0) {
      bytes /= 1024;
      index--;
    }
    return `${bytes.toFixed(precision)} ${unit}`;
  }
}
