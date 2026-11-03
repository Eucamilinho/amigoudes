import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  Keyboard,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useReducedMotion,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  House,
  Search,
  Route,
  CircleUser,
  CirclePlus,
} from 'lucide-react-native';
import { Icon } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useRideStore } from '@/features/rides';

export type NavTabId = 'home' | 'action' | 'rides' | 'profile';

export interface AppTabBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  pendingRequestsCount?: number;
  // Expo Router / React Navigation Props
  state?: any;
  descriptors?: any;
  navigation?: any;
  className?: string;
}

interface TabItemConfig {
  id: string;
  label: string;
  IconComponent: any;
  badge?: number;
  accessibilityLabel: string;
}

export const AppTabBar: React.FC<AppTabBarProps> = ({
  activeTab: propActiveTab,
  onTabChange,
  pendingRequestsCount: propPendingCount,
  state,
  navigation,
  className = '',
}) => {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const user = useAuthStore((s) => s.user);
  const activeRole = user?.activeRole ?? 'passenger';
  const pendingRequests = useRideStore((s) => s.pendingRequests);

  const pendingCount = propPendingCount ?? (activeRole === 'driver' ? pendingRequests.length : 0);

  // Determinar pestaña activa si se usa con Expo Router o como componente controlado
  const currentRouteName = state?.routes ? state.routes[state.index]?.name : undefined;
  const currentTab = propActiveTab ?? currentRouteName ?? 'home';

  // Ocultar al abrir el teclado en móviles
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Definición de las 4 pestañas según el rol activo
  const tabs: TabItemConfig[] = [
    {
      id: 'home',
      label: 'Inicio',
      IconComponent: House,
      accessibilityLabel: 'Inicio',
    },
    activeRole === 'driver'
      ? {
          id: 'publish',
          label: 'Publicar',
          IconComponent: CirclePlus,
          accessibilityLabel: 'Publicar cupo',
        }
      : {
          id: 'search',
          label: 'Buscar',
          IconComponent: Search,
          accessibilityLabel: 'Buscar viaje',
        },
    {
      id: 'rides',
      label: 'Mis viajes',
      IconComponent: Route,
      badge: activeRole === 'driver' ? pendingCount : 0,
      accessibilityLabel:
        pendingCount > 0
          ? `Mis viajes, ${pendingCount} solicitudes pendientes`
          : 'Mis viajes',
    },
    {
      id: 'profile',
      label: 'Perfil',
      IconComponent: CircleUser,
      accessibilityLabel: 'Perfil institucional',
    },
  ];

  // Medición de layout para el pill deslizante de Reanimated
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const pillX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const hasInitialized = useRef(false);

  const handleTabLayout = (id: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => ({
      ...prev,
      [id]: { x, width },
    }));
  };

  // Mover pill al cambiar de pestaña
  useEffect(() => {
    // Normalizar ID de pestaña para mapear 'explore' a 'search'/'publish', y 'activity'/'viajes' a 'rides'
    let mappedId = currentTab;
    if (currentTab === 'explore') mappedId = activeRole === 'driver' ? 'publish' : 'search';
    if (currentTab === 'viajes' || currentTab === 'activity') mappedId = 'rides';
    if (currentTab === 'index') mappedId = 'home';

    const layout = tabLayouts[mappedId] ?? tabLayouts[currentTab];
    if (layout) {
      const targetX = layout.x;
      const targetWidth = layout.width;

      if (!hasInitialized.current || reducedMotion) {
        pillX.value = targetX;
        pillWidth.value = targetWidth;
        hasInitialized.current = true;
      } else {
        pillX.value = withSpring(targetX, { damping: 18, stiffness: 180 });
        pillWidth.value = withSpring(targetWidth, { damping: 18, stiffness: 180 });
      }
    }
  }, [currentTab, tabLayouts, reducedMotion, activeRole, pillX, pillWidth]);

  const pillAnimatedStyle = useAnimatedStyle(() => {
    if (pillWidth.value === 0) return { opacity: 0 };
    return {
      transform: [{ translateX: pillX.value }],
      width: pillWidth.value,
      opacity: 1,
    };
  });

  const handlePressTab = useCallback(
    (tabId: string) => {
      // Haptic feedback seguro
      try {
        Haptics.selectionAsync().catch(() => {});
      } catch {
        // Ignorar en plataformas sin soporte
      }

      if (onTabChange) {
        onTabChange(tabId);
        return;
      }

      // Si se usa con React Navigation / Expo Router
      if (navigation && state) {
        const route = state.routes.find((r: any) => r.name === tabId);
        if (route) {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }
      }
    },
    [onTabChange, navigation, state]
  );

  if (isKeyboardVisible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 8,
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          },
          android: {
            elevation: 4,
          },
        }),
      }}
      className={`h-[64px] bg-paper rounded-[24px] border border-hairline px-2 justify-center ${className}`.trim()}
    >
      {/* Pill deslizante con Reanimated (UI Thread 60 FPS) */}
      <Animated.View
        style={pillAnimatedStyle}
        className="absolute top-[10px] h-[44px] bg-primary-soft rounded-[18px]"
      />

      {/* Ítems de la barra de navegación */}
      <View className="flex-row items-center justify-around h-full">
        {tabs.map((tab) => {
          let isActive =
            currentTab === tab.id ||
            (tab.id === 'rides' && (currentTab === 'viajes' || currentTab === 'activity')) ||
            (tab.id === 'home' && currentTab === 'index') ||
            (tab.id === 'search' && currentTab === 'explore') ||
            (tab.id === 'publish' && currentTab === 'explore');

          const { IconComponent } = tab;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.accessibilityLabel}
              onLayout={(e) => handleTabLayout(tab.id, e)}
              onPress={() => handlePressTab(tab.id)}
              className="flex-1 min-h-[48px] items-center justify-center py-1 relative active:opacity-75"
            >
              <View className="relative items-center justify-center">
                {/* Ícono Lucide Vector */}
                <Icon
                  icon={IconComponent}
                  size="md"
                  color={isActive ? 'primary' : 'mid-gray'}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />

                {/* Badge accesible en Mis viajes */}
                {tab.badge && tab.badge > 0 ? (
                  <Animated.View
                    entering={FadeIn.duration(150)}
                    exiting={FadeOut.duration(150)}
                    style={{ position: 'absolute', top: -4, right: -10 }}
                    className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary items-center justify-center border-2 border-paper shadow-xs"
                  >
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[10px] font-bold text-white leading-none"
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>

              {/* Etiqueta textual */}
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className={`text-[12px] mt-1 tracking-tight ${
                  isActive ? 'font-semibold text-primary' : 'font-medium text-mid-gray'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
