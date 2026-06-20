import { TestBed } from '@angular/core/testing';

import { SiteContentFacade } from './site-content.facade';

describe('SiteContentFacade', () => {
  let facade: SiteContentFacade;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    facade = TestBed.inject(SiteContentFacade);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('updates content by path', () => {
    facade.updateAtPath('header.brandName.en', 'Edited Brand');

    expect(facade.getValueAtPath('header.brandName.en')).toBe('Edited Brand');
  });

  it('persists updates to localStorage', () => {
    facade.updateAtPath('header.brandName.en', 'Stored Brand');

    TestBed.resetTestingModule();
    const nextFacade = TestBed.inject(SiteContentFacade);

    expect(nextFacade.getValueAtPath('header.brandName.en')).toBe('Stored Brand');
  });

  it('resets stored content to defaults', () => {
    facade.updateAtPath('header.brandName.en', 'Temporary Brand');
    facade.reset();

    expect(facade.getValueAtPath('header.brandName.en')).toBe('Ajyal Al Quran');
    expect(facade.hasStoredContent()).toBeFalse();
  });
});
