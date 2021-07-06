import { TestBed } from '@angular/core/testing';

import { Memo.ServiceService } from './memo.service.service';

describe('Memo.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Memo.ServiceService = TestBed.get(Memo.ServiceService);
    expect(service).toBeTruthy();
  });
});
