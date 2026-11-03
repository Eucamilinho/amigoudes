export type RideTabFilter = 'today' | 'history';

export interface PassengerInRide {
  id: string;
  name: string;
  faculty: string;
  pickupShort: string;
  phone: string;
}

export interface RideRequest {
  id: string;
  name: string;
  faculty: string;
  pickupShort: string;
  time: string;
  phone: string;
  rating: number;
}

export interface ActiveRide {
  id: string;
  isActive: boolean;
  time: string;
  originShort: string;
  destinationShort: string;
  driverName?: string;
  driverCar?: string;
  plate?: string;
  driverPhone?: string;
  driverRating?: number;
  pickupPoint?: string;
  statusStep?: 'confirmed' | 'on_the_way' | 'arrived';
  note?: string;
  departureEstimateMin?: number;
  totalSeats: number;
  occupiedSeats: number;
  contribution: string;
  contributionAmount: number;
  passengers: PassengerInRide[];
}

export interface RideHistoryItem {
  id: string;
  date: string;
  destinationShort: string;
  originShort: string;
  companion: string;
  contribution: string;
  status: 'Completado' | 'Cancelado';
}
