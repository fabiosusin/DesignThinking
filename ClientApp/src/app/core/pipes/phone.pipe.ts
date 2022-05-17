import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return;

    let pattern = value.length <= 10 ? '(##) ####-####' : '(##) #####-####'
    let i = 0;
    return pattern.replace(/#/g, _ => value[i] ? value[i++] : '');
  }

}
