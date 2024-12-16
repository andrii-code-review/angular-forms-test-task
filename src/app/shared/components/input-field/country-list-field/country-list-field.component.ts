import { Component, ElementRef, HostBinding, HostListener } from '@angular/core';
import { InputFieldUiGroupComponent } from '../input-field-ui-group/input-field-ui-group.component';
import { InputFieldBaseComponentClass } from '../input-field-base-component.class';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Country } from '../../../enum/country';

@Component({
  selector: 'app-country-list-field',
  templateUrl: './country-list-field.component.html',
  styleUrl: './country-list-field.component.scss',
  standalone: true,
  imports: [InputFieldUiGroupComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CountryListFieldComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CountryListFieldComponent,
      multi: true,
    },
  ],
})
export class CountryListFieldComponent extends InputFieldBaseComponentClass implements Validator {
  //create a Country as enum type is not a correct way.
  //better to work with Country like with usual array that contains objects
  //the primary purpose of enum key-value structure is engineering readability and type safety
  //enum is not designed for displaying it's values as it is to user,
  //needs in that case create a map to convert by key to displaying value

  countries = Object.values(Country);
  suggestedCountries: string[] = [];
  isInputInFocus = false;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    this.isInputInFocus = this.elementRef.nativeElement.contains(event.target);
  }

  constructor(private elementRef: ElementRef) {
    super();
  }

  override onChange(e: Event) {
    super.onChange(e);
    this.updateFilteredList();
  }

  selectCountry(country: string): void {
    this.formControl.setValue(country);
    this.isInputInFocus = false;
    this.updateFilteredList();
  }

  onFocus(e: Event): void {
    this.isInputInFocus = true;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return !this.countries.includes(control.value) && this.value
      ? {
          isNotAllowedValue: true,
        }
      : null;
  }

  private updateFilteredList(): void {
    if (this.value) {
      const filteredCountries = this.countries.filter((country) =>
        country?.toLowerCase().includes(this.value.toLowerCase()),
      );
      if (filteredCountries[0] === this.value && filteredCountries.length === 1) {
        this.suggestedCountries = [];
      } else {
        this.suggestedCountries = filteredCountries;
      }
      return;
    }
    this.suggestedCountries = [];
  }
}
