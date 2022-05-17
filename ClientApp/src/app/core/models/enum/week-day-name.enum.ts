export enum WeekDayEnum {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export class WeekDay {

  constructor() {
    this.WeekDayEnumStr = new Array(7);
    this.WeekDayEnumStr[0] = 'Domingo';
    this.WeekDayEnumStr[1] = 'Segunda-Feira';
    this.WeekDayEnumStr[2] = 'Terça-Feira';
    this.WeekDayEnumStr[3] = 'Quarta-Feira';
    this.WeekDayEnumStr[4] = 'Quinta-Feira';
    this.WeekDayEnumStr[5] = 'Sexta-Feira';
    this.WeekDayEnumStr[6] = 'Sábado';
  }

  WeekDayEnumStr: string[];
}