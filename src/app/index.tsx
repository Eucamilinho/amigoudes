import React from 'react';
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
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const { mode, toggleMode } = useAppStore();

  const isPassenger = mode === 'passenger';

  return (
    <ScreenContainer scrollable>
      {/* Encabezado Institucional */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <StatusBadge label="BASE MODULAR ACTIVA" variant="success" />
          <StatusBadge
            label={isPassenger ? 'MODO PASAJERO' : 'MODO CONDUCTOR'}
            variant={isPassenger ? 'info' : 'warning'}
          />
        </View>
        <ThemedText variant="h1" style={styles.title}>
          {APP_CONFIG.name}
        </ThemedText>
        <ThemedText variant="body" color={colors.textSecondary}>
          {APP_CONFIG.campus.location} • {APP_CONFIG.campus.city}
        </ThemedText>
      </View>

      {/* Control de Modo (Zustand) */}
      <Card
        highlighted={!isPassenger}
        style={[styles.card, !isPassenger && styles.driverCard]}
      >
        <ThemedText
          variant="label"
          color={isPassenger ? colors.primary : colors.warning}
          style={styles.cardHeader}
        >
          ROL ACTIVO: {isPassenger ? 'PASAJERO' : 'CONDUCTOR'}
        </ThemedText>
        <ThemedText variant="body" style={styles.cardDescription}>
          {isPassenger
            ? 'Configurado para consultar recorridos y solicitar cupos hacia la UDES.'
            : 'Configurado para publicar recorridos y gestionar solicitudes de estudiantes.'}
        </ThemedText>

        <Button
          label={`Cambiar a modo ${isPassenger ? 'Conductor' : 'Pasajero'}`}
          onPress={toggleMode}
          variant={isPassenger ? 'outline' : 'secondary'}
          fullWidth
          accessibilityHint="Alterna entre el modo pasajero y conductor sin cambiar de cuenta"
        />
      </Card>

      {/* Arquitectura y Herramientas (Inspiradas en Obytes) */}
      <Card style={styles.card}>
        <ThemedText variant="label" color={colors.primary} style={styles.cardHeader}>
          STACK TÉCNICO Y ARQUITECTURA
        </ThemedText>
        <ThemedText variant="body" style={styles.cardDescription}>
          Estructura modular orientada a features en <ThemedText variant="bodyBold">src/</ThemedText>,
          alineada con las mejores prácticas de la plantilla Obytes:
        </ThemedText>

        <View style={styles.specList}>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Rutas:</ThemedText>
            <ThemedText variant="body"> Expo Router v57 (File-based en src/app)</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Estado Cliente:</ThemedText>
            <ThemedText variant="body"> Zustand (Modo Pasajero / Conductor)</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Datos Servidor:</ThemedText>
            <ThemedText variant="body"> TanStack Query (QueryClientProvider)</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Formularios:</ThemedText>
            <ThemedText variant="body"> TanStack Form + Zod (Contratos y validación)</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Pruebas:</ThemedText>
            <ThemedText variant="body"> Jest + React Native Testing Library</ThemedText>
          </View>
          <View style={styles.specItem}>
            <ThemedText variant="bodyBold">• Diseño:</ThemedText>
            <ThemedText variant="body"> Tokens accesibles UDES (Alto contraste)</ThemedText>
          </View>
        </View>
      </Card>

      {/* Próximo Paso */}
      <Card style={[styles.card, styles.roadmapCard]}>
        <ThemedText variant="label" color={colors.textSecondary} style={styles.cardHeader}>
          ESTADO DEL PROYECTO: EN ESPERA DE AUTORIZACIÓN
        </ThemedText>
        <ThemedText variant="caption" color={colors.textSecondary}>
          La Fase 1 (Autenticación con Supabase y validación institucional)
          iniciará una vez autorizada formalmente la base técnica.
        </ThemedText>
      </Card>

      {/* Pie de pantalla */}
      <View style={[styles.footer, { marginTop: spacing.md }]}>
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
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
  },
  driverCard: {
    borderColor: '#D97706',
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
  footer: {
    paddingVertical: 12,
  },
});
