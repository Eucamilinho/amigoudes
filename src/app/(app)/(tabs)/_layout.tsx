import React from 'react';
import { Tabs } from 'expo-router';
import { AppTabBar } from '@/components/navigation';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Buscar',
        }}
      />
      <Tabs.Screen
        name="viajes"
        options={{
          title: 'Mis viajes',
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
