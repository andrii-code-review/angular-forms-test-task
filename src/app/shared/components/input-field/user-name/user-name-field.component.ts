import { Component, inject, OnInit } from '@angular/core';
import { InputFieldUiGroupComponent } from '../input-field-ui-group/input-field-ui-group.component';
import { InputFieldBaseComponentClass } from '../input-field-base-component.class';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { delay, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserNameApiService } from '../../../../services/user-name/user-name.api.service';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-user-name-field',
  templateUrl: './user-name-field.component.html',
  standalone: true,
  imports: [InputFieldUiGroupComponent, SpinnerComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserNameFieldComponent,
      multi: true,
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UserNameFieldComponent,
      multi: true,
    },
  ],
})
export class UserNameFieldComponent
  extends InputFieldBaseComponentClass
  implements OnInit, AsyncValidator
{
  private userNameApiService: UserNameApiService = inject(UserNameApiService);

  isLoading = false;

  /*
  This implementation includes debounce time
  That is also the reason and power of the solution with controlAccessor
  It gives ability to create flexible logic with spinners and debouncing
  */
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(null).pipe(
      delay(500),
      tap(() => (this.isLoading = true)),
      switchMap(() => {
        return this.userNameApiService
          .validateUserName(control.value)
          .pipe(finalize(() => (this.isLoading = false)));
      }),
      map((value) => {
        return !value
          ? {
              isNotAllowedValue: true,
            }
          : null;
      }),
    );
  }
}
