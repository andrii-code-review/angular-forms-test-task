import { FormGroup } from '@angular/forms';
import { InjectionToken } from '@angular/core';

export interface HostFormComponent {
  registerForm(form: FormGroup): void;
  unRegisterForm(form: FormGroup): void;
}

export const HOST_FORM = new InjectionToken<HostFormComponent>('Host Form');
