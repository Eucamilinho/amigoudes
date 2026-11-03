import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Compass, Map, Users, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type DashboardTabId = 'rides' | 'explore' | 'activity' | 'profile';

export interface DashboardTabBarProps {
  activeTab: DashboardTabId;
  onTabChange: (tab: DashboardTabId) => void;
  pendingRequestsCount?: number;
  className?: string;
}

interface TabConfig {
  id: DashboardTabId;
  label: string;
  IconComponent: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  badgeCount?: number;
}

export const DashboardTabBar: React.FC<DashboardTabBarProps> = ({
  activeTab,
  onTabChange,
  pendingRequestsCount = 0,
  className = '',
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 10);

  const tabs: TabConfig[] = [
    {
      id: 'rides',
      label: 'Viajes',
      IconComponent: Compass,
    },
    {
      id: 'explore',
      label: 'Explorar',
      IconComponent: Map,
    },
    {
      id: 'activity',
      label: 'Actividad',
      IconComponent: Users,
      badgeCount: pendingRequestsCount,
    },
    {
      id: 'profile',
      label: 'Perfil',
      IconComponent: User,
    },
  ];

  return (
    <View
      style={{ paddingBottom: bottomPadding }}
      className={`w-full bg-paper border-t border-hairline shadow-md pt-2 px-3 ${className}`.trim()}
    >
      <View className="flex-row items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const { IconComponent } = tab;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Pestaña ${tab.label}`}
              onPress={() => onTabChange(tab.id)}
              className="flex-1 min-h-[48px] items-center justify-center py-1 relative active:opacity-70"
            >
              {/* Contenedor del ícono con badge si aplica */}
              <View className="relative items-center justify-center">
                <View
                  className={`w-10 h-8 rounded-pill items-center justify-center transition-all ${
                    isActive ? 'bg-primary-soft' : 'bg-transparent'
                  }`}
                >
                  <IconComponent
                    size={20}
                    color={isActive ? '#2563EB' : '#737373'}
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                </View>

                {/* Badge indicador de solicitudes pendientes */}
                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <View
                    style={{ position: 'absolute', top: -2, right: 0 }}
                    className="w-4 h-4 rounded-full bg-primary items-center justify-center border border-paper"
                  >
                    <Text className="text-[9px] font-bold text-white leading-none">
                      {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Etiqueta textual */}
              <Text
                className={`text-[11px] mt-1 tracking-tight ${
                  isActive ? 'font-bold text-primary' : 'font-medium text-mid-gray'
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
