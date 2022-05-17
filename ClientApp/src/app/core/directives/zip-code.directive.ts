import { Directive, Attribute, HostListener, OnChanges, OnInit, Input } from '@angular/core';
import { DefaultValueAccessor, NgControl } from '@angular/forms';
import { KeysNames } from '../models/directives/key-names';

@Directive({
  selector: '[zipCode]'
})
export class ZipCodeDirective implements OnChanges {
  private allowedKeys: string[] = [
    ...KeysNames.controls,
    ...KeysNames.numbers
  ];

  private allowedKeysWithControl: string[] = [
    ...KeysNames.clipboard,
    KeysNames.a
  ];

  @Input() public zipCode: any;
  constructor(
    public control: NgControl,
    @Attribute('zipCode') public zipCodeAtt: string) { }

  ngOnChanges() {
    this.onInputChange();
  }

  ngOnInit() {
    this.assignEvent();
    this.onInputChange();
  }

  assignEvent() {
    this.control.valueChanges?.subscribe(() => this.onInputChange());
    this.onInputChange();
  }

  onInputChange() {
    let value: string = this.control.value || '';
    value = (value.match(/\d+/g) || []).join('').substring(0,8);

    const pattern = '#####-###';
    let i = 0;
    let formatted = pattern.replace(/#/g, _ => (value[i] ? value[i++] : ''));

    //Remove os caracteres especiais ainda não usados na máscara
    formatted = (formatted.match(/(.*)\d/) || ' ')[0].toString();

    this.control.viewToModelUpdate(value);
    this.control.valueAccessor?.writeValue(formatted);
    this.control.control?.setValue(value, { emitEvent: false, emitModelToViewChange: false });
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    !this.allowedKeys.includes(event.key) &&
      !(this.allowedKeysWithControl.includes(event.key) && (event.ctrlKey || event.metaKey)) &&
      event.preventDefault();
  }
}