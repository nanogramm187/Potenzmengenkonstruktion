import { EndlicherAutomat } from '../endlicherautomat/EndlicherAutomat';

export class InputTable {
  input: string = '';

  constructor(public automat: EndlicherAutomat) {
    this.input = '';
  }
}
