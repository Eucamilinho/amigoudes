import { create } from 'zustand';
import type {
  ActiveRide,
  RideHistoryItem,
  RideRequest,
  RideTabFilter,
} from '@/features/rides/types';

interface RideState {
  tabFilter: RideTabFilter;
  driverRide: ActiveRide;
  passengerRide: ActiveRide;
  pendingRequests: RideRequest[];
  history: RideHistoryItem[];

  // Acciones
  setTabFilter: (tab: RideTabFilter) => void;
  publishDriverRide: (time: string, seats: number, origin?: string) => void;
  cancelDriverRide: () => void;
  requestPassengerRide: (
    time: string,
    origin?: string,
    driverInfo?: {
      name?: string;
      car?: string;
      plate?: string;
      phone?: string;
      rating?: number;
      pickupPoint?: string;
      note?: string;
    }
  ) => void;
  updatePassengerRideStatus: (statusStep: 'confirmed' | 'on_the_way' | 'arrived') => void;
  cancelPassengerRide: () => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
}

const INITIAL_DRIVER_RIDE: ActiveRide = {
  id: 'drv-ride-1',
  isActive: true,
  time: '6:30 AM',
  originShort: 'Cañaveral',
  destinationShort: 'Campus Lagos',
  totalSeats: 3,
  occupiedSeats: 2,
  contribution: '$5.000',
  contributionAmount: 5000,
  passengers: [
    {
      id: 'pass-1',
      name: 'Valentina R.',
      faculty: 'Medicina',
      pickupShort: 'La Florida',
      phone: '3158924410',
    },
    {
      id: 'pass-2',
      name: 'Mateo G.',
      faculty: 'Ingeniería',
      pickupShort: 'C.C. Cañaveral',
      phone: '3184561122',
    },
  ],
};

const INITIAL_PASSENGER_RIDE: ActiveRide = {
  id: 'pass-ride-1',
  isActive: true,
  time: '6:30 AM',
  originShort: 'Cabecera',
  destinationShort: 'Campus Lagos',
  driverName: 'Carlos Mantilla',
  driverCar: 'Chevrolet Onix',
  plate: 'WKL-823',
  driverPhone: '3184567890',
  driverRating: 4.9,
  pickupPoint: 'Parque San Pío (Cra 33 con Calle 45)',
  statusStep: 'confirmed',
  departureEstimateMin: 15,
  totalSeats: 3,
  occupiedSeats: 2,
  contribution: '$2.500',
  contributionAmount: 2500,
  passengers: [],
};

const INITIAL_REQUESTS: RideRequest[] = [
  {
    id: 'req-101',
    name: 'Daniel Mantilla',
    faculty: 'Ing. Civil',
    pickupShort: 'Parque San Pío',
    time: '6:30 AM',
    phone: '3109876543',
    rating: 4.9,
  },
  {
    id: 'req-102',
    name: 'Mariana Castro',
    faculty: 'Fisioterapia',
    pickupShort: 'Cra 33 # 48',
    time: '6:30 AM',
    phone: '3123456789',
    rating: 5.0,
  },
];

const INITIAL_HISTORY: RideHistoryItem[] = [
  {
    id: 'hist-1',
    date: 'Ayer',
    originShort: 'Cabecera',
    destinationShort: 'Campus Lagos',
    companion: 'Carlos Mantilla',
    contribution: '$2.500',
    status: 'Completado',
  },
  {
    id: 'hist-2',
    date: '10 Oct',
    originShort: 'Cañaveral',
    destinationShort: 'Campus Lagos',
    companion: 'Andrea Rueda',
    contribution: '$2.500',
    status: 'Completado',
  },
  {
    id: 'hist-3',
    date: '08 Oct',
    originShort: 'Cabecera',
    destinationShort: 'Campus Lagos',
    companion: 'Daniel Mantilla',
    contribution: '$2.500',
    status: 'Completado',
  },
  {
    id: 'hist-4',
    date: '03 Oct',
    originShort: 'Provenza',
    destinationShort: 'Campus Lagos',
    companion: 'Felipe Duarte',
    contribution: '$2.500',
    status: 'Cancelado',
  },
];

