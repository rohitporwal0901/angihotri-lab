export interface ActiveTracking {
  bookingId: string;
  technicianId: string;
  lat: number;
  lng: number;
  bearing: number;
  lastUpdated: number; // UTC timestamp
}
