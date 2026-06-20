import { Injectable } from '@angular/core';

import type { SiteContent } from './site-content.model';

@Injectable({
  providedIn: 'root',
})
export class SiteContentRepository {
  private readonly storageKey = 'agial-site-content';

  load(): SiteContent | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawContent = localStorage.getItem(this.storageKey);
    if (!rawContent) {
      return null;
    }

    try {
      return JSON.parse(rawContent) as SiteContent;
    } catch {
      return null;
    }
  }

  save(content: SiteContent): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(content));
  }

  clear(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(this.storageKey);
  }

  hasStoredContent(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem(this.storageKey);
  }
}
