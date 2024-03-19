import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-spinner',
  templateUrl: './input-spinner.component.html',
  styleUrls: ['./input-spinner.component.scss']
})
export class InputSpinnerComponent {
  counter: number = 1;
  @Input('min') min: number = 1;
  @Input('max') max: number = 50;
  @Input('value') value: number = this.min;
  @Input('step') step: number = 1;
  @Input('direction') direction: 'horizontal' | 'vertical' = 'horizontal';
  @Output('change') change: EventEmitter<number> = new EventEmitter();
  disabled: boolean;

  _propagateChange: any = () => { };
  _onTouched: () => void;


  writeValue(value: number): void {
    this.value = value || 0;
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  inc(): void {
    let value = Number(this.value) + this.step
    if (value >= this.min && value <= this.max) {
      this.value = value;
      this._onChange();
    }

  }

  dec(): void {
    let value = Number(this.value) - this.step
    if (value >= this.min && value <= this.max) {
      this.value = value;
      this._onChange();
    }

  }

  private _onChange(): void {
    this._propagateChange(this.value);
    this.change.emit(this.value);
  }

}
