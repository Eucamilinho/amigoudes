import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileTabView } from '@/components/dashboard';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 10) + 70;

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="p-4"
      contentContainerStyle={{ paddingBottom: bottomInset }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ProfileTabView />
    </ScrollView>
  );
}
