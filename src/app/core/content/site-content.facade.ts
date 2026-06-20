import { Injectable, computed, inject, signal } from '@angular/core';

import { createDefaultSiteContent } from './default-site-content';
import {
  EditableCollection,
  EditableContentField,
  EditableFieldType,
  SiteContent,
} from './site-content.model';
import { SiteContentRepository } from './site-content.repository';

@Injectable({
  providedIn: 'root',
})
export class SiteContentFacade {
  private readonly repository = inject(SiteContentRepository);
  private readonly defaults = createDefaultSiteContent();

  readonly content = signal<SiteContent>(this.repository.load() ?? this.clone(this.defaults));
  readonly hasStoredContent = signal(this.repository.hasStoredContent());
  readonly editableFields = computed(() => this.flattenFields(this.content()));
  readonly editableCollections = computed(() => this.getCollectionSummaries(this.content()));

  getValueAtPath<T = unknown>(path: string): T | null {
    return this.readPath(this.content(), path) as T | null;
  }

  updateAtPath(path: string, value: unknown): void {
    this.content.update((content) => {
      const draft = this.clone(content);
      this.writePath(draft, path, value);

      if (path.startsWith('packages.plans.')) {
        draft.packages.useLocalPlans = true;
      }

      this.repository.save(draft);
      this.hasStoredContent.set(true);
      return draft;
    });
  }

  replaceContent(content: SiteContent): void {
    const draft = this.clone(content);
    this.content.set(draft);
    this.repository.save(draft);
    this.hasStoredContent.set(true);
  }

  reset(): void {
    const freshDefault = createDefaultSiteContent();
    this.repository.clear();
    this.content.set(freshDefault);
    this.hasStoredContent.set(false);
  }

  exportContent(): string {
    return JSON.stringify(this.content(), null, 2);
  }

  importContent(rawJson: string): boolean {
    try {
      const parsed = JSON.parse(rawJson) as SiteContent;
      this.replaceContent(parsed);
      return true;
    } catch {
      return false;
    }
  }

  addCollectionItem(path: string): void {
    const collection = this.getValueAtPath<unknown[]>(path);
    if (!Array.isArray(collection)) {
      return;
    }

    const source = collection[collection.length - 1] ?? {};
    const nextItem = this.clone(source);
    if (nextItem && typeof nextItem === 'object' && 'id' in nextItem) {
      (nextItem as { id: unknown }).id = this.createNextId(collection);
    }

    this.updateAtPath(path, [...collection, nextItem]);
  }

  removeCollectionItem(path: string, index: number): void {
    const collection = this.getValueAtPath<unknown[]>(path);
    if (!Array.isArray(collection) || collection.length <= 1) {
      return;
    }

    this.updateAtPath(path, collection.filter((_, itemIndex) => itemIndex !== index));
  }

  private getCollectionSummaries(content: SiteContent): EditableCollection[] {
    const collections = [
      { path: 'nav', label: 'روابط الهيدر' },
      { path: 'hero.slides', label: 'صور الهيرو' },
      { path: 'hero.metrics', label: 'مؤشرات الهيرو' },
      { path: 'testimonials.slides', label: 'قصص الطلاب' },
      { path: 'journey.steps', label: 'رحلة الطالب' },
      { path: 'features.features', label: 'المميزات' },
      { path: 'counters', label: 'الإحصائيات' },
      { path: 'services.courses', label: 'الكورسات' },
      { path: 'packages.plans', label: 'الباقات' },
      { path: 'footer.socialLinks', label: 'روابط السوشيال' },
    ];

    return collections
      .map((collection) => ({
        ...collection,
        count: (this.readPath(content, collection.path) as unknown[] | null)?.length ?? 0,
      }))
      .filter((collection) => collection.count > 0);
  }

  private flattenFields(content: SiteContent): EditableContentField[] {
    const fields: EditableContentField[] = [];
    this.visit(content, '', fields);
    return fields;
  }

  private visit(value: unknown, path: string, fields: EditableContentField[]): void {
    if (this.isLeaf(value)) {
      if (this.shouldSkipPath(path)) {
        return;
      }

      fields.push({
        path,
        label: this.pathToLabel(path),
        section: path.split('.')[0] ?? 'content',
        type: this.getFieldType(path, value),
        value: value as string | number | boolean,
      });
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => this.visit(item, `${path}.${index}`.replace(/^\./, ''), fields));
      return;
    }

    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) =>
        this.visit(child, `${path}.${key}`.replace(/^\./, ''), fields),
      );
    }
  }

  private shouldSkipPath(path: string): boolean {
    return (
      path.endsWith('.id') ||
      path === 'packages.useLocalPlans' ||
      path.endsWith('.interval') ||
      path.endsWith('.started') ||
      path.endsWith('.count')
    );
  }

  private isLeaf(value: unknown): boolean {
    return ['string', 'number', 'boolean'].includes(typeof value);
  }

  private getFieldType(path: string, value: unknown): EditableFieldType {
    if (typeof value === 'number') {
      return 'number';
    }

    if (typeof value === 'boolean') {
      return 'boolean';
    }

    const normalizedPath = path.toLowerCase();
    if (normalizedPath.includes('image') || normalizedPath.endsWith('src') || normalizedPath.includes('logosrc')) {
      return 'image';
    }

    if (normalizedPath.includes('email')) {
      return 'email';
    }

    if (normalizedPath.includes('phone')) {
      return 'phone';
    }

    if (normalizedPath.includes('url') || normalizedPath.includes('href')) {
      return 'url';
    }

    if (
      normalizedPath.includes('description') ||
      normalizedPath.includes('summary') ||
      normalizedPath.includes('quote') ||
      normalizedPath.includes('message') ||
      String(value).length > 80
    ) {
      return 'textarea';
    }

    return 'text';
  }

  private pathToLabel(path: string): string {
    return path
      .replace(/\.(ar|en)$/g, ' .$1')
      .replace(/\.(\d+)\./g, ' #$1 ')
      .replace(/\./g, ' / ');
  }

  private readPath(source: unknown, path: string): unknown {
    if (!path) {
      return source;
    }

    return path.split('.').reduce<unknown>((current, segment) => {
      if (current === null || current === undefined) {
        return null;
      }

      if (Array.isArray(current)) {
        return current[Number(segment)] ?? null;
      }

      if (typeof current === 'object') {
        return (current as Record<string, unknown>)[segment] ?? null;
      }

      return null;
    }, source);
  }

  private writePath(target: unknown, path: string, value: unknown): void {
    const segments = path.split('.');
    const lastSegment = segments.pop();
    if (!lastSegment) {
      return;
    }

    const parent = segments.reduce<unknown>((current, segment) => {
      if (Array.isArray(current)) {
        return current[Number(segment)];
      }

      return (current as Record<string, unknown>)[segment];
    }, target);

    if (Array.isArray(parent)) {
      parent[Number(lastSegment)] = value;
      return;
    }

    if (parent && typeof parent === 'object') {
      (parent as Record<string, unknown>)[lastSegment] = value;
    }
  }

  private createNextId(collection: unknown[]): number | string {
    const numericIds = collection
      .map((item) => (item && typeof item === 'object' ? Number((item as { id?: unknown }).id) : NaN))
      .filter(Number.isFinite);

    return numericIds.length ? Math.max(...numericIds) + 1 : `item-${Date.now()}`;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
