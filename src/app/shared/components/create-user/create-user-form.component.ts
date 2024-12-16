import {Component, Inject, Optional} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserNameFieldComponent } from '../input-field/user-name/user-name-field.component';
import { BirthdayFieldComponent } from '../input-field/birthday-field/birthday-field.component';
import { CountryListFieldComponent } from '../input-field/country-list-field/country-list-field.component';
import { HOST_FORM, HostFormComponent } from '../../interface/host-form.component.entities';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserNameFieldComponent,
    BirthdayFieldComponent,
    CountryListFieldComponent,
    NgClass
  ],
})
export class CreateUserFormComponent {
  form: FormGroup;

  get errors() {
    return JSON.stringify(this.form?.errors || {});
  }
  constructor(@Optional() @Inject(HOST_FORM) private hostForm: HostFormComponent) {
    const formBuilder = new FormBuilder();

    //here is creation logic of form group
    //intentionally I put here only required/not-required validators
    //all other field specific validators encapsulated in the field component
    //that helps to reuse the specific components cross app and get their full behavior out of the box
    this.form = formBuilder.group({
      username: new FormControl('', [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
    });

    hostForm?.registerForm(this.form);
  }

  onCloseClick(): void {
    this.hostForm?.unRegisterForm(this.form);
  }
}
