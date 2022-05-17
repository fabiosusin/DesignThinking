export enum MonthsEnum {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export class Months {

  constructor() {
    this.MonthsEnumStr = new Array(12)
    this.MonthsEnumStr[0] = 'Janeiro';
    this.MonthsEnumStr[1] = 'Fevereiro';
    this.MonthsEnumStr[2] = 'Março';
    this.MonthsEnumStr[3] = 'Abril';
    this.MonthsEnumStr[4] = 'Maio';
    this.MonthsEnumStr[5] = 'Junho';
    this.MonthsEnumStr[6] = 'Julho';
    this.MonthsEnumStr[7] = 'Agosto';
    this.MonthsEnumStr[8] = 'Setembro';
    this.MonthsEnumStr[9] = 'Outubro';
    this.MonthsEnumStr[10] = 'Novembro';
    this.MonthsEnumStr[11] = 'Dezembro'
  }

  MonthsEnumStr: string[]
}

