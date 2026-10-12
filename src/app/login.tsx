import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AppHeader,
  AppLogo,
  Button,
  Card,
  FormInput,
  ScreenContainer,
  ThemedText,
} from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { loginSchema } from '@/features/auth/schemas/auth.schema';
import { authService } from '@/features/auth/services/auth.service';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setGeneralError(null);
    setErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of validation.error.issues) {
        const path = issue.path[0] as 'email' | 'password';
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.signIn(validation.data);
      if (res.error) {
        setGeneralError(res.error);
      } else {
        // Ingreso exitoso: navegar a la pantalla principal
        router.replace('/');
      }
    } catch {
      setGeneralError('Ocurrió un error inesperado al conectar con el servicio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screenWrapper}>
      <AppHeader
        title="Iniciar sesión"
        rightSlot={
          <Button
            label="Volver"
            variant="pill"
            size="sm"
            onPress={() => router.back()}
          />
        }
      />

      <ScreenContainer scrollable>
        {/* Identidad de Marca */}
        <View style={styles.headerBlock}>
          <AppLogo size="sm" orientation="horizontal" showText />
          <ThemedText variant="heading" color={colors.textPrimary} style={styles.title}>
            Bienvenido de vuelta
          </ThemedText>
          <ThemedText variant="body" color={colors.textSecondary}>
            Ingresa con tus credenciales estudiantiles para acceder a los recorridos.
          </ThemedText>
        </View>

        {/* Alerta de error general */}
        {generalError ? (
          <Card
            style={[
              styles.errorCard,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.error, borderWidth: 1 },
            ]}
          >
            <ThemedText variant="caption" color={colors.error}>
              {generalError}
            </ThemedText>
          </Card>
        ) : null}

        {/* Campos del Formulario */}
        <View style={styles.formFields}>
          <FormInput
            label="Correo electrónico"
            placeholder="estudiante@correo.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            testID="login-email-input"
          />

          <View style={{ height: spacing.md }} />

          <FormInput
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password}
            testID="login-password-input"
          />
        </View>

        {/* Botón de envío */}
        <View style={styles.submitSection}>
          <Button
            label={isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            variant="primary"
            size="lg"
            onPress={handleLogin}
            disabled={isLoading}
            testID="login-submit-button"
          />

          <View style={styles.switchAuthRow}>
            <ThemedText variant="caption" color={colors.textSecondary}>
              ¿Aún no tienes cuenta?{' '}
            </ThemedText>
            <Button
              label="Regístrate aquí"
              variant="pill"
              size="sm"
              onPress={() => router.push('/register')}
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
  headerBlock: {
    paddingTop: 12,
    marginBottom: 24,
    gap: 8,
  },
  title: {
    marginTop: 8,
  },
  errorCard: {
    padding: 12,
    marginBottom: 16,
  },
  formFields: {
    marginBottom: 28,
  },
  submitSection: {
    gap: 16,
    paddingBottom: 24,
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
