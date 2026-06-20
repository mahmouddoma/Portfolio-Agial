import { Directive, HostBinding, HostListener, Input, inject } from '@angular/core';

import type { EditableFieldType } from '../content/site-content.model';
import { AdminLiveEditService } from './admin-live-edit.service';

@Directive({
  selector: '[appEditableContent]',
  standalone: true,
})
export class EditableContentDirective {
  private readonly liveEdit = inject(AdminLiveEditService);

  @Input('appEditableContent') path = '';
  @Input() editableLabel = '';
  @Input() editableType: EditableFieldType = 'text';

  @HostBinding('class.admin-live-edit-target')
  get isEditableActive(): boolean {
    return this.liveEdit.enabled();
  }

  @HostBinding('attr.data-editable-content')
  get editablePath(): string | null {
    return this.liveEdit.enabled() ? this.path : null;
  }

  @HostListener('click', ['$event'])
  selectForEditing(event: MouseEvent): void {
    if (!this.liveEdit.enabled() || !this.path) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.liveEdit.select({
      path: this.path,
      label: this.editableLabel || this.path,
      type: this.editableType,
    });
  }
}
