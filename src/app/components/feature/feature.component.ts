import { Component } from '@angular/core';
import { CounterComponent } from "../counter/counter.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature',
  imports: [CounterComponent, CommonModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {
features = [
  {
    id: 1,
    title: 'تقارير الطلاب و متابعه الطلاب',
    description: `يمكن لنظام مدرسة أجيال القرآن إنشاء تقارير مفصلة عن تقدم الطلاب، تتيح
      للمعلمين والإداريين متابعة تحصيل الطلاب في جميع المواد. كما يمكن تتبع
      الحضور والأنشطة الخاصة بالطلاب لضمان تقديم الدعم المناسب.`,
    iconType: 'svg',
    iconSvg: ``
  },
  {
    id: 2,
    title: 'المشرفين على التحفيظ والتدريس في مدرسة أجيال القرآن',
    description: `يقوم المشرفون على التحفيظ والتدريس بمتابعة وتوجيه الطلاب...`,
    iconType: 'img',
    iconImg: 'https://theyellowspot.com/wp-content/uploads/2020/07/banner_supervisor-1-on1qjs9amyjm5krb8zsn6srcurf3qz5qc4wybelzyo.png'
  },
  {
    id: 3,
    title: 'حلقات السور القرآنية ووقت الحلقة والمشرف والمعلم',
    description: `تتم إدارة الحلقات من قبل مشرفين ومعلمين...`,
    iconType: 'svg',
    iconSvg: ``
  },
  {
    id: 4,
    title: 'تأثير المدرسة في تطوير الطالب',
    description: `المدرسة هي البيئة التي تنمي قدرات الطالب على الصعيدين الأكاديمي والشخصي...`,
    iconType: 'img',
    iconImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_l9oVFo3e85aWkRpJv7S5SIoJmXMWUuvGKw&s',
    imageStyle: {
      borderRadius: '10px',
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
    }
  }
];

}
