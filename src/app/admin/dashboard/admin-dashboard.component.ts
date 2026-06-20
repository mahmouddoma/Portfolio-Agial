import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteContentFacade } from '../../core/content/site-content.facade';

interface DashStat {
  label: string;
  value: number;
  iconBg: string;
  barColor: string;
  iconPath: string;
  iconPath2?: string;
  iconCircle?: [number, number, number];
}

interface DashQuickAction {
  label: string;
  description: string;
  route: string;
  iconBg: string;
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
        iconBg: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        barColor: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
        iconPath: 'M4 6h16M4 12h16M4 18h7',
      },
      {
        label: 'صور الهيرو',
        value: content.hero.slides.length,
        iconBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        barColor: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
        iconPath: 'M15 10l-4 4 6 6-4-16 9 10-7-4z',
      },
      {
        label: 'الكورسات',
        value: content.services.courses.length,
        iconBg: 'linear-gradient(135deg, #10b981, #059669)',
        barColor: 'linear-gradient(90deg, #10b981, #34d399)',
        iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      },
      {
        label: 'الباقات',
        value: content.packages.plans.length,
        iconBg: 'linear-gradient(135deg, #d7b46a, #b8952e)',
        barColor: 'linear-gradient(90deg, #d7b46a, #f0d084)',
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
      iconBg: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      iconPath: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
      iconPath2: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    },
    {
      label: 'الميديا',
      description: 'رفع وإدارة الصور والوسائط',
      route: '/admin/media',
      iconBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      iconCircle: undefined,
    },
    {
      label: 'Live Edit',
      description: 'تعديل مباشر على المعاينة الحية للموقع',
      route: '/admin/live-edit',
      iconBg: 'linear-gradient(135deg, #10b981, #059669)',
      iconPath: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
      iconCircle: [12, 12, 3],
    },
    {
      label: 'عرض البورتفوليو',
      description: 'مشاهدة الموقع كما يراه الزائر',
      route: '/',
      iconBg: 'linear-gradient(135deg, #d7b46a, #b8952e)',
      iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      iconPath2: 'M9 22V12h6v10',
    },
  ];

  exportContent(): void {
    const blob = new Blob([this.contentFacade.exportContent()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agial-site-content.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  resetContent(): void {
    this.contentFacade.reset();
  }
}
