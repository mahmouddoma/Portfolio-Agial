import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteContentFacade } from '../../core/content/site-content.facade';

interface DashStat {
  label: string;
  value: number;
  iconPath: string;
  iconPath2?: string;
  iconCircle?: [number, number, number];
}

interface DashQuickAction {
  label: string;
  description: string;
  route: string;
  iconPath: string;
  iconPath2?: string;
  iconCircle?: [number, number, number];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: '../admin-shared.css',
})
export class AdminDashboardComponent {
  private readonly contentFacade = inject(SiteContentFacade);

  readonly stats = computed<DashStat[]>(() => {
    const content = this.contentFacade.content();
    return [
      {
        label: 'روابط التنقل',
        value: content.nav.length,
        iconPath: 'M4 6h16M4 12h16M4 18h7',
      },
      {
        label: 'صور الهيرو',
        value: content.hero.slides.length,
        iconPath: 'M15 10l-4 4 6 6-4-16 9 10-7-4z',
      },
      {
        label: 'الكورسات',
        value: content.services.courses.length,
        iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      },
      {
        label: 'الباقات',
        value: content.packages.plans.length,
        iconPath: 'M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z',
      },
    ];
  });

  readonly hasStoredContent = this.contentFacade.hasStoredContent;

  readonly quickActions: DashQuickAction[] = [
    {
      label: 'إدارة المحتوى',
      description: 'تعديل نصوص وبيانات جميع أقسام الموقع',
      route: '/admin/content',
      iconPath: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
      iconPath2: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    },
    {
      label: 'الميديا',
      description: 'رفع وإدارة الصور والوسائط',
      route: '/admin/media',
      iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      iconCircle: undefined,
    },
    {
      label: 'Live Edit',
      description: 'تعديل مباشر على المعاينة الحية للموقع',
      route: '/admin/live-edit',
      iconPath: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
      iconCircle: [12, 12, 3],
    },
    {
      label: 'عرض البورتفوليو',
      description: 'مشاهدة الموقع كما يراه الزائر',
      route: '/',
      iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      iconPath2: 'M9 22V12h6v10',
    },
  ];

  resetContent(): void {
    this.contentFacade.reset();
  }
}
