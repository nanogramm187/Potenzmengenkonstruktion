import { Component } from '@angular/core';
import { MenuComponent } from "./menu/menu.component";

@Component({
    selector: 'app-toolbar',
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    imports: [MenuComponent]
})
export class ToolbarComponent {

}