export const useRideStore = create<RideState>((set, get) => ({
  tabFilter: 'today',
  driverRide: INITIAL_DRIVER_RIDE,
  passengerRide: INITIAL_PASSENGER_RIDE,
  pendingRequests: INITIAL_REQUESTS,
  history: INITIAL_HISTORY,

  setTabFilter: (tabFilter) => set({ tabFilter }),

  publishDriverRide: (time, seats, origin = 'Cabecera') => {
    set((state) => ({
      driverRide: {
        id: `drv-${Date.now()}`,
        isActive: true,
        time,
        originShort: origin,
        destinationShort: 'Campus Lagos',
        totalSeats: seats,
        occupiedSeats: 0,
        contribution: '$0',
        contributionAmount: 0,
        passengers: [],
      },
    }));
  },

  cancelDriverRide: () => {
    const { driverRide, history } = get();
    set({
      driverRide: {
        ...driverRide,
        isActive: false,
        occupiedSeats: 0,
        passengers: [],
      },
      history: [
        {
          id: `hist-${Date.now()}`,
          date: 'Hoy',
          originShort: driverRide.originShort,
          destinationShort: driverRide.destinationShort,
          companion: `${driverRide.occupiedSeats} pasajeros`,
          contribution: driverRide.contribution,
          status: 'Cancelado',
        },
        ...history,
      ],
    });
  },

  requestPassengerRide: (time, origin = 'Cabecera', driverInfo) => {
    set(() => ({
      passengerRide: {
        id: `pass-${Date.now()}`,
        isActive: true,
        time,
        originShort: origin,
        destinationShort: 'Campus Lagos',
        driverName: driverInfo?.name ?? 'Carlos Mantilla',
        driverCar: driverInfo?.car ?? 'Chevrolet Onix',
        plate: driverInfo?.plate ?? 'WKL-823',
        driverPhone: driverInfo?.phone ?? '3184567890',
        driverRating: driverInfo?.rating ?? 4.9,
        pickupPoint: driverInfo?.pickupPoint ?? 'Parque San Pío (Cra 33 con Calle 45)',
        statusStep: 'confirmed',
        departureEstimateMin: 15,
        note: driverInfo?.note,
        totalSeats: 3,
        occupiedSeats: 2,
        contribution: '$2.500',
        contributionAmount: 2500,
        passengers: [],
      },
    }));
  },

  updatePassengerRideStatus: (statusStep) => {
    set((state) => ({
      passengerRide: {
        ...state.passengerRide,
        statusStep,
      },
    }));
  },

  cancelPassengerRide: () => {
    const { passengerRide, history } = get();
    set({
      passengerRide: {
        ...passengerRide,
        isActive: false,
      },
      history: [
        {
          id: `hist-${Date.now()}`,
          date: 'Hoy',
          originShort: passengerRide.originShort,
          destinationShort: passengerRide.destinationShort,
          companion: passengerRide.driverName ?? 'Conductor',
          contribution: passengerRide.contribution,
          status: 'Cancelado',
        },
        ...history,
      ],
    });
  },

  acceptRequest: (id) => {
    const { pendingRequests, driverRide } = get();
    const req = pendingRequests.find((r) => r.id === id);
    if (!req) return;

    const newOccupied = Math.min(driverRide.totalSeats, driverRide.occupiedSeats + 1);
    const newContributionAmount = newOccupied * 2500;

    set({
      pendingRequests: pendingRequests.filter((r) => r.id !== id),
      driverRide: {
        ...driverRide,
        occupiedSeats: newOccupied,
        contribution: `$${newContributionAmount.toLocaleString('es-CO')}`,
        contributionAmount: newContributionAmount,
        passengers: [
          ...driverRide.passengers,
          {
            id: req.id,
            name: req.name,
            faculty: req.faculty,
            pickupShort: req.pickupShort,
            phone: req.phone,
          },
        ],
      },
    });
  },

  rejectRequest: (id) => {
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== id),
    }));
  },
}));
