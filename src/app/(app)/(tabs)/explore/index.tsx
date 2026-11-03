import React from 'react';
import { ScrollView } from 'react-native';
import { ExploreTabView } from '@/components/dashboard';

export default function ExploreScreen() {
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="p-4"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ExploreTabView />
    </ScrollView>
  );
}
