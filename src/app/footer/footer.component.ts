import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  getCurrentYear(startYear: number): string {
    const currentYear = new Date().getFullYear();
    return startYear == currentYear
      ? currentYear + ''
      : startYear + ' - ' + currentYear;
  }
}
