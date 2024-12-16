import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input-field-ui-group',
  templateUrl: './input-field-ui-group.component.html',
  standalone: true,
  styleUrl: './input-field-ui-group.component.scss',
  imports: [NgClass],
})
export class InputFieldUiGroupComponent<T = string> {
  @Input() iconClassName = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value: T;
  @Input() error: string | null;
  @Input() disabled = false;

  @Output('input') _onChange = new EventEmitter<Event>();
  @Output('blur') _onBlur = new EventEmitter<Event>();
  @Output('focus') _onFocus = new EventEmitter<Event>();

  fieldId = performance.now() + Math.random() * 1000;

  onChange(e: Event): void {
    this._onChange.emit(e);
  }

  onFocus(e: Event): void {
    this._onFocus.emit(e);
  }

  onBlur(e: Event): void {
    this._onBlur.emit(e);
  }
}
