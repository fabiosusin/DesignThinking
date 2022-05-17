import { Directive, Attribute, Input, OnChanges, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { KeysNames } from '../models/directives/key-names';

@Directive({
  selector: '[brazilDate]'
})
export class BrazilDateDirective implements OnChanges {
  private allowedKeys: string[] = [
    ...KeysNames.controls,
    ...KeysNames.numbers
  ];

  private allowedKeysWithControl: string[] = [
    ...KeysNames.clipboard,
    KeysNames.a
  ];

  @Input() public brazilDate: any;

  constructor(public model: NgControl, @Attribute('brazilDate') public brazilDateAtt: string) {
    model.valueChanges?.subscribe(() => this.onInputChange());
  }

  ngOnChanges() {
    this.onInputChange();
  }

  ngOnInit() {
    this.assignEvent();
    this.onInputChange();
  }

  assignEvent() {
    this.model.valueChanges?.subscribe(() => this.onInputChange());
    this.onInputChange();
  }

  onInputChange() {

    let value: String = this.model.value;
    const model: string = (this.model as any).model;

    if (!value || !String(value).match(/\d+/g))
      return;

    value = (model === value ? model : value).match(/\d+/g)?.join('') ?? '';

    const pattern = '##/##/####';
    let i = 0;
    let formatted = pattern.replace(/#/g, _ => value[i] ? value[i++] : '');

    formatted = (formatted.match(/(.*)\d/) || '')[0].toString();

    this.model.viewToModelUpdate(value);
    this.model.valueAccessor?.writeValue(formatted);
    this.model.control?.setValue(value, {
      emitEvent: false, emitModelToViewChange: false
    });
  }
  
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    !this.allowedKeys.includes(event.key) &&
      !(this.allowedKeysWithControl.includes(event.key) && (event.ctrlKey || event.metaKey)) &&
      event.preventDefault();
  }
}
