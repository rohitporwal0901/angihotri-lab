import { LabTest } from './test.model';

export type BookingStatus = 'Pending' | 'Assigned' | 'In-Transit' | 'Collected' | 'Completed';

export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  tests: LabTest[];
  totalAmount: number;
  status: BookingStatus;
  address: {
    fullAddress: string;
    lat: number;
    lng: number;
    landmark?: string;
  };
  scheduledDate: string;
  scheduledSlot: string;
  technicianId?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}
