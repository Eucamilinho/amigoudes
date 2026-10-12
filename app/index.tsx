import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  ScreenContainer,
  StatusBadge,
  ThemedText,
} from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { useTheme } from '@/hooks/useTheme';

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const [clickCount, setClickCount] = useState<number>(0);

  const handleTestInteraction = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <StatusBadge label="FASE 0 COMPLETA" variant="success" />
        <ThemedText variant="h1" style={styles.title}>
          {APP_CONFIG.name}
        </ThemedText>
        <ThemedText variant="body" color={colors.textSecondary}>
          {APP_CONFIG.campus.location} • {APP_CONFIG.campus.city}
        </ThemedText>
      </View>

      <Card style={styles.card}>
        <ThemedText variant="label" color={colors.primary} style={styles.cardHeader}>
          ARQUITECTURA Y BASE TÉCNICA
        </ThemedText>
        <ThemedText variant="body" style={styles.cardDescription}>
          Esta pantalla verifica que Expo Router, TypeScript estricto y el sistema
          de componentes base están operativos.
        </ThemedText>

        <View style={styles.specList}>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Entorno:</ThemedText>
            <ThemedText variant="body"> React Native + Expo SDK 57</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Navegación:</ThemedText>
            <ThemedText variant="body"> Expo Router v57 (File-based)</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Tipado:</ThemedText>
            <ThemedText variant="body"> TypeScript (Modo estricto)</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Validaciones:</ThemedText>
            <ThemedText variant="body"> Zod schemas</ThemedText>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <ThemedText variant="label" style={styles.cardHeader}>
          VERIFICACIÓN DE INTERACTIVIDAD
        </ThemedText>
        <ThemedText variant="body" style={styles.cardDescription}>
          Pulsa el botón para comprobar el manejo de eventos y respuesta en el cliente:
        </ThemedText>

        <View style={styles.actionContainer}>
          <Button
            label={
              clickCount === 0
                ? 'Probar interacción'
                : `Interacción exitosa (${clickCount} ${clickCount === 1 ? 'pulsación' : 'pulsaciones'})`
            }
            onPress={handleTestInteraction}
            variant={clickCount === 0 ? 'primary' : 'secondary'}
            fullWidth
          />
        </View>
      </Card>

      <Card style={[styles.card, styles.roadmapCard]}>
        <ThemedText variant="label" color={colors.textSecondary} style={styles.cardHeader}>
          PRÓXIMO PASO: FASE 1
        </ThemedText>
        <ThemedText variant="caption" color={colors.textSecondary}>
          Autenticación institucional con Supabase, validación de correo estudiantil
          y persistencia de sesión. (En espera de autorización para iniciar).
        </ThemedText>
      </Card>

      <View style={[styles.footer, { marginTop: spacing.xl }]}>
        <ThemedText variant="caption" centered color={colors.textMuted}>
          v{APP_CONFIG.version} • {APP_CONFIG.phase}
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    gap: 8,
  },
  title: {
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
  },
  roadmapCard: {
    borderStyle: 'dashed',
  },
  cardHeader: {
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardDescription: {
    marginBottom: 12,
  },
  specList: {
    gap: 6,
  },
  specItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionContainer: {
    marginTop: 8,
  },
  footer: {
    paddingVertical: 12,
  },
});
