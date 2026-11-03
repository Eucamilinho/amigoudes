import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Car } from 'lucide-react-native';
import {
  Icon,
  ScreenContainer,
  SegmentedToggle,
} from '@/components/ui';
import {
  RidesTabView,
  ExploreTabView,
  ActivityTabView,
  ProfileTabView,
  RoutineQuickActionWidget,
  CorridorStatusPill,
  CommunityDemandThermometer,
  type DashboardTabId,
  type ActiveRideState,
  type BookingRequest,
} from '@/components/dashboard';
import { TopHeader, AppTabBar } from '@/components/navigation';
import { useAuthStore } from '@/features/auth';
import type { AppRole } from '@/types/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const switchActiveRole = useAuthStore((state) => state.switchActiveRole);

  const activeRole: AppRole = user?.activeRole ?? 'passenger';

  const [activeTab, setActiveTab] = useState<DashboardTabId>('rides');

  // Estado del viaje activo compartido entre pestañas
  const [activeRide, setActiveRide] = useState<ActiveRideState>({
    isPublished: false,
    timeSlot: '6:30 am',
    availableSeats: user?.vehicle?.seats ?? 3,
    totalSeats: user?.vehicle?.seats ?? 3,
    confirmedPassengers: [],
    driverName: 'Ing. Carlos Flórez',
    driverCar: 'Chevrolet Onix Gris (UDE-482)',
  });

  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(2);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/welcome');
    }
  }, [isAuthenticated, user]);

  const handleRoleChange = (role: AppRole) => {
    switchActiveRole(role);
  };

  const handleBookRide = (driverName: string, timeSlot: string = '6:30 am') => {
    setActiveRide({
      isPublished: true,
      timeSlot,
      availableSeats: 0,
      totalSeats: 3,
      confirmedPassengers: [],
      driverName,
      driverCar: 'Chevrolet Onix LT (Gris)',
    });
    // Llevar al usuario a la pestaña de Actividad para coordinar
    setActiveTab('activity');
  };

  const handleAcceptRequest = (req: BookingRequest) => {
    setPendingRequestsCount((prev) => Math.max(0, prev - 1));
    setActiveRide((prev) => ({
      ...prev,
      availableSeats: Math.max(0, prev.availableSeats - 1),
      confirmedPassengers: [
        ...prev.confirmedPassengers,
        {
          id: req.id,
          name: req.name,
          faculty: req.faculty,
          pickupPoint: req.pickupPoint,
          phone: req.phone,
        },
      ],
    }));
  };

  const handleRejectRequest = () => {
    setPendingRequestsCount((prev) => Math.max(0, prev - 1));
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const isHomeTab = activeTab === 'rides';
  const getHeaderTitle = () => {
    if (activeTab === 'explore') return activeRole === 'driver' ? 'Publicar ruta' : 'Buscar ruta';
    if (activeTab === 'activity') return 'Mis viajes';
    if (activeTab === 'profile') return 'Tu perfil';
    return undefined;
  };

  return (
    <ScreenContainer scrollable={false} padded={false} edges={['top']}>
      <View className="flex-1 bg-canvas">
        {/* Cabecera Limpia Contextual */}
        <TopHeader
          isHome={isHomeTab}
          title={getHeaderTitle()}
          onPressProfile={() => setActiveTab('profile')}
        />

        {/* Área de Contenido con Scroll de la Pestaña Activa */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 84 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Píldora: Estado del Corredor Universitario en tiempo real */}
          {isHomeTab && <CorridorStatusPill />}

          {/* El toggle de rol se renderiza EXCLUSIVAMENTE dentro del contenido de Inicio */}
          {isHomeTab && (
            <View className="mb-4">
              <SegmentedToggle<AppRole>
                value={activeRole}
                onChange={handleRoleChange}
                options={[
                  {
                    value: 'passenger',
                    label: 'Modo Pasajero',
                    icon: (
                      <Icon
                        icon={User}
                        size="sm"
                        color={activeRole === 'passenger' ? 'primary' : 'mid-gray'}
                      />
                    ),
                  },
                  {
                    value: 'driver',
                    label: 'Modo Conductor',
                    icon: (
                      <Icon
                        icon={Car}
                        size="sm"
                        color={activeRole === 'driver' ? 'primary' : 'mid-gray'}
                      />
                    ),
                  },
                ]}
              />
            </View>
          )}

          {/* Termómetro de Demanda Comunitaria */}
          {isHomeTab && <CommunityDemandThermometer />}

          {activeTab === 'rides' && (
            <>
              <RoutineQuickActionWidget />
              <RidesTabView />
            </>
          )}

          {activeTab === 'explore' && (
            <ExploreTabView
              activeRole={activeRole}
              initialSectorName={user.routine?.originSector ?? 'Cabecera'}
              onBookRide={handleBookRide}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityTabView
              activeRole={activeRole}
              confirmedCount={activeRide.confirmedPassengers.length}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
            />
          )}

          {activeTab === 'profile' && <ProfileTabView />}
        </ScrollView>

        {/* Navbar Inferior: Floating Island */}
        <AppTabBar
          activeTab={
            activeTab === 'rides'
              ? 'home'
              : activeTab === 'explore'
              ? activeRole === 'driver'
                ? 'publish'
                : 'search'
              : activeTab === 'activity'
              ? 'rides'
              : 'profile'
          }
          onTabChange={(tabId) => {
            if (tabId === 'home') setActiveTab('rides');
            else if (tabId === 'search' || tabId === 'publish') setActiveTab('explore');
            else if (tabId === 'rides') setActiveTab('activity');
            else if (tabId === 'profile') setActiveTab('profile');
          }}
          pendingRequestsCount={activeRole === 'driver' ? pendingRequestsCount : 0}
        />
      </View>
    </ScreenContainer>
  );
}
