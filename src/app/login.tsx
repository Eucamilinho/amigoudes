import React, { useState } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  ChevronLeft,
  Mail,
  Lock,
  User,
  Car,
} from 'lucide-react-native';
import {
  AppLogo,
  Button,
  Icon,
  Input,
  ScreenContainer,
} from '@/components/ui';
import { loginSchema, useAuthStore } from '@/features/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('v.rodriguez@udes.edu.co');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const login = useAuthStore((state) => state.login);
  const loginAsDemo = useAuthStore((state) => state.loginAsDemo);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async () => {
    setErrors({});
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === 'email') fieldErrors.email = issue.message;
        if (issue.path[0] === 'password') fieldErrors.password = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const success = await login(result.data);
    if (success) {
      router.replace('/');
    } else {
      Alert.alert('Error de acceso', 'No fue posible validar tu ingreso en este momento.');
    }
  };

  const handleDemoLogin = (role: 'passenger' | 'driver') => {
    loginAsDemo(role);
    router.replace('/');
  };

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1 justify-between py-2">
        {/* Barra Superior con botón atrás limpio */}
        <Animated.View
          entering={FadeIn.duration(400)}
          className="flex-row items-center justify-start mb-2 pt-1"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.replace('/welcome')}
            className="w-11 h-11 items-center justify-center rounded-pill bg-paper border border-hairline shadow-xs active:bg-hairline"
          >
            <Icon icon={ChevronLeft} size="md" color="ink" />
          </Pressable>
        </Animated.View>

        {/* Hero Central con Logo e Identidad */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          className="items-center my-auto"
        >
          <AppLogo size="md" showText={false} />

          <Text className="text-[24px] leading-[30px] font-bold text-ink tracking-tight mt-4 mb-1 text-center">
            Iniciar sesión
          </Text>
          <Text className="text-[14px] leading-[20px] text-mid-gray text-center mb-6">
            Acceso con tu correo @udes.edu.co
          </Text>

          {/* Formulario */}
          <View className="w-full gap-4 max-w-[360px]">
            <Input
              label="Correo"
              placeholder="nombre@udes.edu.co"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              leftIcon={<Icon icon={Mail} size="sm" color="mid-gray" />}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              leftIcon={<Icon icon={Lock} size="sm" color="mid-gray" />}
            />

            <View className="pt-2">
              <Button
                label="Entrar"
                onPress={handleSubmit}
                variant="primary"
                loading={isLoading}
                fullWidth
              />
            </View>
          </View>
        </Animated.View>

        {/* Acciones Inferiores (Demo sutil y Enlace a Registro) */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify()}
          className="gap-3 pb-1"
        >
          {/* Acceso demo sutil en una sola fila */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-[12px] text-mid-gray">Demo:</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entrar como Valentina (Pasajera)"
              onPress={() => handleDemoLogin('passenger')}
              className="min-h-[44px] flex-row items-center gap-1.5 py-1.5 px-3 rounded-pill bg-paper border border-hairline active:bg-hairline"
            >
              <Icon icon={User} size="sm" color="primary" />
              <Text className="text-[12px] font-medium text-ink">Valentina</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entrar como Carlos (Conductor)"
              onPress={() => handleDemoLogin('driver')}
              className="min-h-[44px] flex-row items-center gap-1.5 py-1.5 px-3 rounded-pill bg-paper border border-hairline active:bg-hairline"
            >
              <Icon icon={Car} size="sm" color="primary" />
              <Text className="text-[12px] font-medium text-ink">Carlos</Text>
            </Pressable>
          </View>

          {/* Enlace a Registro */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-mid-gray text-[13px]">¿No tienes cuenta?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/register')}
              className="py-1 px-1"
            >
              <Text className="text-primary font-semibold text-[13px]">Regístrate</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}
