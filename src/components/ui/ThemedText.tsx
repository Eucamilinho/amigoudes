import React from 'react';
import { Text, type TextProps } from 'react-native';
import type { TextVariant } from '@/types/theme';

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  centered?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<TextVariant, string> = {
  display: 'text-[40px] leading-[44px] font-semibold text-ink tracking-[-1.2px]',
  heading: 'text-[30px] leading-[36px] font-semibold text-ink tracking-[-0.75px]',
  headingSm: 'text-[24px] leading-[32px] font-semibold text-ink tracking-[-0.6px]',
  subheading: 'text-[18px] leading-[28px] font-semibold text-ink',
  bodyLg: 'text-[16px] leading-[24px] font-normal text-ink-soft',
  body: 'text-[14px] leading-[20px] font-normal text-ink-soft',
  bodyBold: 'text-[14px] leading-[20px] font-medium text-ink',
  caption: 'text-[12px] leading-[16px] font-normal text-mid-gray',
  label: 'text-[12px] leading-[16px] font-medium uppercase tracking-[0.6px] text-mid-gray',
};

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'body',
  centered = false,
  className = '',
  style,
  ...props
}) => {
  const isHeader =
    variant === 'display' ||
    variant === 'heading' ||
    variant === 'headingSm' ||
    variant === 'subheading';

  return (
    <Text
      accessibilityRole={isHeader ? 'header' : 'text'}
      className={`${VARIANT_CLASSES[variant]} ${centered ? 'text-center' : ''} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
};
