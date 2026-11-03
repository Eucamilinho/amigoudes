import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  edges?: Edge[];
  className?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  padded = true,
  edges = ['top', 'bottom', 'left', 'right'],
  className = '',
  style,
  contentContainerStyle,
}) => {
  const paddingClass = padded ? 'p-5' : '';

  const content = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={`${paddingClass} flex-grow`.trim()}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${paddingClass}`.trim()}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 bg-canvas ${className}`.trim()}
      style={style}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
