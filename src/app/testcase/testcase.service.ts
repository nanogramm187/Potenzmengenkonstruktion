import { Injectable } from '@angular/core';
import { Testcase } from './testcase';

@Injectable({
  providedIn: 'root'
})
export class TestcaseService {

  testcases: Testcase[] = [];

  constructor() { }

  addAcceptingInput() {
    this.testcases.push(new Testcase());
  }

  removeAcceptingInput(index: number) {
    this.testcases.splice(index, 1);
  }
}
