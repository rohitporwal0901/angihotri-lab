import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map, shareReplay, take } from 'rxjs/operators';
import { AppUser, UserRole } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  user$: Observable<AppUser | null> = authState(this.auth).pipe(
    switchMap(fbUser => {
      if (fbUser) {
        return (docData(doc(this.firestore, `Users/${fbUser.uid}`) as any) as Observable<AppUser>).pipe(
          map(user => user ? { ...user, uid: fbUser.uid } : null)
        );
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  async signup(email: string, pass: string, name: string, role: UserRole = 'Patient') {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    const user: AppUser = {
      uid: credential.user.uid,
      email,
      displayName: name,
      role,
      createdAt: new Date()
    };
    return this.saveUser(user);
  }

  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async googleLogin(role: UserRole = 'Patient') {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    const fbUser = credential.user;
    
    // Check if user exists, if not save with role
    const userDoc = await (docData(doc(this.firestore, `Users/${fbUser.uid}`) as any) as Observable<AppUser>).pipe(take(1)).toPromise();
    
    if (!userDoc) {
      const user: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email!,
        displayName: fbUser.displayName!,
        photoURL: fbUser.photoURL!,
        role,
        createdAt: new Date()
      };
      await this.saveUser(user);
    }
  }

  private saveUser(user: AppUser) {
    const userRef = doc(this.firestore, `Users/${user.uid}`);
    return setDoc(userRef, user, { merge: true });
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/']);
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const user = await this.user$.pipe(take(1)).toPromise();
    return user || null;
  }
}
