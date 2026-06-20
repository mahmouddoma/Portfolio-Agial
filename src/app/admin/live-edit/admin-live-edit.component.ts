import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';

import { SiteContentFacade } from '../../core/content/site-content.facade';
import type { EditableFieldType } from '../../core/content/site-content.model';
import { AdminLiveEditService } from '../../core/live-edit/admin-live-edit.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-admin-live-edit',
  standalone: false,
  templateUrl: './admin-live-edit.component.html',
  styleUrl: '../admin-shared.css',
})
export class AdminLiveEditComponent implements OnInit, OnDestroy {
  private readonly liveEdit = inject(AdminLiveEditService);
  private readonly contentFacade = inject(SiteContentFacade);
  private readonly language = inject(LanguageService);

  readonly selected = this.liveEdit.selected;
  readonly currentValue = computed(() => {
    const selected = this.selected();
    if (!selected) {
      return '';
    }

    const value = this.contentFacade.getValueAtPath<any>(selected.path);
    if (this.isLocalizedValue(value)) {
      return value[this.language.currentLanguage()] ?? '';
    }

    return value ?? '';
  });

  ngOnInit(): void {
    this.liveEdit.enable();
  }

  ngOnDestroy(): void {
    this.liveEdit.disable();
  }

  updateSelected(value: string | number | boolean): void {
    const selected = this.selected();
    if (!selected) {
      return;
    }

    const current = this.contentFacade.getValueAtPath<any>(selected.path);
    const path = this.isLocalizedValue(current)
      ? `${selected.path}.${this.language.currentLanguage()}`
      : selected.path;
    const nextValue = selected.type === 'number' ? Number(value) : value;

    this.contentFacade.updateAtPath(path, nextValue);
  }

  uploadSelected(event: Event): void {
    const selected = this.selected();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!selected || !file) {
      return;
    }

    if (file.size > 250_000) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.updateSelected(String(reader.result));
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  fieldInputType(type: EditableFieldType): string {
    if (type === 'email') return 'email';
    if (type === 'url') return 'url';
    if (type === 'phone') return 'tel';
    if (type === 'number') return 'number';
    return 'text';
  }

  private isLocalizedValue(value: unknown): value is { ar: string; en: string } {
    return !!value && typeof value === 'object' && 'ar' in value && 'en' in value;
  }
}
