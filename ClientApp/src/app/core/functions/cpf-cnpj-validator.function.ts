import { ValidatorFn, AbstractControl } from '@angular/forms';
import { HelperService } from '../services/helper/helper.service';

export function CpfCnpjValidator(required?: boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!required && !control.value) return null;

    const valid = HelperService.isValidCpfCnpj(control.value);
    return valid ? null : { invalidCpfCnpj: { value: control.value } };
  };
}
