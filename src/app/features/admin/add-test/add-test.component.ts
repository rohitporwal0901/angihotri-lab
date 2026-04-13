import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, UploadCloud, Check, Info } from 'lucide-angular';
import { DatabaseService } from '../../../core/services/database.service';

@Component({
  selector: 'app-add-test',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <!-- Header -->
        <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-brand-mint/30">
          <div>
            <h2 class="text-2xl font-black text-slate-900 leading-none mb-2">Configure New Test</h2>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Catalog Management</p>
          </div>
          <button (click)="close.emit()" class="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm">
            <lucide-icon [name]="XIcon" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Name -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Test Name</label>
              <input type="text" [(ngModel)]="test.name" name="name" required
                     placeholder="e.g. Full Body Package"
                     class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-teal font-bold transition-all">
            </div>

            <!-- Category -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select [(ngModel)]="test.category" name="category" required
                      class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-teal font-bold transition-all outline-none">
                <option value="Full Body">Full Body</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Kidney">Kidney</option>
                <option value="Heart">Heart</option>
                <option value="Infection">Infection</option>
                <option value="Vitamins">Vitamins</option>
              </select>
            </div>

            <!-- Price -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Price (₹)</label>
              <input type="number" [(ngModel)]="test.price" name="price" required
                     class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-teal font-bold transition-all">
            </div>

            <!-- Original Price (for discount) -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Original Price (₹)</label>
              <input type="number" [(ngModel)]="test.originalPrice" name="originalPrice"
                     class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-teal font-bold transition-all">
            </div>

            <!-- Sample Type -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sample Type</label>
              <input type="text" [(ngModel)]="test.sampleType" name="sampleType" required
                     placeholder="Blood, Urine, etc."
                     class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-teal font-bold transition-all">
            </div>

            <!-- Report Time -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reporting Time</label>
              <input type="text" [(ngModel)]="test.reportTime" name="reportTime" required
                     placeholder="24 hrs, 48 hrs"
                     class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-teal font-bold transition-all">
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-3">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
            <textarea [(ngModel)]="test.description" name="description" required rows="3"
                      placeholder="What does this test cover?"
                      class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-teal font-bold transition-all"></textarea>
          </div>

          <!-- Options -->
          <div class="flex gap-8">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center transition-all group-hover:bg-brand-mint text-white" 
                   [class.bg-brand-teal]="test.popular">
                <lucide-icon [name]="CheckIcon" class="w-5 h-5" *ngIf="test.popular"></lucide-icon>
              </div>
              <input type="checkbox" [(ngModel)]="test.popular" name="popular" class="hidden">
              <span class="text-xs font-black uppercase text-slate-400 group-hover:text-slate-900 transition-colors">Mark as Popular</span>
            </label>
          </div>

          <div *ngIf="error" class="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100">
            {{error}}
          </div>
        </form>

        <!-- Actions -->
        <div class="p-8 bg-slate-50/50 flex gap-4">
          <button (click)="close.emit()" [disabled]="loading"
                  class="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black border border-slate-100 hover:bg-slate-100 transition-all">
            Cancel
          </button>
          <button (click)="onSubmit()" [disabled]="loading"
                  class="flex-[2] bg-brand-teal text-white py-4 rounded-2xl font-black shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <div *ngIf="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {{loading ? 'Saving Test...' : 'Publish Test'}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class AddTestComponent {
  private dbService = inject(DatabaseService);

  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  readonly XIcon = X;
  readonly CheckIcon = Check;
  readonly InfoIcon = Info;

  loading = false;
  error = '';

  test: any = {
    name: '',
    category: 'Full Body',
    price: 0,
    originalPrice: 0,
    description: '',
    sampleType: 'Blood',
    reportTime: '24 hrs',
    preparation: ['Fasting not required'],
    popular: false
  };

  async onSubmit() {
    if (!this.test.name || !this.test.price) {
      this.error = 'Please fill all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      // Calculate discount automatically if original price provided
      if (this.test.originalPrice > this.test.price) {
        this.test.discount = Math.round(((this.test.originalPrice - this.test.price) / this.test.originalPrice) * 100);
      } else {
        this.test.discount = 0;
      }

      await this.dbService.addTest(this.test);
      this.success.emit();
    } catch (err: any) {
      this.error = err.message || 'Failed to add test';
    } finally {
      this.loading = false;
    }
  }
}
