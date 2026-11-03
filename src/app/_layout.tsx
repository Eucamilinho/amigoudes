import '../../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/lib/react-query';

import { useTheme } from '@/hooks/useTheme';

function RootNavigation() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Inicio',
          }}
        />
        <Stack.Screen
          name="welcome"
          options={{
            title: 'Bienvenida',
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Iniciar Sesión',
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Registro',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <RootNavigation />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
