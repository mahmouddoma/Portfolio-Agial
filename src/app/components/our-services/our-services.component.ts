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
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 50,
      lessons: 10,
      hours: 20,
      instructorAr: 'أحمد علي',
      instructorsAr: ['محمود عبد الله', 'فاطمة الزهراء', 'محمد سعيد'],
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تحفيظ',
      studentsCount: 60,
      lessons: 6,
      hours: 12,
      instructorAr: 'مريم أحمد',
      instructorsAr: ['سارة علي', 'محمد حسين'],
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 80,
      lessons: 12,
      hours: 24,
      instructorAr: 'علي حسن',
      instructorsAr: ['سامي أحمد', 'ليلى مصطفى'],
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 90,
      lessons: 16,
      hours: 32,
      instructorAr: 'فاطمة الزهراء',
      instructorsAr: ['أحمد منصور', 'سارة لي'],
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
  ];
}
