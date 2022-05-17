import { Directive, ElementRef, OnChanges, SimpleChange, Attribute, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numbers]',
})
export class OnlyNumbersDirective implements OnChanges {

  @Input() public numbers: any;

  constructor(
    public model: NgControl,
    public ele: ElementRef,
    @Attribute('numbers') public numbersAtt: string) { }

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
    value = (value.match(/\d+/g) || []).join('');

    this.model.viewToModelUpdate(value);
    this.model.valueAccessor?.writeValue(value);
    this.model.control?.setValue(value, {
      emitEvent: false, emitModelToViewChange: false
    });
  }
}
