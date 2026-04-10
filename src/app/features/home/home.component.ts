import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Search, ArrowRight, FlaskConical, Activity, Microscope, Heart, Thermometer } from 'lucide-angular';
import { DatabaseService } from '../../core/services/database.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable, map } from 'rxjs';
import { LabTest } from '../../core/models/test.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  private dbService = inject(DatabaseService);
  public authService = inject(AuthService);
  private router = inject(Router);

  readonly SearchIcon = Search;
  readonly ArrowIcon = ArrowRight;

  tests$: Observable<LabTest[]> = this.dbService.getTests();
  categories$: Observable<any[]> = this.dbService.getCategories().pipe(
    map(cats => {
      if (cats.length === 0) return this.defaultCategories;
      return cats.map(c => ({
        ...c,
        icon: this.getIcon(c.name),
        color: this.getColor(c.name)
      }));
    })
  );
  filteredTests$!: Observable<LabTest[]>;
  selectedCategory: string = 'All';

  private defaultCategories = [
    { name: 'All', icon: FlaskConical, color: 'bg-gray-50 text-gray-600' },
    { name: 'Full Body', icon: FlaskConical, color: 'bg-blue-50 text-blue-600' },
    { name: 'Diabetes', icon: Activity, color: 'bg-red-50 text-red-600' },
    { name: 'Kidney', icon: Microscope, color: 'bg-purple-50 text-purple-600' },
    { name: 'Heart', icon: Heart, color: 'bg-orange-50 text-orange-600' },
    { name: 'Infection', icon: Thermometer, color: 'bg-teal-50 text-teal-600' },
  ];

  ngOnInit() {
    this.filteredTests$ = this.tests$.pipe(
      map(tests => tests.filter(t => this.selectedCategory === 'All' || t.category === this.selectedCategory))
    );
  }

  getIcon(name: string) {
    const map: any = {
      'Diabetes': Activity,
      'Kidney': Microscope,
      'Heart': Heart,
      'Infection': Thermometer,
      'Full Body': FlaskConical,
      'Vitamins': Microscope
    };
    return map[name] || FlaskConical;
  }

  getColor(name: string) {
    const map: any = {
      'Diabetes': 'bg-red-50 text-red-600',
      'Kidney': 'bg-purple-50 text-purple-600',
      'Heart': 'bg-orange-50 text-orange-600',
      'Infection': 'bg-teal-50 text-teal-600',
      'Full Body': 'bg-blue-50 text-blue-600',
      'Vitamins': 'bg-yellow-50 text-yellow-600'
    };
    return map[name] || 'bg-gray-50 text-gray-500';
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
    this.filteredTests$ = this.tests$.pipe(
      map(tests => tests.filter(t => this.selectedCategory === 'All' || t.category === this.selectedCategory))
    );
  }

  goToDashboard() {
    this.router.navigate(['/profile']); // Based on role, this will diverge later
  }
}
