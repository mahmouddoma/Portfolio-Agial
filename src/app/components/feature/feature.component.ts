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
        type: 'img',
        content: `https://i.pinimg.com/736x/2c/2b/10/2c2b10cff1dba30cf56ef9a8fd28589b.jpg`
      }
    },
    {
      id: 2,
      title: 'المشرفين على التحفيظ والتدريس في مدرسة أجيال القرآن',
      description: 'يقوم المشرفون على التحفيظ والتدريس بمتابعة وتوجيه الطلاب في حفظ وفهم القرآن الكريم، مع التركيز على جودة الحفظ والتجويد.',
      icon: {
        type: 'img',
        content: 'https://i.pinimg.com/736x/c3/1e/c0/c31ec00f14f34b803f6d0fc15fcc6fd9.jpg',
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
        type: 'img',
        content: `https://i.pinimg.com/736x/8b/45/6b/8b456b5ec6ebd65db0a11e9c0a56a1d2.jpg`
      }
    },
    {
      id: 4,
      title: 'تأثير المدرسة في تطوير الطالب',
      description: 'المدرسة هي البيئة التي تنمي قدرات الطالب على الصعيدين الأكاديمي والشخصي، مع التركيز على القيم الإسلامية والتربوية.',
      icon: {
        type: 'img',
        content: 'https://i.pinimg.com/736x/32/f6/1f/32f61f2f0b2e81d1f80d4d6ba5250e3c.jpg',
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
