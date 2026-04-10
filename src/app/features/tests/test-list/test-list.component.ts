import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Info, Clock, FlaskConical, Filter } from 'lucide-angular';
import { DatabaseService } from '../../../core/services/database.service';
import { LabTest } from '../../../core/models/test.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, RouterModule],
  templateUrl: './test-list.component.html',
  styles: []
})
export class TestListComponent implements OnInit {
  private dbService = inject(DatabaseService);

  readonly SearchIcon = Search;
  readonly InfoIcon = Info;
  readonly ClockIcon = Clock;
  readonly SampleIcon = FlaskConical;
  readonly FilterIcon = Filter;

  searchTerm = new BehaviorSubject<string>('');
  selectedCategory = new BehaviorSubject<string>('All');
  
  tests$: Observable<LabTest[]> = this.dbService.getTests().pipe(
    startWith([
      { id: '1', name: 'Vitamin D (25-Hydroxy)', price: 1200, category: 'Vitamins', preparation: ['Overnight fasting required'], description: 'Measures Vitamin D levels in blood', sampleType: 'Blood', reportTime: '24 hrs', popular: true },
      { id: '2', name: 'HbA1c (Glycosylated Hemoglobin)', price: 450, category: 'Diabetes', preparation: ['No special preparation'], description: 'Average blood sugar over 3 months', sampleType: 'Blood', reportTime: '12 hrs' },
      { id: '3', name: 'Kidney Function Test (KFT)', price: 850, category: 'Kidney', preparation: ['Fasting optional'], description: 'Evaluates kidney health', sampleType: 'Blood & Urine', reportTime: '24 hrs' }
    ])
  );

  filteredTests$!: Observable<LabTest[]>;

  categories = ['All', 'Full Body', 'Vitamins', 'Diabetes', 'Kidney', 'Heart', 'Infection'];

  ngOnInit() {
    this.filteredTests$ = combineLatest([
      this.tests$,
      this.searchTerm,
      this.selectedCategory
    ]).pipe(
      map(([tests, term, cat]) => {
        return tests.filter(test => {
          const matchesSearch = test.name.toLowerCase().includes(term.toLowerCase());
          const matchesCat = cat === 'All' || test.category === cat;
          return matchesSearch && matchesCat;
        });
      })
    );
  }

  onSearch(event: any) {
    this.searchTerm.next(event.target.value);
  }

  selectCategory(cat: string) {
    this.selectedCategory.next(cat);
  }
}
