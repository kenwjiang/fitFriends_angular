import { TestBed } from '@angular/core/testing';

import { PrefService } from './pref.service';

describe('PrefService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrefService = TestBed.get(PrefService);
    expect(service).toBeTruthy();
  });
});
