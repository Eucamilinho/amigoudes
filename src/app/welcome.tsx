import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  User,
  Car,
} from 'lucide-react-native';
import {
  AppLogo,
  Button,
  Icon,
  ScreenContainer,
} from '@/components/ui';
import { useAuthStore } from '@/features/auth';

export default function WelcomeScreen() {
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);

  const handleQuickDemo = (role: 'passenger' | 'driver') => {
    loginAsDemo(role);
    router.replace('/');
  };

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1 justify-between py-6">
        {/* Hero Central Ultra-Minimalista con Logo Destacado */}
        <Animated.View
          entering={FadeInDown.delay(120).duration(600).springify()}
          className="items-center justify-center my-auto"
        >
          <AppLogo size="2xl" customSize={150} showText={false} />
        </Animated.View>

        {/* Acciones Inferiores (Sin Scroll, 1 Botón Primario) */}
        <Animated.View
          entering={FadeInUp.delay(220).duration(600).springify()}
          className="gap-2.5 pb-2"
        >
          <Button
            label="Crear cuenta"
            onPress={() => router.push('/register')}
            variant="primary"
            fullWidth
          />

          <Button
            label="Entrar"
            onPress={() => router.push('/login')}
            variant="secondary"
            fullWidth
          />

          {/* Acceso demo sutil y directo con íconos */}
          <View className="flex-row items-center justify-center gap-2 pt-2">
            <Text className="text-[12px] text-mid-gray">Demo:</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Probar como pasajero"
              onPress={() => handleQuickDemo('passenger')}
              className="min-h-[44px] flex-row items-center gap-1.5 py-1.5 px-3 rounded-pill bg-canvas border border-hairline active:bg-hairline"
            >
              <Icon icon={User} size="sm" color="primary" />
              <Text className="text-[12px] font-medium text-ink">Pasajero</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Probar como conductor"
              onPress={() => handleQuickDemo('driver')}
              className="min-h-[44px] flex-row items-center gap-1.5 py-1.5 px-3 rounded-pill bg-canvas border border-hairline active:bg-hairline"
            >
              <Icon icon={Car} size="sm" color="primary" />
              <Text className="text-[12px] font-medium text-ink">Conductor</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}
