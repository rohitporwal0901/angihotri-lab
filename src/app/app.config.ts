import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';

import {
  LucideAngularModule,
  FlaskConical, Microscope, Dna, HeartPulse, Star, ArrowRight, Menu, X, Plus, Minus,
  Facebook, Instagram, Twitter, ShieldCheck, Activity, Users, Award, ExternalLink,
  ChevronRight, ChevronDown, Check, LogOut, LayoutDashboard, User, Clock, MapPin, 
  Phone, Mail, Calendar, Search, Filter
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
    })),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    importProvidersFrom(LucideAngularModule.pick({
      FlaskConical, Microscope, Dna, HeartPulse, Star, ArrowRight, Menu, X, Plus, Minus,
      Facebook, Instagram, Twitter, ShieldCheck, Activity, Users, Award, ExternalLink,
      ChevronRight, ChevronDown, Check, LogOut, LayoutDashboard, User, Clock, MapPin, 
      Phone, Mail, Calendar, Search, Filter
    }))
  ]
};
