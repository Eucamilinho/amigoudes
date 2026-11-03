import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

export interface StatBlockProps {
  label: string;
  value: string | number;
  helper?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatBlock: React.FC<StatBlockProps> = ({
  label,
  value,
  helper,
  size = 'md',
  className = '',
  style,
}) => {
  const valueSizeClass = {
    sm: 'text-[15px] leading-[20px] font-bold',
    md: 'text-[18px] leading-[24px] font-bold',
    lg: 'text-[26px] leading-[32px] font-semibold',
  }[size];

  return (
    <View className={`flex-1 min-w-0 ${className}`.trim()} style={style}>
      <Text
        numberOfLines={1}
        className="text-[11px] leading-[14px] font-medium uppercase tracking-[0.5px] text-mid-gray mb-0.5"
      >
        {label}
      </Text>
      <Text
        numberOfLines={1}
        className={`${valueSizeClass} text-ink tracking-tight`}
      >
        {value}
      </Text>
      {helper ? (
        <Text
          numberOfLines={1}
          className="text-[11px] leading-[14px] text-mid-gray mt-0.5"
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
};
