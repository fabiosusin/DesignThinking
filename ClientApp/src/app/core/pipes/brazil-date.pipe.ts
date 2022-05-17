import { HelperService } from './../services/helper/helper.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'brazilDate'
})
export class BrazilDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) { }

  transform(value: any): any {
    if (Object.prototype.toString.call(value) === '[object Date]') {
      // it is a date
      if (isNaN(value.getTime())) {
        return null;
      }
    }

    if (HelperService.DateTimeMinValue().getFullYear() == new Date(value).getFullYear())
      return '';

    return this.datePipe.transform(value, 'dd/MM/yyyy');
  }
}
