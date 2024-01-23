import { TestBed } from '@angular/core/testing';

import { EndlicherautomatService } from './endlicherautomat.service';

describe('EndlicherautomatService', () => {
  let service: EndlicherautomatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndlicherautomatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
