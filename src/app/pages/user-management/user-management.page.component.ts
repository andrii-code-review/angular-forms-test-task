import { Component } from '@angular/core';
import { CreateUserFormComponent } from '../../shared/components/create-user/create-user-form.component';
import { FormArray, FormGroup } from '@angular/forms';
import { HOST_FORM, HostFormComponent } from '../../shared/interface/host-form.component.entities';
import { UserNameApiService } from '../../services/user-name/user-name.api.service';
import { map, Observable, shareReplay, Subject, takeUntil, takeWhile, timer, toArray } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {InvalidFormsNumberComponent} from '../../shared/components/invalid-forms-number/invalid-forms-number.component';

const CANCEL_TIMER_SEC = 5;

@Component({
  selector: 'app-user-management-page',
  templateUrl: './user-management.page.component.html',
  standalone: true,
  imports: [CreateUserFormComponent, AsyncPipe, InvalidFormsNumberComponent],
  styleUrl: './user-management.page.component.scss',
  providers: [
    {
      provide: HOST_FORM,
      useExisting: UserManagementPageComponent,
    },
  ],
})
export class UserManagementPageComponent implements HostFormComponent {
  formGroup: FormGroup;

  formArrayIdx: number[]; //just technical array to render&create forms in a loop
  atLeastOnceSubmit: boolean;
  newFormAdded: boolean;
  isLoading: boolean;

  cancelTimer$: Subject<void> | null;
  submitTimerValue$: Observable<number> | null;

  get formArray(): FormArray {
    return this.formGroup.controls['users'] as FormArray;
  }

  constructor(private userNameApiService: UserNameApiService) {
    this.init();
  }

  addNewForm(): void {
    this.formArrayIdx.push(this.formArrayIdx.length + 1);
    this.newFormAdded = true;
  }

  registerForm(form: FormGroup): void {
    this.formArray.push(form);
  }

  unRegisterForm(form: FormGroup) {
    const index = this.formArray.controls.indexOf(form);
    this.formArray.removeAt(index);
    this.formArrayIdx.splice(index, 1);
  }

  cancelSubmit(): void {
    this.cancelTimer$?.error('');
    this.cancelTimer$?.complete();
    this.cancelTimer$ = null;
  }

  submit(): void {
    this.formGroup.markAllAsTouched();
    this.atLeastOnceSubmit = true;
    this.newFormAdded = false;

    this.formArray.controls.forEach((userFormGroup) => {
      return Object.values((userFormGroup as FormGroup).controls).forEach((control) => {
        return control.markAsDirty();
      });
    });

    if (this.formGroup.invalid || !this.formArrayIdx.length) {
      return;
    }

    this.isLoading = true;
    this.formGroup.disable();

    this.cancelTimer$ = new Subject<void>();
    this.submitTimerValue$ = timer(0, 1000).pipe(
      takeUntil(this.cancelTimer$!),
      takeWhile((value) => CANCEL_TIMER_SEC - value !== -1),
      map((value) => CANCEL_TIMER_SEC - value),
      shareReplay(),
    );

    this.submitTimerValue$.pipe(toArray()).subscribe(
      () => {
        this.userNameApiService.createUsers(this.formGroup.value.users).subscribe((result) => {
          this.init();
        });
      },
      () => {
        this.isLoading = false;
        this.formGroup.enable({ emitEvent: false });
      },
    );
  }

  private init(): void {
    this.formArrayIdx = []; //just technical array to render&create forms in a loop
    this.atLeastOnceSubmit = false;
    this.newFormAdded = false;
    this.isLoading = false;

    this.formGroup = new FormGroup({
      users: new FormArray([]),
    });
  }
}
