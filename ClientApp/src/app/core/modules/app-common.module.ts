import { NgModule } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';
import { BrazilDateDirective } from '../directives/brazil-date.directive';
import { CpfCnpjDirective } from '../directives/cpf-cnpj.directive';
import { CreditCardExpirationDirective } from '../directives/credit-card-expiration.directive';
import { CreditCardNumberDirective } from '../directives/credit-card-number.directive';
import { MoneyDirective } from '../directives/money.directive';
import { OnlyNumbersDirective } from '../directives/only-nubers.directive';
import { PhoneDirective } from '../directives/phone.directive';
import { ZipCodeDirective } from '../directives/zip-code.directive';
import { BrazilDatePipe } from '../pipes/brazil-date.pipe';
import { BrazilFullDatePipe } from '../pipes/brazil-full-date.pipe';
import { CpfCnpjPipe } from '../pipes/cpf-cnpj.pipe';
import { CreditCardExpirationPipe } from '../pipes/credit-card-expiration.pipe';
import { CreditCardNumberPipe } from '../pipes/credit-card-number.pipe';
import { MoneyPipe } from '../pipes/money.pipe';
import { PhonePipe } from '../pipes/phone.pipe';
import { QuantityPipe } from '../pipes/quantity.pipe';
import { ZipCodePipe } from '../pipes/zip-code.pipe';
import { AppMaterialModule } from './app-material.module';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [AppMaterialModule],
  declarations: [
    LoaderComponent,
    MoneyDirective,
    PhoneDirective,
    CreditCardNumberDirective,
    CreditCardExpirationDirective,
    OnlyNumbersDirective,
    BrazilDateDirective,
    CpfCnpjDirective,
    ZipCodeDirective,
    QuantityPipe,
    MoneyPipe,
    CreditCardNumberPipe,
    CreditCardExpirationPipe,
    BrazilDatePipe,
    BrazilFullDatePipe,
    ZipCodePipe,
    PhonePipe,
    CpfCnpjPipe
  ],
  exports: [
    LoaderComponent,
    MoneyDirective,
    PhoneDirective,
    CreditCardNumberDirective,
    CreditCardExpirationDirective,
    OnlyNumbersDirective,
    BrazilDateDirective,
    CpfCnpjDirective,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    ZipCodeDirective,
    QuantityPipe,
    PhonePipe,
    MoneyPipe,
    CreditCardNumberPipe,
    CreditCardExpirationPipe,
    BrazilDatePipe,
    BrazilFullDatePipe,
    ZipCodePipe,
    CpfCnpjPipe
  ],
  providers: [
    QuantityPipe,
    MoneyPipe,
    CreditCardNumberPipe,
    CreditCardExpirationPipe,
    PhonePipe,
    BrazilDatePipe,
    BrazilFullDatePipe,
    ZipCodePipe,
    CpfCnpjPipe
  ]
})
export class AppCommonModule { }
