import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface LocationInputProps {
  originValue?: string;
  destinationValue?: string;
  onChangeOrigin?: (text: string) => void;
  onChangeDestination?: (text: string) => void;
  originPlaceholder?: string;
  destinationPlaceholder?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  originValue = '',
  destinationValue = '',
  onChangeOrigin,
  onChangeDestination,
  originPlaceholder = 'Punto de partida',
  destinationPlaceholder = '¿A dónde vas?',
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const [focusedField, setFocusedField] = useState<'origin' | 'destination' | null>(null);

  return (
    <View style={styles.wrapper}>
      {/* Indicador visual / Timeline lateral */}
      <View style={styles.timelineColumn}>
        {/* Círculo relleno (origen) */}
        <View style={[styles.circle, { backgroundColor: colors.textPrimary }]} />
        {/* Línea conectora de 1px */}
        <View style={[styles.line, { backgroundColor: colors.divider }]} />
        {/* Cuadrado relleno (destino) */}
        <View style={[styles.square, { backgroundColor: colors.textPrimary }]} />
      </View>

      {/* Contenedor de inputs apilados */}
      <View style={styles.inputsColumn}>
        {/* Campo Origen */}
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              borderColor: focusedField === 'origin' ? colors.borderFocus : colors.border,
              borderWidth: focusedField === 'origin' ? 2 : 1,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              marginBottom: spacing.sm,
            },
          ]}
        >
          <TextInput
            accessibilityLabel="Punto de partida"
            value={originValue}
            onChangeText={onChangeOrigin}
            placeholder={originPlaceholder}
            placeholderTextColor={colors.textMuted}
            onFocus={() => setFocusedField('origin')}
            onBlur={() => setFocusedField(null)}
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
        </View>

        {/* Campo Destino */}
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              borderColor: focusedField === 'destination' ? colors.borderFocus : colors.border,
              borderWidth: focusedField === 'destination' ? 2 : 1,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <TextInput
            accessibilityLabel="Destino del viaje"
            value={destinationValue}
            onChangeText={onChangeDestination}
            placeholder={destinationPlaceholder}
            placeholderTextColor={colors.textMuted}
            onFocus={() => setFocusedField('destination')}
            onBlur={() => setFocusedField(null)}
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  timelineColumn: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginRight: 8,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
  line: {
    width: 1,
    height: 40,
    marginVertical: 4,
  },
  square: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  inputsColumn: {
    flex: 1,
  },
  inputBox: {
    justifyContent: 'center',
    minHeight: 48,
  },
  textInput: {
    padding: 0,
    margin: 0,
  },
});
