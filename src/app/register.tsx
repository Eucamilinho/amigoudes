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
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth.schema';
import { authService } from '@/features/auth/services/auth.service';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setGeneralError(null);
    setSuccessMessage(null);
    setErrors({});

    const formData = {
      fullName,
      email,
      studentId,
      password,
      confirmPassword,
    };

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormValues, string>> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as keyof RegisterFormValues;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.signUp(validation.data);
      if (res.error) {
        setGeneralError(res.error);
      } else {
        setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo...');
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      }
    } catch {
      setGeneralError('Ocurrió un error inesperado al procesar el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screenWrapper}>
      <AppHeader
        title="Crear cuenta"
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
        {/* Identidad Institucional */}
        <View style={styles.headerBlock}>
          <AppLogo size="sm" orientation="horizontal" showText />
          <ThemedText variant="heading" color={colors.textPrimary} style={styles.title}>
            Registro estudiantil
          </ThemedText>
          <ThemedText variant="body" color={colors.textSecondary}>
            Únete a la comunidad de carpooling de la UDES. Con una sola cuenta podrás viajar o conducir.
          </ThemedText>
        </View>

        {/* Mensaje de éxito */}
        {successMessage ? (
          <Card
            style={[
              styles.feedbackCard,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.success, borderWidth: 1 },
            ]}
          >
            <ThemedText variant="caption" color={colors.success}>
              {successMessage}
            </ThemedText>
          </Card>
        ) : null}

        {/* Mensaje de error general */}
        {generalError ? (
          <Card
            style={[
              styles.feedbackCard,
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.error, borderWidth: 1 },
            ]}
          >
            <ThemedText variant="caption" color={colors.error}>
              {generalError}
            </ThemedText>
          </Card>
        ) : null}

        {/* Formulario */}
        <View style={styles.formFields}>
          <FormInput
            label="Nombre completo"
            placeholder="Ej. María Pérez"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            autoCapitalize="words"
            autoComplete="name"
            error={errors.fullName}
            testID="register-name-input"
          />

          <View style={{ height: spacing.md }} />

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
            testID="register-email-input"
          />

          <View style={{ height: spacing.md }} />

          <FormInput
            label="Código estudiantil"
            placeholder="Ej. 20241015"
            value={studentId}
            onChangeText={(text) => {
              setStudentId(text);
              if (errors.studentId) setErrors((prev) => ({ ...prev, studentId: undefined }));
            }}
            keyboardType="default"
            autoCapitalize="none"
            error={errors.studentId}
            testID="register-student-id-input"
          />

          <View style={{ height: spacing.md }} />

          <FormInput
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.password}
            testID="register-password-input"
          />

          <View style={{ height: spacing.md }} />

          <FormInput
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.confirmPassword}
            testID="register-confirm-password-input"
          />
        </View>

        {/* Acciones */}
        <View style={styles.submitSection}>
          <Button
            label={isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            variant="primary"
            size="lg"
            onPress={handleRegister}
            disabled={isLoading}
            testID="register-submit-button"
          />

          <View style={styles.switchAuthRow}>
            <ThemedText variant="caption" color={colors.textSecondary}>
              ¿Ya tienes una cuenta registrada?{' '}
            </ThemedText>
            <Button
              label="Inicia sesión"
              variant="pill"
              size="sm"
              onPress={() => router.push('/login')}
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
  feedbackCard: {
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
