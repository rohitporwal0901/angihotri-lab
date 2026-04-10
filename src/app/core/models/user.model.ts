export type UserRole = 'Patient' | 'Technician' | 'Admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: any;
}
