export type UniversityRole = 'estudiante' | 'docente' | 'administrativo';

export interface Vehicle {
  make: string;
  model: string;
  color: string;
  plate: string;
  seats: number;
}

export interface UserRoutine {
  originSector: string;
  originAddress?: string;
  campusName: string;
  destinationAddress?: string;
  days: string[];
  arrivalTime: string;
  departureTime?: string;
  toleranceMin: 15 | 30 | 45;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  universityRole: UniversityRole;
  faculty: string;
  phone: string;
  isPassenger: boolean;
  isDriver: boolean;
  activeRole: 'passenger' | 'driver';
  ratingAvg: number;
  ridesCount: number;
  verified: boolean;
  vehicle?: Vehicle;
  routine: UserRoutine;
}
