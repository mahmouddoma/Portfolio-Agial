import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from "../counter/counter.component";
import { InViewportDirective } from '../../directives/directives/in-viewport.directive';

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
  subtitle?: string; // Make subtitle optional
}

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CounterComponent, CommonModule, InViewportDirective],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {
  features: Feature[] = [
    {
      id: 1,
      title: ' تقارير الطلاب ومتابعتهم 📄',
      description: 'يوفر نظام أجيال القرآن تقارير دقيقة وشاملة عن أداء الطلاب، تشمل التحصيل العلمي، الحضور، والمشاركة في الأنشطة، مما يساعد المعلمين والإدارة على تقديم الدعم المناسب لكل طالب وفق احتياجاته.',
      icon: {
        type: 'img',
        content: `https://i.pinimg.com/736x/2c/2b/10/2c2b10cff1dba30cf56ef9a8fd28589b.jpg`
      }
    },
    {
      id: 2,
      title: ' المشرفون على التحفيظ والتدريس 👨‍🏫',
      description:'يشرف على تحفيظ وتدريس القرآن الكريم نخبة من المشرفين المتخصصين، يعملون على متابعة الطلاب وتوجيههم بدقة، مع التركيز على جودة الحفظ، إتقان التلاوة، وفهم معاني الآيات.كما يحرص المشرفون على ترسيخ القيم التربوية المستمدة من القرآن الكريم، ليكون التعليم مقرونًا بالتهذيب والتزكية، لا الحفظ فقط.ومن مهامهم كذلك:تقييم أداء الحلقات والمعلمين والطلاب بشكل دوري.رصد نقاط القوة والضعف وتقديم التوجيه المناسب.معالجة المشكلات التربوية والتعليمية أولًا بأول لضمان بيئة تعليمية ناجحة ومستقرة.',
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
      title: 'الحلقات',
      subtitle :'🔹 الحلقات في مدرسة أجيال القرآن',
      description:' تعتمد مدرسة أجيال القرآن نظام الحلقات الفردية، حيث يحظى كل طالب بمتابعة خاصة وفق مستواه، مما يضمن جودة الحفظ والتلاوة والتدرج المناسب في التعلم. وقد تم تنظيم الحلقات ضمن أقسام مستقلة تراعي الخصوصية والفروق العمرية: 👨‍🦰 قسم الرجال: يشرف عليه معلمون متخصصون في تحفيظ وتجويد القرآن.👩 قسم النساء: تشرف عليه معلمات ذوات كفاءة وخبرة في تعليم القرآن الكريم.👦👧 قسم الأطفال: يُعنى بتعليم الصغار بأساليب تربوية مشوّقة ومناسبة لأعمارهم.  نسعى من خلال هذا التنظيم إلى تهيئة بيئة تعليمية آمنة ومثمرة، تساعد كل متعلم على تحقيق أفضل النتائج في حفظ كتاب الله وتدبره. ',
      icon: {
        type: 'img',
        content: `https://i.pinimg.com/736x/8b/45/6b/8b456b5ec6ebd65db0a11e9c0a56a1d2.jpg`
      }
    },
    {
      id: 4,
      subtitle: 'المعلمون',
      title: ' المعلمون في أجيال القرآن 👩‍🏫',
      description: 'يضم فريق أجيال القرآن نخبة من المعلمين والمعلمات المتخصصين في تعليم القرآن الكريم وعلومه، يتمتعون بالكفاءة العلمية، والخبرة التربوية، والتمكن من مهارات التحفيظ والتجويد.لا يقتصر دورهم على التعليم فقط، بل يمتد ليشمل غرس القيم القرآنية، ومرافقة الطالب في رحلته الإيمانية والعلمية، بأسلوب تربوي راقٍ يُراعي الفروق الفردية ويُحفّز على الاستمرار والتقدم.',
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

  section = {
    title: 'مميزات مدرسة أجيال القرآن'
  };

  isValidSvg(content: string): boolean {
    return content.includes('<svg') && content.includes('</svg>');
  }
}
