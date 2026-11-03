import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Navigation } from 'lucide-react-native';
import { Icon } from '@/components/ui';

export type TrafficStatus = 'fluid' | 'moderate' | 'congested';

interface CorridorTrafficData {
  status: TrafficStatus;
  summaryText: string;
  badgeText: string;
  dotColorClass: string;
  pulseColorClass: string;
  details: {
    sector: string;
    estTime: string;
    description: string;
  }[];
}

const TRAFFIC_CONFIGS: Record<TrafficStatus, CorridorTrafficData> = {
  fluid: {
    status: 'fluid',
    summaryText: 'Corredor UDES: Fluido · ~12 min a Lagos',
    badgeText: 'EN VIVO',
    dotColorClass: 'bg-emerald-500',
    pulseColorClass: 'bg-emerald-500/30',
    details: [
      {
        sector: 'Cabecera ➔ Lagos',
        estTime: '12 min',
        description: 'Vía Pan de Azúcar fluida y despejada.',
      },
      {
        sector: 'Cañaveral ➔ Lagos',
        estTime: '15 min',
        description: 'Viaducto García Cadena con tránsito normal.',
      },
      {
        sector: 'Real de Minas ➔ Lagos',
        estTime: '18 min',
        description: 'Paso continuo por La Rosita y El Cacique.',
      },
    ],
  },
  moderate: {
    status: 'moderate',
    summaryText: 'Tráfico moderado en La Flora · +6 min demora',
    badgeText: 'MODERADO',
    dotColorClass: 'bg-amber-500',
    pulseColorClass: 'bg-amber-500/30',
    details: [
      {
        sector: 'Cabecera ➔ Lagos',
        estTime: '18 min (+6m)',
        description: 'Concurrencia vehicular en Viaducto La Flora.',
      },
      {
        sector: 'Cañaveral ➔ Lagos',
        estTime: '20 min (+5m)',
        description: 'Flujo continuo con reducción de carril en tramo sur.',
      },
      {
        sector: 'Real de Minas ➔ Lagos',
        estTime: '22 min (+4m)',
        description: 'Ciclos de semáforo lentos hacia El Cacique.',
      },
    ],
  },
  congested: {
    status: 'congested',
    summaryText: 'Paso lento en subida El Cacique · Sal con tiempo',
    badgeText: 'LENTO',
    dotColorClass: 'bg-destructive',
    pulseColorClass: 'bg-destructive/30',
    details: [
      {
        sector: 'Cabecera ➔ Lagos',
        estTime: '26 min (+14m)',
        description: 'Fuerte congestión en subida Pan de Azúcar.',
      },
      {
        sector: 'Cañaveral ➔ Lagos',
        estTime: '24 min (+9m)',
        description: 'Retención de tráfico sobre puente Provenza.',
      },
      {
        sector: 'Real de Minas ➔ Lagos',
        estTime: '28 min (+10m)',
        description: 'Desvío recomendado por Transversal Oriental.',
      },
    ],
  },
};

export interface CorridorStatusPillProps {
  className?: string;
  initialStatus?: TrafficStatus;
}

export const CorridorStatusPill: React.FC<CorridorStatusPillProps> = ({
  className = '',
  initialStatus = 'fluid',
}) => {
  const [currentStatus] = useState<TrafficStatus>(initialStatus);
  const config = TRAFFIC_CONFIGS[currentStatus];
  const reducedMotion = useReducedMotion();

  // Animación de pulso continuo (UI Thread a 60 FPS)
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.7);

  useEffect(() => {
    if (reducedMotion) return;

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 1100 }),
        withTiming(1, { duration: 1100 })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.1, { duration: 1100 }),
        withTiming(0.7, { duration: 1100 })
      ),
      -1,
      true
    );
  }, [pulseScale, pulseOpacity, reducedMotion]);

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) return { opacity: 0 };
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: pulseOpacity.value,
    };
  });

  const handlePress = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }

    const message = config.details
      .map((d) => `• ${d.sector}: ${d.estTime}\n  ${d.description}`)
      .join('\n\n');

    Alert.alert(
      'Corredor Universitario UDES',
      `Reporte de accesos en tiempo real hacia Campus Lagos del Cacique:\n\n${message}`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${config.summaryText}. Toca para ver reporte de sectores.`}
      onPress={handlePress}
      className={`h-[34px] px-3 bg-canvas/60 rounded-pill border border-hairline flex-row items-center justify-between active:bg-hairline/40 ${className}`.trim()}
    >
      {/* Izquierda: Dot animado con pulso + Ícono Navigation */}
      <View className="flex-row items-center gap-1.5 shrink-0">
        <View className="w-2.5 h-2.5 items-center justify-center relative">
          <Animated.View
            style={pulseAnimatedStyle}
            className={`w-2.5 h-2.5 rounded-full absolute ${config.pulseColorClass}`}
          />
          <View className={`w-2 h-2 rounded-full ${config.dotColorClass}`} />
        </View>
        <Icon icon={Navigation} size="xs" color="mid-gray" />
      </View>

      {/* Centro: Texto glanceable en 1 línea */}
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        className="flex-1 font-medium text-[11px] text-ink-soft mx-2"
      >
        {config.summaryText}
      </Text>

      {/* Derecha: Badge mini en vivo */}
      <View className="px-1.5 py-0.5 rounded-md bg-paper border border-hairline shrink-0">
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
          className="text-[9px] font-bold text-mid-gray uppercase tracking-wider"
        >
          {config.badgeText}
        </Text>
      </View>
    </Pressable>
  );
};
