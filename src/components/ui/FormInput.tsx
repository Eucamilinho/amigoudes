import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  editable = true,
  style,
  testID,
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const hasError = Boolean(error);

  const getBorderColor = () => {
    if (hasError) return colors.error;
    if (isFocused) return colors.borderFocus;
    return colors.border;
  };

  const getBorderWidth = () => {
    if (hasError || isFocused) return 2;
    return 1;
  };

  return (
    <View style={[styles.container, style]}>
      <ThemedText variant="label" color={colors.textPrimary} style={styles.label}>
        {label}
      </ThemedText>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceSubtle,
            borderColor: getBorderColor(),
            borderWidth: getBorderWidth(),
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <TextInput
          testID={testID}
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            {
              color: colors.textPrimary,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
            },
          ]}
        />

        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <ThemedText variant="caption" color={colors.primary}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      {hasError ? (
        <ThemedText variant="caption" color={colors.error} style={styles.message}>
          {error}
        </ThemedText>
      ) : helperText ? (
        <ThemedText variant="caption" color={colors.textMuted} style={styles.message}>
          {helperText}
        </ThemedText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    margin: 0,
  },
  eyeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  message: {
    marginTop: 4,
  },
});
