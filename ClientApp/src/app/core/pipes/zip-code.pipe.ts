import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zipCode'
})
export class ZipCodePipe implements PipeTransform {

  transform(value: any): any {
    if (!value) return;

    let pattern = '#####-###';
    let i = 0;
    return pattern.replace(/#/g, _ => value[i] ? value[i++] : '');
  }
}
