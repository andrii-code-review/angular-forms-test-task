import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-invalid-forms-number',
  templateUrl: './invalid-forms-number.component.html',
  styleUrl: './invalid-forms-number.component.scss',
  imports: [AsyncPipe],
  standalone: true,
})
export class InvalidFormsNumberComponent {
  @Input() form: FormGroup;

  private lastInvalidFormsNumber: number;

  get formsInvalidNumber(): number {
    if (this.form.status !== 'PENDING') {

      this.lastInvalidFormsNumber = this.formArray.controls.filter(
        (control) => control.invalid && control.touched,
      ).length;
    }
    return this.lastInvalidFormsNumber;
  }

  get formArray(): FormArray {
    return this.form.controls['users'] as FormArray;
  }
}
