import { Injectable } from '@angular/core';
import { Months } from '../../models/enum/month-name.enum';
import { WeekDay } from '../../models/enum/week-day-name.enum';
import { CompleteDateOutput } from '../../models/output/complete-date-output';
import { DateDifferenceOutput } from '../../models/output/date-difference-output';
import { DocumentData } from '../../models/output/document-data-output';
import { GetFileOutput } from '../../models/output/get-file-output';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DocumentTypeEnum } from '../../models/enum/document-type-enum';

@Injectable({ providedIn: 'root' })
export class HelperService {
  static CountryPrefix = '55';
  static removeSpecialCharsRegex = /(\.|\/|\-|\(|\)|\ )/g;
  static emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static cnpjRegex = /(^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}&)|^\d{14}$/;
  static cpfRegex = /(^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}&)|^\d{11}$/;
  static phoneRegex = /^\d{11}$/;
  static knownsCnpjRegex = /(\d+)(\1{13})/;
  static knownsCpfRegex = /(\d+)(\1{10})/;
  static knownsCnaesRegex = /(0)(\1{6})/;

  constructor() { }

  static removeSpecialChars = (value: string) => (value || '').toString().replace(HelperService.removeSpecialCharsRegex, '');
  static isEmailValid = (email: string) => !!HelperService.emailRegex.exec(email);
  static isPhoneValid = (phone: string) => !!HelperService.phoneRegex.exec(phone);

  static setShowLetter(arr: any[], prop: string): void {
    let lastLetter = '';

    for (const data of arr) {
      const name = data[prop];

      const result = lastLetter.toLowerCase() !== (name || ' ').substring(0, 1).toLowerCase();

      if (result) {
        data.mustShowLetter = result;
        lastLetter = (name || ' ').substring(0, 1);
      }
    }
  }

  static isValidCpfCnpj(value?: string): boolean {
    if (!value)
      return false;

    value = HelperService.removeSpecialChars(value);
    if (value.length == 11) {
      return HelperService.isCpfValid(value);
    } else if (value.length == 14) {
      return HelperService.isCnpjValid(value);
    }

    return false
  }

  static isCpfValid(cpf: string): boolean {
    if (!HelperService.cpfRegex.test(cpf) || HelperService.knownsCpfRegex.test(cpf))
      return false;

    let soma = 0;
    for (let i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

    let resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11)
      resto = 0;

    if (resto != parseInt(cpf.substring(9, 10)))
      return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto == 10 || resto == 11)
      resto = 0;

    return resto == parseInt(cpf.substring(10, 11));
  }

  static isCnpjValid(cnpj: string): boolean {
    if (!HelperService.cnpjRegex.test(cnpj) || HelperService.knownsCnpjRegex.test(cnpj))
      return false;

    // Valida DVs
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let soma = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      soma += +numbers.charAt(size - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != +digits.charAt(0))
      return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    soma = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      soma += +numbers.charAt(size - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado == +digits.charAt(1);
  }

  static isCnaeValid = (cnae: string): boolean => !HelperService.knownsCnaesRegex.test(cnae);

  static isCreditCardExpirationValid = (month?: string, year?: string): boolean => {
    if (month?.length != 2 || year?.length != 4)
      return false;

    const monthNumber = +month;
    return !(monthNumber <= 0 || monthNumber > 12)
  }

  static toCpfCnpjMask(value: string): string | null {
    if (!value)
      return null;

    const pattern = value.length <= 11 ? '###.###.###-##' : '##.###.###/####-##';
    let i = 0;
    return pattern.replace(/#/g, _ => (value[i] ? value[i++] : ''));
  }

  static toPhoneMask(value: string): string | null {
    if (!value)
      return null;

    const pattern = value.length <= 10 ? '(##) ####-####' : '(##) #####-####';
    let i = 0;
    return pattern.replace(/#/g, _ => (value[i] ? value[i++] : ''));
  }

  static toZipCodeMask(value: string): string | null {
    if (!value)
      return null;

    const pattern = '#####-###';
    let i = 0;
    return pattern.replace(/#/g, _ => (value[i] ? value[i++] : ''));
  }

  static toNumber = (formattedNumber: string): number =>
    formattedNumber
      ? parseFloat(
        formattedNumber
          .toString()
          .replace(HelperService.removeSpecialCharsRegex, '')
          .replace(',', '.')
      )
      : 0

  static toDecimal(value: number, digits?: number): number {
    const pow: number = Math.pow(10, digits || 2);
    return Math.round(value * pow) / pow;
  }

  static groupBy = (arr: any[], key: string, attr?: string): Array<any> => {
    return arr.reduce((group, data) => {
      if (!data[key])
        return;

      const param = attr ? data[key][attr] : data[key];
      group[param] = group[param] ?? [];
      group[param].push(data);
      return group;
    }, {});
  }

  static objectToArray = (obj: any) => {
    const list: any[] = [];
    for (const item in obj)
      list.push(obj[item]);
    return list;
  }

  static logExecutionTime(ms: number, msg: string): void {
    const timeString =
      ms > 1000 * 60 ? Math.round(ms / 1000 / 60) + 'm' :
        ms > 1000 ? Math.round(ms / 1000) + 's' :
          Math.round(ms) + 'ms';

    console.debug((msg || '').replace('{{time}}', timeString));
  }

  static roundNumber = (value: number) => Math.round(value);

  async wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  static getHHmmFromSeconds = (seconds: number) => new Date(seconds * 1000).toISOString().substr(11, 8);

  static getDatesDifference = (dateSent: Date, currentDate = new Date()): DateDifferenceOutput | null => {
    if (!dateSent)
      return null;

    if (typeof dateSent == 'string')
      dateSent = new Date(dateSent);

    if (typeof dateSent != 'object')
      return null;

    const diffMs = (currentDate.getTime() - dateSent.getTime()); // milliseconds between now & dateSent
    return {
      days: Math.floor(diffMs / 86400000), // days
      hours: Math.floor((diffMs % 86400000) / 3600000), // hours
      minutes: Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes
    }
  }

  static getMonthString = (month: number): string => new Months().MonthsEnumStr[month];

  static getDayOfWeekString = (day: number): string => new WeekDay().WeekDayEnumStr[day];

  static getCompleteDateOutput = (): CompleteDateOutput => {
    const date = new Date();

    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hour = date.getHours();

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const dayOfWeek = date.getDay();

    return {
      day: day,
      hour: `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      month: HelperService.getMonthString(month),
      weekDay: dayOfWeek,
      weekDayName: HelperService.getDayOfWeekString(dayOfWeek),
      year: year,
      fullDate: date
    }
  }

  static GetDocumentData = (data?: string, docLink?: string): DocumentData | undefined => {
    if (!HelperService.isValidCpfCnpj(data))
      return undefined;

    return {
      data: data,
      imageLink: docLink,
      type: data?.length == 11 ? DocumentTypeEnum.Simple : DocumentTypeEnum.Company
    }
  }

  static DateTimeMinValue = (): Date => new Date('0001-01-01T00:00:00Z');

  static GetBase64FromFile = (event: any): Promise<GetFileOutput> => {
    if (!event.target.files.length)
      return new Promise<GetFileOutput>(() => new GetFileOutput(false, 'Ocorreu um erro ao importar a imagem!', ''));

    return new Promise<GetFileOutput>((resolve, _reject) => {
      const file = <File>event.target.files[0];
      if (file.size / 1024 / 1024 > 5)  //5MB
        resolve(new GetFileOutput(false, 'O tamanho máximo para os arquivos é de 5MB.', ''));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => resolve(new GetFileOutput(true, '', (reader.result?.toString() ?? '')));
      event.target.value = ''
    })
  }

  static getBase64ImageFromUrl = async (imageUrl: string): Promise<string | ArrayBuffer | null> => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject();
      };
      reader.readAsDataURL(blob);
    })
  }

  static objIsValid = (obj: any) => obj ? !Object.values(obj).filter(x => !x)?.length : false

  static async generatePDF(element: string, name: string) {
    const data = document.getElementById(element);
    await html2canvas(data ?? new HTMLElement()).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(name + '.pdf');
    });
  }
}
