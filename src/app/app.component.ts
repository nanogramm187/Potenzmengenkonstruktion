import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { CoreComponent } from "./core/core.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HeaderComponent, ToolbarComponent, CoreComponent, FooterComponent]
})
export class AppComponent {
  title = 'endlicherautomat';
}
