import { Injectable, signal } from '@angular/core';

import type { EditableFieldType } from '../content/site-content.model';

export interface LiveEditSelection {
  path: string;
  label: string;
  type: EditableFieldType;
}

@Injectable({
  providedIn: 'root',
})
export class AdminLiveEditService {
  readonly enabled = signal(false);
  readonly selected = signal<LiveEditSelection | null>(null);

  enable(): void {
    this.enabled.set(true);
  }

  disable(): void {
    this.enabled.set(false);
    this.selected.set(null);
  }

  select(selection: LiveEditSelection): void {
    this.selected.set(selection);
  }
}
