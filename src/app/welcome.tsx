import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AppHeader,
  AppLogo,
  Button,
  Card,
  ScreenContainer,
  ThemedText,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.screenWrapper}>
      <AppHeader
        title="UDES Ride"
        rightSlot={
          <Button
            label="Demo"
            variant="pill"
            size="sm"
            onPress={() => router.replace('/')}
          />
        }
      />

      <ScreenContainer scrollable>
        {/* Apartado del Logo Oficial */}
        <View style={styles.logoSection}>
          <AppLogo size="xl" showText={false} />
          <View style={styles.brandTitleGroup}>
            <ThemedText variant="display" color={colors.textPrimary}>
              UDES Ride
            </ThemedText>
            <ThemedText variant="subheading" color={colors.primary}>
              Carpooling Universitario
            </ThemedText>
          </View>
        </View>

        {/* Título y descripción */}
        <View style={styles.introSection}>
          <ThemedText variant="heading" color={colors.textPrimary} style={styles.heroTitle}>
            Tu viaje diario hacia el campus, compartido
          </ThemedText>
          <ThemedText variant="body" color={colors.textSecondary} style={styles.heroSubtitle}>
            Conecta con compañeros de la Universidad de Santander en Bucaramanga.
            Comparte rutas habituales, ahorra tiempo y viaja de forma segura.
          </ThemedText>
        </View>

        {/* Puntos de valor estilo Kiosk */}
        <View style={styles.cardsSection}>
          <Card style={styles.kioskCard}>
            <ThemedText variant="bodyMedium" color={colors.textPrimary}>
              Comunidad 100% UDES
            </ThemedText>
            <ThemedText variant="caption" color={colors.textSecondary} style={styles.cardDetail}>
              Plataforma exclusiva para estudiantes de la universidad con verificación de identidad.
            </ThemedText>
          </Card>

          <Card style={styles.kioskCard}>
            <ThemedText variant="bodyMedium" color={colors.textPrimary}>
              Flexibilidad de roles
            </ThemedText>
            <ThemedText variant="caption" color={colors.textSecondary} style={styles.cardDetail}>
              Alterna fácilmente entre pasajero para reservar cupos o conductor para publicar tus recorridos.
            </ThemedText>
          </Card>
        </View>

        {/* Acciones principales de bienvenida */}
        <View style={styles.actionsSection}>
          <Button
            label="Iniciar sesión"
            variant="primary"
            size="lg"
            onPress={() => router.push('/login')}
          />

          <View style={{ height: spacing.md }} />

          <Button
            label="Registrarse"
            variant="secondary"
            size="lg"
            onPress={() => router.push('/register')}
          />

          <View style={styles.guestLinkContainer}>
            <Button
              label="Explorar sin cuenta (Modo demostración)"
              variant="pill"
              size="sm"
              onPress={() => router.replace('/')}
            />
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  logoSection: {
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  brandTitleGroup: {
    flex: 1,
    gap: 2,
  },
  introSection: {
    marginBottom: 24,
  },
  heroTitle: {
    marginBottom: 8,
  },
  heroSubtitle: {
    lineHeight: 24,
  },
  cardsSection: {
    gap: 12,
    marginBottom: 32,
  },
  kioskCard: {
    padding: 16,
  },
  cardDetail: {
    marginTop: 4,
    lineHeight: 18,
  },
  actionsSection: {
    marginTop: 'auto',
    paddingBottom: 24,
  },
  guestLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
