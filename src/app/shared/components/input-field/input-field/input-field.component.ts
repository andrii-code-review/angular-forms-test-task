import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputFieldBaseComponentClass } from '../input-field-base-component.class';
import { InputFieldUiGroupComponent } from '../input-field-ui-group/input-field-ui-group.component';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  standalone: true,
  imports: [InputFieldUiGroupComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFieldComponent,
      multi: true,
    },
  ],
})
export class InputFieldComponent extends InputFieldBaseComponentClass {}
