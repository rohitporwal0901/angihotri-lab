import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, ArrowRight, FlaskConical, Activity, Microscope, Heart, Thermometer } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent {
  readonly SearchIcon = Search;
  readonly ArrowIcon = ArrowRight;

  categories = [
    { name: 'Full Body', icon: FlaskConical, color: 'bg-blue-50 text-blue-600' },
    { name: 'Diabetes', icon: Activity, color: 'bg-red-50 text-red-600' },
    { name: 'Kidney', icon: Microscope, color: 'bg-purple-50 text-purple-600' },
    { name: 'Heart', icon: Heart, color: 'bg-orange-50 text-orange-600' },
    { name: 'Infection', icon: Thermometer, color: 'bg-teal-50 text-teal-600' },
  ];

  popularTests = [
    { name: 'Complete Blood Count (CBC)', price: 299, originalPrice: 500, discount: 40, duration: '24 hrs' },
    { name: 'Thyroid Profile (T3, T4, TSH)', price: 499, originalPrice: 800, discount: 38, duration: '12 hrs' },
    { name: 'Lipid Profile', price: 399, originalPrice: 600, discount: 33, duration: '24 hrs' },
  ];
}
