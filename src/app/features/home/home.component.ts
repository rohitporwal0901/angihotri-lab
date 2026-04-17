import {
    Component, inject, OnInit, OnDestroy, AfterViewInit,
    HostListener, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private authService = inject(AuthService);

    mobileMenuOpen = false;
    navScrolled = false;
    openFaqIndex: number | null = null;
    isAuthChecking = true;

    statCounters = [
        { label: 'Diagnostic Tests', numericValue: 350, current: 0, suffix: '+', animated: false },
        { label: 'Years Experience', numericValue: 12, current: 0, suffix: '+', animated: false },
        { label: 'Happy Patients', numericValue: 25000, current: 0, suffix: '+', animated: false },
        { label: 'Collection Centers', numericValue: 15, current: 0, suffix: '+', animated: false },
    ];

    services = [
        { icon: 'flask-conical', title: 'Pathology', desc: 'Accurate blood, urine, and body fluid diagnostics.', color: 'from-blue-500 to-indigo-600' },
        { icon: 'microscope', title: 'Bio-Chemistry', desc: 'Analysis of hormones and metabolic markers.', color: 'from-teal-500 to-emerald-600' },
        { icon: 'dna', title: 'Molecular Biology', desc: 'Viral load testing and genetic diagnostics.', color: 'from-indigo-500 to-violet-600' },
        { icon: 'heart-pulse', title: 'Cardiology', desc: 'ECG and cardiac marker diagnostic panels.', color: 'from-rose-500 to-orange-500' },
    ];

    faqs = [
        { q: 'How do I book a home sample collection?', a: 'Book directly via the portal or call our helpline.' },
        { q: 'When will I receive my digital reports?', a: 'Reports are released within 12-24 hours.' },
        { q: 'Are your labs NABL accredited?', a: 'Yes, we are fully NABL and ISO certified.' },
        { q: 'Can I reschedule my appointment?', a: 'Yes, up to 2 hours before pickup.' }
    ];

    private observers: IntersectionObserver[] = [];

    get isLoggedIn() { return this.authService.isLoggedIn; }
    get userRole() { return this.authService.currentUser?.role; }

    @HostListener('window:scroll')
    onScroll() {
        this.navScrolled = window.scrollY > 30;
    }

    ngOnInit() {
        this.authService.user$.subscribe(user => {
            this.isAuthChecking = false;
            this.cdr.markForCheck();
        });
    }

    ngAfterViewInit() {
        this.setupScrollAnimations();
    }

    ngOnDestroy() {
        this.observers.forEach(o => o.disconnect());
    }

    private setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    animateCounters() {}

    toggleFaq(index: number) {
        this.openFaqIndex = this.openFaqIndex === index ? null : index;
    }

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }
    closeMobileMenu() { this.mobileMenuOpen = false; }
    goToLogin() { this.router.navigate(['/login']); }
    goToRegister() { this.router.navigate(['/signup']); }
    goToDashboard() { this.router.navigate(['/profile']); }
}
