import React from 'react';
import { Image, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  customSize?: number;
  showText?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  customSize,
  showText = true,
  orientation = 'vertical',
  className = '',
  style,
}) => {
  const dimensions = {
    sm: { iconSize: 36, textSize: 'text-[16px] leading-[22px]', captionSize: 'text-[11px]' },
    md: { iconSize: 52, textSize: 'text-[20px] leading-[26px]', captionSize: 'text-[12px]' },
    lg: { iconSize: 72, textSize: 'text-[26px] leading-[32px]', captionSize: 'text-[13px]' },
    xl: { iconSize: 96, textSize: 'text-[32px] leading-[38px]', captionSize: 'text-[14px]' },
    '2xl': { iconSize: 136, textSize: 'text-[36px] leading-[42px]', captionSize: 'text-[15px]' },
  }[size];

  const iconPixelSize = customSize ?? dimensions.iconSize;

  const logoImage = require('../../../assets/brand/logo.png');

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Logotipo AmigoUDES"
      className={`items-center justify-center ${
        orientation === 'horizontal' ? 'flex-row gap-3' : 'flex-col gap-2'
      } ${className}`.trim()}
      style={style}
    >
      <View className="rounded-3xl overflow-hidden bg-primary-soft p-1 border border-primary/20">
        <Image
          source={logoImage}
          style={{ width: iconPixelSize, height: iconPixelSize }}
          resizeMode="contain"
        />
      </View>

      {showText ? (
        <View className={orientation === 'horizontal' ? 'items-start' : 'items-center'}>
          <Text className={`font-semibold text-ink tracking-tight ${dimensions.textSize}`}>
            Amigo<Text className="text-primary">UDES</Text>
          </Text>
          <Text className={`text-mid-gray font-normal ${dimensions.captionSize}`}>
            Carpooling Universitario
          </Text>
        </View>
      ) : null}
    </View>
  );
};
