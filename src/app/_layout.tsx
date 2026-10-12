import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '@/lib/react-query';

export default function RootLayout() {
  return (
    <QueryProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#F8FAFC' },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Inicio',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryProvider>
  );
}
