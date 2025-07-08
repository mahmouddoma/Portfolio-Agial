import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Course {
  courseNameAr: string;
  studentsCount: number;
  lessons: number;
  hours: number;
  instructorAr: string;
  instructorsAr: string[];
  image: string;
}

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.css',
})
export class OurServicesComponent {
  isArabic = true;

  services: Course[] = [
    {
      courseNameAr: 'تحفيظ',
      studentsCount: 70,
      lessons: 8,
      hours: 15,
      instructorAr: 'سارة لي',
      instructorsAr: ['سمر سعيد سليمان', 'عبدالله صبحي محمد', 'خالد أحمد'],
      image:
        'https://i.pinimg.com/736x/d6/73/1f/d6731f4c2cc28f51d9d0f82b5c569d01.jpg',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 50,
      lessons: 10,
      hours: 20,
      instructorAr: 'أحمد علي',
      instructorsAr: ['محمود عبد الله', 'فاطمة الزهراء', 'محمد سعيد'],
      image:
        'https://i.pinimg.com/736x/cb/7b/54/cb7b54a03248fa27b8b6b4ebc6e6ea72.jpg',
    },
    {
      courseNameAr: 'تحفيظ',
      studentsCount: 60,
      lessons: 6,
      hours: 12,
      instructorAr: 'مريم أحمد',
      instructorsAr: ['سارة علي', 'محمد حسين'],
      image:
        'https://i.pinimg.com/736x/18/5a/8e/185a8e68e9eacc6cb989fb427509997a.jpg',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 80,
      lessons: 12,
      hours: 24,
      instructorAr: 'علي حسن',
      instructorsAr: ['سامي أحمد', 'ليلى مصطفى'],
      image:
        'https://i.pinimg.com/736x/19/45/9e/19459e259b57e0838a9e452a23e63287.jpg',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 90,
      lessons: 16,
      hours: 32,
      instructorAr: 'فاطمة الزهراء',
      instructorsAr: ['أحمد منصور', 'سارة لي'],
      image:
        'https://i.pinimg.com/736x/f7/ec/77/f7ec77d7bd18f4731185e4766843c7ca.jpg',
    },
  ];
}
