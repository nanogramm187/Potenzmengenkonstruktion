import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuTrigger],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  public vorlesungsbeispiele: any[] = [];
  public uebungsaufgaben: any[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    //this.loadConfiguration();
  }

  createNewInstance() {}

  loadFromBrowserCache() {}

  saveToBrowserCache() {}

  loadFromJSON(configuration: any) {}

  saveToLocalStorage() {}

  createInstanceFromJSON() {}

  openHelpDialog() {
    this.dialog.open(HelpDialogComponent);
  }

  onFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = reader.result as string;
      this.loadFromJSON(JSON.parse(content));
    };
    reader.readAsText(file);
    target.value = '';
  }

  loadConfiguration() {
    const url = environment.baseURL + '/assets/config.json';
    fetch(url)
      .then((response) => response.json())
      .then((config) => {
        this.loadVorlesungsbeispiele(config);
        this.loadUebungsaufgaben(config);
      });
  }

  loadVorlesungsbeispiele(config: any) {
    config['Vorlesungsbeispiele'].forEach((aufgabe: any, index: number) => {
      this.fetchJSON('Vorlesungsbeispiele', aufgabe['filename']).then(
        (aufgabe) => {
          this.vorlesungsbeispiele[index] = aufgabe;
        }
      );
    });
  }

  loadUebungsaufgaben(config: any) {
    config['Übungsaufgaben'].forEach((aufgabe: any, index: number) => {
      this.fetchJSON('Übungsaufgaben', aufgabe['filename']).then((aufgabe) => {
        this.uebungsaufgaben[index] = aufgabe;
      });
    });
  }

  async fetchJSON(type: string, name: string) {
    const response = await fetch(
      environment.baseURL + '/assets/' + type + '/' + name + '.json'
    );
    const json = await response.json();
    return json;
  }
}
