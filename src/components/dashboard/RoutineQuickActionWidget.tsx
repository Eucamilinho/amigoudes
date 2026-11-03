import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Sparkles, Plus, Search } from 'lucide-react-native';
import { Icon } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useRideStore } from '@/features/rides';

export interface RoutineQuickActionWidgetProps {
  className?: string;
}

export const RoutineQuickActionWidget: React.FC<RoutineQuickActionWidgetProps> = ({
  className = '',
}) => {
  const user = useAuthStore((s) => s.user);
  const activeRole = user?.activeRole ?? 'passenger';
  const isDriver = activeRole === 'driver';

  const driverRide = useRideStore((s) => s.driverRide);
  const passengerRide = useRideStore((s) => s.passengerRide);
  const publishDriverRide = useRideStore((s) => s.publishDriverRide);
  const requestPassengerRide = useRideStore((s) => s.requestPassengerRide);

  // Detectar si el usuario ya tiene un viaje activo hoy (se oculta automáticamente)
  const hasActiveRide = isDriver ? driverRide.isActive : passengerRide.isActive;

  if (!user || hasActiveRide) {
    return null;
  }

  const originSector = user.routine?.originSector ?? (isDriver ? 'Cañaveral' : 'Cabecera');
  const shortOrigin = originSector.split('(')[0]?.trim() || originSector;
  const arrivalTime = user.routine?.arrivalTime ?? '6:30 am';

  const handleQuickAction = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }

    if (isDriver) {
      const seats = user.vehicle?.seats ?? 3;
      publishDriverRide(arrivalTime, seats, shortOrigin);
      Alert.alert(
        'Ruta publicada',
        `Se han habilitado ${seats} cupos para las ${arrivalTime} hacia Campus Lagos.`
      );
    } else {
      requestPassengerRide(arrivalTime, shortOrigin);
      Alert.alert(
        'Viaje conectado',
        `Solicitud enviada para las ${arrivalTime} desde ${shortOrigin} hacia Campus Lagos.`
      );
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      className={`h-[62px] bg-paper border-2 border-primary/30 rounded-2xl px-4 py-2.5 shadow-xs flex-row items-center justify-between mb-4 ${className}`.trim()}
    >
      {/* Lado izquierdo: Ícono de destello + Textos en 2 líneas */}
      <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
        <View className="w-8 h-8 rounded-full bg-primary-soft items-center justify-center shrink-0">
          <Icon icon={Sparkles} size="xs" color="primary" />
        </View>

        <View className="flex-1 min-w-0 justify-center">
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            className="text-[13px] font-bold text-ink leading-tight"
          >
            Ruta habitual de hoy
          </Text>
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            className="text-[11px] font-medium text-mid-gray mt-0.5"
          >
            {shortOrigin} ➔ Lagos · {arrivalTime}
          </Text>
        </View>
      </View>

      {/* Lado derecho: Botón primario compacto en 1 toque */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isDriver
            ? `Publicar en 1 tap cupos para las ${arrivalTime}`
            : `Ver cupos disponibles para las ${arrivalTime}`
        }
        onPress={handleQuickAction}
        className="h-9 px-3.5 rounded-pill bg-primary active:bg-primary-pressed items-center justify-center shadow-xs flex-row gap-1.5 shrink-0"
      >
        <Icon icon={isDriver ? Plus : Search} size="xs" color="white" />
        <Text
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          className="text-[12px] font-bold text-white"
        >
          {isDriver ? 'Publicar' : 'Ver 3 cupos'}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
