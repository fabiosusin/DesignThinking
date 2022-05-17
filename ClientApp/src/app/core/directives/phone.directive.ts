import { Directive, ElementRef, OnChanges, SimpleChange, Attribute, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[cellphone]',
})
export class PhoneDirective implements OnChanges {

  @Input() public cellphone: any;

  constructor(
    public model: NgControl,
    public ele: ElementRef,
    @Attribute('cellphone') public cellphoneAtt: string) { }

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
    let value: String = this.model.value || '';
    value = (value.match(/\d+/g) || []).join('').substring(0, 11);

    let pattern = '(##) #####-####'
    let i = 0;
    let formatted = pattern.replace(/#/g, _ => value[i] ? value[i++] : '');

    //Remove os caracteres especiais ainda não usados na máscara
    formatted = (formatted.match(/(.*)\d/) || ' ')[0].toString();

    this.model.viewToModelUpdate(value);
    this.model.valueAccessor?.writeValue(formatted);
    this.model.control?.setValue(value, {
      emitEvent: false, emitModelToViewChange: false
    });
  }
}
