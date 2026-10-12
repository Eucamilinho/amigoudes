import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AppHeader,
  Button,
  Chip,
  LocationInput,
  ScreenContainer,
  SectionHeading,
  SegmentedToggle,
  StickyBottomBar,
  SuggestionCard,
  ThemedText,
} from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';
import type { UserMode } from '@/types/app';

const MODE_OPTIONS = [
  { value: 'passenger' as const, label: 'Pasajero' },
  { value: 'driver' as const, label: 'Conductor' },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const { mode, setMode } = useAppStore();

  const [origin, setOrigin] = useState('Mi ubicación actual');
  const [destination, setDestination] = useState('Campus Lagos del Cacique');

  const isPassenger = mode === 'passenger';

  const handleModeChange = (newMode: UserMode) => {
    setMode(newMode);
  };

  const handleBottomBarAction = () => {
    // Acción principal según modo (en fases posteriores navega a búsqueda o creación)
  };

  return (
    <View style={styles.screenWrapper}>
      {/* 1. Header Azul Superior */}
      <AppHeader
        title="UDES Ride"
        rightSlot={
          <Button
            label="Acceder"
            variant="pill"
            size="sm"
            onPress={() => router.push('/welcome')}
          />
        }
      />

      <ScreenContainer
        scrollable
        bottomBar={
          <StickyBottomBar
            label={isPassenger ? 'Ver viajes disponibles' : 'Publicar recorrido'}
            onPress={handleBottomBarAction}
          />
        }
      >
        {/* 2. Selector de Ciudad y Campus */}
        <View style={styles.citySelectorRow}>
          <View style={styles.cityTextGroup}>
            <View style={[styles.cityDot, { backgroundColor: colors.primary }]} />
            <ThemedText variant="subheading" color={colors.textPrimary}>
              Bucaramanga, CO
            </ThemedText>
          </View>
          <Chip label="Cambiar campus" />
        </View>

        {/* 3. Título Display (Peso 400, alineado a la izquierda) */}
        <ThemedText variant="display" color={colors.textPrimary} style={styles.heroTitle}>
          ¿A dónde vas hoy?
        </ThemedText>

        {/* 4. SegmentedToggle Pasajero / Conductor (Mismo azul institucional) */}
        <SegmentedToggle<UserMode>
          options={MODE_OPTIONS}
          value={mode}
          onChange={handleModeChange}
        />

        {/* 5. Inputs de Ubicación con Timeline */}
        <LocationInput
          originValue={origin}
          destinationValue={destination}
          onChangeOrigin={setOrigin}
          onChangeDestination={setDestination}
          originPlaceholder="Punto de partida"
          destinationPlaceholder="Destino hacia la UDES"
        />

        {/* 6. Sección de Sugerencias */}
        <SectionHeading title="Sugerencias" marginTop={spacing.xxl} />

        {/* Grilla de sugerencias adaptada para móvil */}
        <View style={styles.suggestionsGrid}>
          <SuggestionCard
            title="Buscar viaje"
            description="Encuentra rutas compartidas de estudiantes hacia el campus."
            onPressDetails={() => {}}
          />

          <SuggestionCard
            title="Publicar recorrido"
            description="Comparte tus cupos habituales y ahorra gastos de movilidad."
            onPressDetails={() => {}}
          />

          <SuggestionCard
            title="Rutas habituales"
            description="Guarda tus trayectos frecuentes desde tu barrio hacia la UDES."
            onPressDetails={() => {}}
          />

          <SuggestionCard
            title="Mis viajes"
            description="Gestiona tus reservas confirmadas y solicitudes pendientes."
            onPressDetails={() => {}}
          />
        </View>

        {/* 7. Metadatos de Versión y Fase (Alineados a la izquierda) */}
        <View style={styles.metaFooter}>
          <ThemedText variant="caption" color={colors.textMuted}>
            {APP_CONFIG.shortName} • v{APP_CONFIG.version} • {APP_CONFIG.phase}
          </ThemedText>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  citySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginBottom: 4,
  },
  cityTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityDot: {
    width: 6,
    height: 6,
    borderRadius: 9999,
  },
  heroTitle: {
    marginTop: 4,
    marginBottom: 8,
  },
  suggestionsGrid: {
    gap: 16,
  },
  metaFooter: {
    marginTop: 24,
    marginBottom: 8,
  },
});
