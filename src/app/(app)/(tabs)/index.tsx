import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { User, Car, Navigation, Sparkles, Search } from 'lucide-react-native';
import {
  Icon,
  ScreenContainer,
  SegmentedToggle,
} from '@/components/ui';
import {
  CorridorStatusPill,
  RequestCarFlowModal,
} from '@/components/dashboard';
import { TopHeader } from '@/components/navigation';
import { useAuthStore } from '@/features/auth';
import { useRideStore } from '@/features/rides';
import { showAlert } from '@/lib/alert';
import type { AppRole } from '@/types/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const switchActiveRole = useAuthStore((s) => s.switchActiveRole);
  const passengerRide = useRideStore((s) => s.passengerRide);
  const driverRide = useRideStore((s) => s.driverRide);
  const publishDriverRide = useRideStore((s) => s.publishDriverRide);

  const [isRequestCarModalOpen, setIsRequestCarModalOpen] = useState(false);

  const activeRole: AppRole = user?.activeRole ?? 'passenger';
  const isDriver = activeRole === 'driver';

  const handleRoleChange = (role: AppRole) => {
    switchActiveRole(role);
  };

  const hasActiveRide = isDriver ? driverRide.isActive : passengerRide.isActive;
  const originSector = user?.routine?.originSector ?? (isDriver ? 'Cañaveral' : 'Cabecera del Llano');
  const shortOrigin = originSector.split('(')[0]?.trim() || originSector;
  const arrivalTime = user?.routine?.arrivalTime ?? '6:30 am';

  const primaryButtonLabel = hasActiveRide
    ? 'Ver mi viaje activo'
    : isDriver
    ? `Publicar cupos para las ${arrivalTime}`
    : `Buscar viaje para las ${arrivalTime}`;

  const handlePrimaryAction = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }

    if (hasActiveRide) {
      router.push('/(app)/(tabs)/viajes');
      return;
    }

    if (isDriver) {
      const seats = user?.vehicle?.seats ?? 3;
      publishDriverRide(arrivalTime, seats, shortOrigin);
      showAlert(
        'Ruta publicada',
        `Se han habilitado ${seats} cupos para las ${arrivalTime} hacia Campus Lagos.`
      );
      return;
    }

    // Modo Pasajero: Abrir modal de solicitud interactiva con mapa
    setIsRequestCarModalOpen(true);
  };

  return (
    <ScreenContainer scrollable={false} padded={false} edges={['top']}>
      <View className="flex-1 bg-canvas">
        {/* Cabecera limpia contextual en Inicio */}
        <TopHeader
          isHome
          onPressProfile={() => router.push('/(app)/(tabs)/perfil')}
        />

        {/* Contenido con scroll espaciado */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-3"
          contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ━━━ SECCIÓN A: ENCABEZADO Y CONTEXTO RÁPIDO ━━━ */}
          <View className="mb-6">
            {/* 1. Selector de Rol (Modo Pasajero ↔ Modo Conductor) */}
            <SegmentedToggle<AppRole>
              value={activeRole}
              onChange={handleRoleChange}
              className="h-[48px] bg-canvas rounded-pill border border-hairline"
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

            {/* 2. Píldora de Tráfico Universitaria (Micro-chip integrado) */}
            <CorridorStatusPill className="mt-3" />
          </View>

          {/* ━━━ SECCIÓN B: TARJETA PRINCIPAL DEL DÍA (HERO CARD) ━━━ */}
          <View className="bg-paper border border-hairline rounded-3xl p-5 shadow-sm">
            {/* Fila Superior: Demanda / Prueba Social */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
                {/* Pila de 3 mini-avatares superpuestos */}
                <View className="flex-row items-center shrink-0">
                  <View className="w-6 h-6 rounded-full bg-primary-soft border-[1.5px] border-paper items-center justify-center z-30">
                    <Text
                      maxFontSizeMultiplier={1.2}
                      className="text-[10px] font-bold text-primary"
                    >
                      V
                    </Text>
                  </View>
                  <View className="w-6 h-6 rounded-full bg-primary/20 border-[1.5px] border-paper items-center justify-center -ml-1.5 z-20">
                    <Text
                      maxFontSizeMultiplier={1.2}
                      className="text-[10px] font-bold text-primary"
                    >
                      M
                    </Text>
                  </View>
                  <View className="w-6 h-6 rounded-full bg-primary border-[1.5px] border-paper items-center justify-center -ml-1.5 z-10">
                    <Text
                      maxFontSizeMultiplier={1.2}
                      className="text-[10px] font-bold text-white"
                    >
                      C
                    </Text>
                  </View>
                </View>

                {/* Texto de Demanda / Prueba Social */}
                <Text
                  maxFontSizeMultiplier={1.2}
                  numberOfLines={1}
                  className="font-bold text-[12px] text-ink flex-1 min-w-0"
                >
                  {isDriver
                    ? '18 compañeros buscan cupo hoy'
                    : '6 conductores en tu ruta hoy'}
                </Text>
              </View>

              {/* Chip pill sutil */}
              <View className="bg-primary-soft/60 px-2.5 py-1 rounded-pill border border-primary/20 shrink-0">
                <Text
                  maxFontSizeMultiplier={1.2}
                  className="text-[10px] font-semibold text-primary"
                >
                  {isDriver ? 'En tiempo real' : 'Desde 6:30 AM'}
                </Text>
              </View>
            </View>

            {/* Divisor sutil */}
            <View className="border-t border-hairline my-4" />

            {/* Fila Central: Tu Rutina Habitual */}
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary-soft items-center justify-center shrink-0">
                <Icon icon={Sparkles} size="sm" color="primary" />
              </View>

              <View className="flex-1 min-w-0">
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[15px] font-bold text-ink leading-tight"
                >
                  {shortOrigin} ──► Campus Lagos
                </Text>
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] text-mid-gray mt-1 leading-relaxed"
                >
                  Salida habitual {arrivalTime} · $2.500 COP solidario
                </Text>
              </View>
            </View>

            {/* Fila Inferior: ÚNICO Botón Primario Dominante */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={primaryButtonLabel}
              onPress={handlePrimaryAction}
              className="h-[50px] mt-4 rounded-pill bg-primary active:bg-primary-pressed items-center justify-center shadow-xs flex-row gap-2"
            >
              <Icon
                icon={hasActiveRide ? Navigation : isDriver ? Car : Search}
                size="sm"
                color="white"
              />
              <Text
                maxFontSizeMultiplier={1.3}
                className="text-[15px] font-bold text-white tracking-wide"
              >
                {primaryButtonLabel}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Modal Interactivo de Flujo para Pedir un Carro */}
        <RequestCarFlowModal
          visible={isRequestCarModalOpen}
          onClose={() => setIsRequestCarModalOpen(false)}
          onRideBooked={() => {
            router.push('/(app)/(tabs)/viajes');
          }}
        />
      </View>
    </ScreenContainer>
  );
}

