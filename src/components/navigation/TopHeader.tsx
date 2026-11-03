import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, Sun, Moon } from 'lucide-react-native';
import { AppLogo, Icon } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/hooks/useTheme';

export interface TopHeaderProps {
  title?: string;
  isHome?: boolean;
  onPressProfile?: () => void;
  className?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  isHome = false,
  onPressProfile,
  className = '',
}) => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { isDark, toggleColorScheme } = useTheme();

  const themeToggleNode = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onPress={toggleColorScheme}
      className="w-8 h-8 rounded-full bg-paper border border-hairline items-center justify-center active:bg-hairline shadow-xs"
    >
      <Icon icon={isDark ? Sun : Moon} size="xs" color="mid-gray" />
    </Pressable>
  );

  return (
    <View
      style={{ paddingTop: insets.top + 4 }}
      className={`px-4 pb-2.5 bg-canvas border-b border-hairline/60 ${className}`.trim()}
    >
      <View className="flex-row items-center justify-between min-h-[40px]">
        {isHome ? (
          <>
            {/* Izquierda: Logotipo compacto AmigoUDES con isotipo de 28px */}
            <View className="flex-row items-center gap-2">
              <AppLogo size="sm" customSize={28} showText={false} />
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className="text-[17px] font-bold text-ink tracking-tight"
              >
                Amigo<Text className="text-primary">UDES</Text>
              </Text>
            </View>

            {/* Derecha: Toggle de tema + Píldora de usuario */}
            <View className="flex-row items-center gap-2">
              {themeToggleNode}
              {user ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Perfil de ${user.fullName}, calificación ${user.ratingAvg.toFixed(1)}`}
                  onPress={onPressProfile}
                  className="flex-row items-center gap-1.5 bg-paper border border-hairline px-2.5 py-1 rounded-pill active:bg-hairline shadow-xs"
                >
                  <View className="w-5 h-5 rounded-full bg-primary-soft items-center justify-center">
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[10px] font-bold text-primary"
                    >
                      {user.fullName.charAt(0)}
                    </Text>
                  </View>
                  <Icon icon={Star} size="xs" color="primary" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[11px] font-semibold text-ink"
                  >
                    {user.ratingAvg.toFixed(1)}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </>
        ) : (
          /* Pantallas secundarias: Título tipográfico limpio y a la izquierda + Theme toggle */
          <View className="flex-row items-center justify-between w-full">
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className="text-[20px] font-bold text-ink tracking-tight"
            >
              {title}
            </Text>
            {themeToggleNode}
          </View>
        )}
      </View>
    </View>
  );
};
