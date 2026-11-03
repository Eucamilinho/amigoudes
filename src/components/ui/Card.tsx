import React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

export interface CardProps extends ViewProps {
  selected?: boolean;
  highlighted?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  selected = false,
  highlighted = false,
  className = '',
  style,
  ...props
}) => {
  const isHighlighted = highlighted || selected;
  const hasCustomPadding = /\bp(?:[xytbse]?)-\d+/.test(className);
  const paddingClass = hasCustomPadding ? '' : 'p-4';

  return (
    <View
      className={`bg-paper rounded-2xl border ${
        isHighlighted ? 'border-primary' : 'border-hairline'
      } ${paddingClass} ${className}`.trim()}
      style={[
        {
          // Sombra clínica sutil (New Architecture / react-native shadow)
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 2,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
