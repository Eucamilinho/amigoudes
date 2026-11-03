import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  disabled = false,
  className = '',
  style,
}) => {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`rounded-pill min-h-[44px] px-4 py-2 flex-row items-center justify-center gap-1.5 transition-all ${
        selected
          ? 'bg-primary-soft border border-primary'
          : 'bg-canvas border border-hairline'
      } ${disabled ? 'opacity-40' : ''} ${className}`.trim()}
      style={style}
    >
      {icon ? <View>{icon}</View> : null}
      <Text
        className={`text-[13px] leading-[18px] font-medium ${
          selected ? 'text-primary' : 'text-ink-soft'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
};
