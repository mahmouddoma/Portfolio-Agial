import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from "../counter/counter.component";

interface FeatureIcon {
  type: 'svg' | 'img';
  content: string;
  style?: { [key: string]: string };
}

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: FeatureIcon;
}

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CounterComponent, CommonModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {
  features: Feature[] = [
    {
      id: 1,
      title: 'تقارير الطلاب و متابعه الطلاب',
      description: 'يمكن لنظام مدرسة أجيال القرآن إنشاء تقارير مفصلة عن تقدم الطلاب، تتيح للمعلمين والإداريين متابعة تحصيل الطلاب في جميع المواد. كما يمكن تتبع الحضور والأنشطة الخاصة بالطلاب لضمان تقديم الدعم المناسب.',
      icon: {
        type: 'svg',
        content: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>`
      }
    },
    {
      id: 2,
      title: 'المشرفين على التحفيظ والتدريس في مدرسة أجيال القرآن',
      description: 'يقوم المشرفون على التحفيظ والتدريس بمتابعة وتوجيه الطلاب في حفظ وفهم القرآن الكريم، مع التركيز على جودة الحفظ والتجويد.',
      icon: {
        type: 'img',
        content: 'https://theyellowspot.com/wp-content/uploads/2020/07/banner_supervisor-1-on1qjs9amyjm5krb8zsn6srcurf3qz5qc4wybelzyo.png',
        style: {
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    {
      id: 3,
      title: 'حلقات السور القرآنية ووقت الحلقة والمشرف والمعلم',
      description: 'تتم إدارة الحلقات من قبل مشرفين ومعلمين متخصصين، مع جدولة مرنة تناسب احتياجات الطلاب.',
      icon: {
        type: 'svg',
        content: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
        </svg>`
      }
    },
    {
      id: 4,
      title: 'تأثير المدرسة في تطوير الطالب',
      description: 'المدرسة هي البيئة التي تنمي قدرات الطالب على الصعيدين الأكاديمي والشخصي، مع التركيز على القيم الإسلامية والتربوية.',
      icon: {
        type: 'img',
        content: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_l9oVFo3e85aWkRpJv7S5SIoJmXMWUuvGKw&s',
        style: {
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
        }
      }
    }
  ];

  isValidSvg(content: string): boolean {
    return content.includes('<svg') && content.includes('</svg>');
  }
}
