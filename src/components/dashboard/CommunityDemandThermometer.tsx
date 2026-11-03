import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui';
import { useAuthStore } from '@/features/auth';

export interface CommunityDemandThermometerProps {
  className?: string;
  onPressAction?: () => void;
}

export const CommunityDemandThermometer: React.FC<CommunityDemandThermometerProps> = ({
  className = '',
  onPressAction,
}) => {
  const user = useAuthStore((s) => s.user);
  const activeRole = user?.activeRole ?? 'passenger';
  const isDriver = activeRole === 'driver';

  const handlePress = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }

    if (onPressAction) {
      onPressAction();
      return;
    }

    if (isDriver) {
      Alert.alert(
        'Compañeros en espera de cupo',
        '18 estudiantes buscan ruta hacia Campus Lagos para hoy:\n\n' +
          '• Valentina R. (Medicina · Cabecera)\n' +
          '• Mateo G. (Ing. Sistemas · Cañaveral)\n' +
          '• Daniel M. (Ing. Civil · San Pío)\n' +
          '• Mariana C. (Fisioterapia · Cra 33)\n\n' +
          'Tus cupos disponibles ayudan a descongestionar el corredor universitario.',
        [{ text: 'Entendido', style: 'default' }]
      );
    } else {
      Alert.alert(
        'Conductores verificados disponibles',
        '6 conductores con salidas hacia Campus Lagos en los próximos 30 min:\n\n' +
          '• Carlos Mantilla (Chevrolet Onix · 6:30 AM · Cabecera)\n' +
          '• Andrea Rueda (Mazda 2 · 6:45 AM · Cañaveral)\n' +
          '• Ing. Flórez (Renault Kwid · 7:00 AM · Provenza)\n\n' +
          'Comunidad 100% institucional con verificación universitaria.',
        [{ text: 'Entendido', style: 'default' }]
      );
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(180)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isDriver
            ? '18 estudiantes esperando cupo hacia Campus Lagos. Toca para ver detalles.'
            : '6 conductores verificados con salidas hacia Campus Lagos. Toca para ver detalles.'
        }
        onPress={handlePress}
        className={`h-[48px] bg-primary-soft/30 border border-primary/20 rounded-xl px-3 flex-row items-center justify-between mb-3.5 active:bg-primary-soft/50 ${className}`.trim()}
      >
        {/* Izquierda: Pila de 3 Avatares superpuestos de 24px */}
        <View className="flex-row items-center shrink-0 mr-2.5">
          <View className="w-6 h-6 rounded-full bg-primary-soft border-[1.5px] border-paper items-center justify-center z-30">
            <Text
              maxFontSizeMultiplier={1.2}
              className="text-[10px] font-bold text-primary"
            >
              V
            </Text>
          </View>
          <View className="w-6 h-6 rounded-full bg-primary/20 border-[1.5px] border-paper items-center justify-center -ml-2 z-20">
            <Text
              maxFontSizeMultiplier={1.2}
              className="text-[10px] font-bold text-primary"
            >
              M
            </Text>
          </View>
          <View className="w-6 h-6 rounded-full bg-primary border-[1.5px] border-paper items-center justify-center -ml-2 z-10">
            <Text
              maxFontSizeMultiplier={1.2}
              className="text-[10px] font-bold text-white"
            >
              C
            </Text>
          </View>
        </View>

        {/* Centro: Métrica directa según el rol activo */}
        <View className="flex-1 min-w-0 justify-center">
          <Text
            maxFontSizeMultiplier={1.2}
            numberOfLines={1}
            className="text-[12px] font-bold text-ink leading-tight"
          >
            {isDriver ? '18 estudiantes esperando' : '6 conductores verificados'}
          </Text>
          <Text
            maxFontSizeMultiplier={1.2}
            numberOfLines={1}
            className={`text-[10px] font-medium mt-0.5 ${
              isDriver ? 'text-mid-gray' : 'text-primary'
            }`}
          >
            {isDriver ? 'Medicina · Ingenierías' : 'Salidas desde 6:30 AM'}
          </Text>
        </View>

        {/* Derecha: Badge interactivo con flecha */}
        <View className="flex-row items-center gap-1 bg-paper px-2 py-1 rounded-pill border border-primary/20 shadow-2xs shrink-0 ml-2">
          <Text
            maxFontSizeMultiplier={1.2}
            numberOfLines={1}
            className="text-[10px] font-semibold text-primary"
          >
            {isDriver ? 'Ver lista' : 'Ver ruta'}
          </Text>
          <Icon icon={ChevronRight} size="xs" color="primary" />
        </View>
      </Pressable>
    </Animated.View>
  );
};
