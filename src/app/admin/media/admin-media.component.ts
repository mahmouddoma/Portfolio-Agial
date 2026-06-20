import { Component, computed, inject } from '@angular/core';

import { SiteContentFacade } from '../../core/content/site-content.facade';
import type { EditableContentField } from '../../core/content/site-content.model';

@Component({
  selector: 'app-admin-media',
  standalone: false,
  templateUrl: './admin-media.component.html',
  styleUrl: '../admin-shared.css',
})
export class AdminMediaComponent {
  private readonly contentFacade = inject(SiteContentFacade);
  readonly imageFields = computed(() =>
    this.contentFacade.editableFields().filter((field) => field.type === 'image'),
  );
  message = '';

  updateImage(field: EditableContentField, value: string): void {
    this.contentFacade.updateAtPath(field.path, value);
  }

  imageValue(field: EditableContentField): string {
    return String(field.value ?? '');
  }

  uploadImage(field: EditableContentField, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 250_000) {
      this.message = 'حجم الصورة كبير على LocalStorage. استخدم URL أو صورة أقل من 250KB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.updateImage(field, String(reader.result));
      this.message = 'تم تحديث الصورة.';
      input.value = '';
    };
    reader.readAsDataURL(file);
  }
}
