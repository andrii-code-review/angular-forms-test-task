import { Directive, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroupDirective } from '@angular/forms';

@Directive()
export class InputFieldBaseComponentClass<T = string> implements ControlValueAccessor, OnInit {
  @Input() formControlName: string;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() label: string;

  protected _onChange: (value: T | null) => void;
  protected _onTouched: () => void;

  protected formControl: AbstractControl;

  value: any;
  defaultErrorMessage: string;

  private formDirective = inject(FormGroupDirective);

  //this could be moved to separate service of error messages
  get errorMessage(): string | null {
    switch (true) {
      case !!this.formControl.errors?.['wrongDataFormat']:
        return 'Wrong data format';
      case !!this.formControl.errors?.['isNotAllowedValue']:
        return this.defaultErrorMessage;
      case !!this.formControl.errors?.['maxCurrentDate']:
        return 'Max possible date is current date';
      case !!this.formControl.errors?.['required']:
        return 'Field is required';
    }
    return null;
  }

  ngOnInit() {
    this.formControl = this.formDirective.form.controls[this.formControlName];
    this.defaultErrorMessage = `Please provide correct ${this.label || 'value'}`;
  }

  //when the value changes from ngModel or formControl.setValue()
  writeValue(value: T | string): void {
    this.value = value;
  }

  registerOnChange(onChange: any) {
    this._onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this._onTouched = onTouched;
  }

  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value as T;
    this.value = value;
    this._onChange(value);
  }

  onTouched(): void {
    this._onTouched();
  }
}
