import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedToggleProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  className = '',
  style,
}: SegmentedToggleProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className={`bg-canvas border border-hairline rounded-pill p-1 flex-row items-center min-h-[44px] ${className}`.trim()}
      style={style}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            className={`flex-1 min-h-[38px] rounded-pill flex-row items-center justify-center gap-2 px-4 ${
              isActive
                ? 'bg-paper border border-hairline/80 shadow-sm'
                : 'bg-transparent'
            }`}
          >
            {option.icon ? <View>{option.icon}</View> : null}
            <Text
              className={`text-[14px] leading-[20px] ${
                isActive ? 'font-semibold text-primary' : 'font-medium text-mid-gray'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
