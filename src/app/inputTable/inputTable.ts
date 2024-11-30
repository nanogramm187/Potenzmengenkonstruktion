// Nicht kommentierte Methoden des Codes stammt aus dem vorgegebenen Projekt "Endlicher Automat"

import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';

export class InputTable {
  input: string = '';

  constructor(public automat: EndlicherAutomat) {
    this.input = '';
  }
}
