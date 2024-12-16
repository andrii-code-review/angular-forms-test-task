import { Component, ViewChild } from '@angular/core';
import { InputFieldBaseComponentClass } from '../input-field-base-component.class';
import {
  NgbDate,
  NgbDatepicker,
  NgbDatepickerModule,
  NgbDropdown,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InputFieldUiGroupComponent } from '../input-field-ui-group/input-field-ui-group.component';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-birthday-field',
  templateUrl: './birthday-field.component.html',
  standalone: true,
  styleUrl: './birthday-field.component.scss',
  imports: [
    NgbDatepickerModule,
    NgbDropdownModule,
    InputFieldUiGroupComponent,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BirthdayFieldComponent,
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: BirthdayFieldComponent,
      multi: true,
    },
  ],
})
export class BirthdayFieldComponent
  extends InputFieldBaseComponentClass<Date>
  implements AsyncValidator
{
  @ViewChild(NgbDropdown) dropDown: NgbDropdown;
  @ViewChild(NgbDatepicker) datePicker: NgbDatepicker;

  maxNgbDate: NgbDate;
  maxDate: Date;

  get disabledControl(): boolean {
    return this.formControl.disabled;
  }

  constructor() {
    super();
    const currentDate = new Date();

    //the logic of conversion Date to NgbDate and vise verse can be moved to special service
    //did not have time already to project that as well
    this.maxNgbDate = new NgbDate(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    );

    this.maxDate = this.parseDateToDateObj(this.maxNgbDate) as Date;
  }

  onDateSelect(e: NgbDate) {
    this.dropDown.toggle();
    this.formControl.setValue(new Date(e.year, e.month - 1, e.day));
    this.formControl.setErrors(null);
  }

  override writeValue(value: Date) {
    if (value) {
      const valueStr = `${value.getDate()}.${value.getMonth() + 1}.${value.getFullYear()}`;
      super.writeValue(valueStr);
    } else {
      super.writeValue('');
    }
  }

  override onChange(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    const parsedDate = this.parseDateToNgbDate(this.value);
    if (parsedDate) {
      this.datePicker.focusDate(parsedDate);
      this.datePicker.writeValue(parsedDate);
      this._onChange(this.parseDateToDateObj(parsedDate));
    } else {
      this._onChange(this.value);
    }
  }


  //Why I created Async Validator for data format?
  //Because I want the user to stop writing the full date and then to check all his input at once
  //user may intent to type the correct date but he needs time to finish it
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      delay(300),
      map((value) => {
        const parsedValue = this.parseDateToNgbDate(value);
        if (!parsedValue) {
          return {
            wrongDataFormat: true,
          };
        }

        if ((value as Date).getTime() > this.maxDate.getTime()) {
          return {
            maxCurrentDate: true,
          };
        }

        return null;
      }),
    );
  }

  //of course that possible to refactor and move to separate module
  private parseDateToNgbDate(value: string): NgbDate | null {
    const day = parseInt(this.value?.split('.')[0]);
    const month = parseInt(this.value?.split('.')[1]);
    const year = parseInt(this.value?.split('.')[2]);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new NgbDate(year, month, day);
    }
    return null;
  }

  private parseDateToDateObj(ngbDate: NgbDate): Date | null {
    if (ngbDate) {
      return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    } else {
      return null;
    }
  }
}
