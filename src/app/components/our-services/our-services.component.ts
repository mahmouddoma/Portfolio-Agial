import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-our-services',
  imports: [CommonModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.css',
})
export class OurServicesComponent {
  services = [
    {
      courseNameAr: 'تحفيظ',
      studentsCount: 70,
      lessons: 8,
      hours: 15,
      instructorAr: 'سارة لي',
      instructorsAr: ['سمر سعيد سليمان', 'عبدالله صبحي محمد', 'خالد أحمد'], // List of instructors in Arabic for memorization
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 50,
      lessons: 10,
      hours: 20,
      instructorAr: 'أحمد علي',
      instructorsAr: ['محمود عبد الله', 'فاطمة الزهراء', 'محمد سعيد'], // List of instructors in Arabic for Quran interpretation
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تحفيظ',
      studentsCount: 60,
      lessons: 6,
      hours: 12,
      instructorAr: 'مريم أحمد',
      instructorsAr: ['سارة علي', 'محمد حسين'], // List of instructors in Arabic for memorization
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 80,
      lessons: 12,
      hours: 24,
      instructorAr: 'علي حسن',
      instructorsAr: ['سامي أحمد', 'ليلى مصطفى'], // List of instructors in Arabic for Quran interpretation
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تحفيظ',
      studentsCount: 100,
      lessons: 14,
      hours: 28,
      instructorAr: 'خالد أحمد',
      instructorsAr: ['محمود عبد الله', 'سارة الزهراء'], // List of instructors in Arabic for memorization
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
    {
      courseNameAr: 'تفسير سور من القرآن',
      studentsCount: 90,
      lessons: 16,
      hours: 32,
      instructorAr: 'فاطمة الزهراء',
      instructorsAr: ['أحمد منصور', 'سارة لي'], // List of instructors in Arabic for Quran interpretation
      image:
        'https://w7.pngwing.com/pngs/527/663/png-transparent-logo-person-user-person-icon-rectangle-photography-computer-wallpaper-thumbnail.png',
    },
  ];

  isArabic = true;
}
