import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: 'spinner.component.html',
  styleUrl: './spinner.component.scss',
  standalone: true,
  imports: [NgClass],
})
export class SpinnerComponent {
  @Input() isShown = true;
}
