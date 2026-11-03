import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInRight, FadeInLeft } from 'react-native-reanimated';
import {
  ChevronLeft,
  User,
  Car,
  Mail,
  Lock,
  Phone,
  GraduationCap,
  Clock,
  Check,
  Sparkles,
} from 'lucide-react-native';
import {
  Button,
  Chip,
  Icon,
  Input,
  RouteMapPicker,
  ScreenContainer,
} from '@/components/ui';
import { registerSchema, useAuthStore, type UniversityRole } from '@/features/auth';

const TIMES = ['6:00 am', '6:30 am', '7:00 am', '12:00 m', '6:00 pm'];

export default function RegisterScreen() {
  const [step, setStep] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');

  // Paso 1: Cuenta (Valores de prueba precompletados)
  const [fullName, setFullName] = useState('Valentina Rodríguez');
  const [email, setEmail] = useState('v.rodriguez@udes.edu.co');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');

  // Paso 2: Perfil institucional
  const [universityRole, setUniversityRole] = useState<UniversityRole>('estudiante');
  const [faculty, setFaculty] = useState('Medicina');
  const [phone, setPhone] = useState('315 892 4410');

  // Paso 3: Roles de carpooling
  const [isPassenger, setIsPassenger] = useState(true);
  const [isDriver, setIsDriver] = useState(false);

  // Paso 4: Ruta habitual con mapa
  const [originSector, setOriginSector] = useState('Cabecera');
  const [originAddress, setOriginAddress] = useState('Cra. 33 # 48-12, Cabecera');
  const [habitualTime, setHabitualTime] = useState('6:30 am');
  const [toleranceMin, setToleranceMin] = useState<15 | 30 | 45>(15);

  // Paso 5: Vehículo (si es conductor)
  const [vehicleMake, setVehicleMake] = useState('Chevrolet');
  const [vehicleModel, setVehicleModel] = useState('Onix Turbo');
  const [vehiclePlate, setVehiclePlate] = useState('WKL-823');
  const [vehicleColor, setVehicleColor] = useState('Gris');
  const [vehicleSeats, setVehicleSeats] = useState(3);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);

  const totalSteps = isDriver ? 5 : 4;

  const handleAutoFill = (role: 'passenger' | 'driver' = 'passenger') => {
    if (role === 'driver') {
      setFullName('Carlos Eduardo Mantilla');
      setEmail('c.mantilla@udes.edu.co');
      setPassword('123456');
      setConfirmPassword('123456');
      setUniversityRole('docente');
      setFaculty('Ingeniería de Sistemas');
      setPhone('318 456 7890');
      setIsPassenger(true);
      setIsDriver(true);
      setOriginSector('Cañaveral');
      setOriginAddress('C.C. Cañaveral, Floridablanca');
      setHabitualTime('6:30 am');
      setToleranceMin(15);
      setVehicleMake('Chevrolet');
      setVehicleModel('Onix Turbo');
      setVehiclePlate('WKL-823');
      setVehicleColor('Gris');
      setVehicleSeats(3);
    } else {
      setFullName('Valentina Rodríguez');
      setEmail('v.rodriguez@udes.edu.co');
      setPassword('123456');
      setConfirmPassword('123456');
      setUniversityRole('estudiante');
      setFaculty('Medicina');
      setPhone('315 892 4410');
      setIsPassenger(true);
      setIsDriver(false);
      setOriginSector('Cabecera');
      setOriginAddress('Cra. 33 # 48-12, Cabecera');
      setHabitualTime('6:30 am');
      setToleranceMin(15);
    }
    setErrors({});
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (fullName.trim().length < 3) {
        newErrors.fullName = 'Mínimo 3 caracteres';
      }
      if (!email.toLowerCase().includes('udes.edu.co')) {
        newErrors.email = 'Debe ser correo @udes.edu.co';
      }
      if (password.length < 6) {
        newErrors.password = 'Mínimo 6 caracteres';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else if (currentStep === 2) {
      if (faculty.trim().length < 2) {
        newErrors.faculty = 'Ingresa tu programa o facultad';
      }
      if (phone.trim().length < 7) {
        newErrors.phone = 'Celular requerido';
      }
    } else if (currentStep === 3) {
      if (!isPassenger && !isDriver) {
        newErrors.roles = 'Elige al menos un rol de viaje';
      }
    } else if (currentStep === 5) {
      if (vehiclePlate.trim().length < 5) {
        newErrors.vehiclePlate = 'Placa requerida (mínimo 5 caracteres)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    if (step === 4 && !isDriver) {
      handleFinalSubmit();
      return;
    }

    if (step === 5) {
      handleFinalSubmit();
      return;
    }

    setSlideDirection('forward');
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setSlideDirection('backward');
      setStep((prev) => prev - 1);
    } else {
      router.replace('/welcome');
    }
  };

  const handleFinalSubmit = async () => {
    setErrors({});
    const formData = {
      fullName,
      email,
      password,
      confirmPassword,
      universityRole,
      faculty,
      phone,
      isPassenger,
      isDriver,
      vehicleMake,
      vehicleModel,
      vehiclePlate,
      vehicleColor,
      vehicleSeats,
      originSector,
      originAddress,
      destinationAddress: 'Calle 70 # 55-210, Lagos del Cacique, UDES',
      habitualTime,
      toleranceMin,
    };

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const success = await register(result.data);
    if (success) {
      router.replace('/');
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <View className="flex-1 justify-between">
        {/* Barra Superior con botón atrás y barra de progreso */}
        <View className="flex-row items-center justify-between mb-4 pt-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver al paso anterior"
            onPress={handleBack}
            className="w-11 h-11 items-center justify-center rounded-pill bg-paper border border-hairline shadow-xs active:bg-hairline"
          >
            <Icon icon={ChevronLeft} size="md" color="ink" />
          </Pressable>

          {/* Barra de progreso de píldoras sutiles */}
          <View className="flex-1 max-w-[120px] mx-3 flex-row items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i + 1 <= step ? 'bg-primary' : 'bg-hairline'
                }`}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Autocompletar formulario"
            onPress={() => handleAutoFill(isDriver ? 'driver' : 'passenger')}
            className="flex-row items-center gap-1.5 bg-primary-soft border border-primary/20 px-3 py-1.5 rounded-pill active:bg-primary/20"
          >
            <Icon icon={Sparkles} size="xs" color="primary" />
            <Text className="text-[12px] font-semibold text-primary">Autollenar</Text>
          </Pressable>
        </View>

        {/* Contenido Dinámico por Paso con Scroll Suave */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-6 pt-2"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && (
            <Animated.View
              key="step-1"
              entering={slideDirection === 'forward' ? FadeInRight.duration(250) : FadeInLeft.duration(250)}
              className="gap-4"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View>
                  <Text className="text-[24px] leading-[30px] font-bold text-ink tracking-tight mb-1">
                    Crea tu cuenta
                  </Text>
                  <Text className="text-[14px] leading-[20px] text-mid-gray">
                    Acceso institucional UDES
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Llenar datos de prueba"
                  onPress={() => handleAutoFill('passenger')}
                  className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-pill bg-canvas border border-hairline active:bg-hairline"
                >
                  <Icon icon={Sparkles} size="xs" color="primary" />
                  <Text className="text-[12px] font-medium text-ink-soft">Test</Text>
                </Pressable>
              </View>

              <Input
                label="Nombre"
                placeholder="Ej. Juan Pérez"
                value={fullName}
                onChangeText={setFullName}
                error={errors.fullName}
                leftIcon={<Icon icon={User} size="sm" color="mid-gray" />}
              />

              <Input
                label="Correo"
                placeholder="usuario@udes.edu.co"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                leftIcon={<Icon icon={Mail} size="sm" color="mid-gray" />}
              />

              <Input
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                leftIcon={<Icon icon={Lock} size="sm" color="mid-gray" />}
              />

              <Input
                label="Confirmar"
                placeholder="Repite tu contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                leftIcon={<Icon icon={Lock} size="sm" color="mid-gray" />}
              />
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View
              key="step-2"
              entering={slideDirection === 'forward' ? FadeInRight.duration(250) : FadeInLeft.duration(250)}
              className="gap-5"
            >
              <View className="mb-2">
                <Text className="text-[24px] leading-[30px] font-bold text-ink tracking-tight mb-1">
                  Tu perfil
                </Text>
                <Text className="text-[14px] leading-[20px] text-mid-gray">
                  Comunidad universitaria
                </Text>
              </View>

              <View>
                <Text className="text-[12px] font-medium uppercase tracking-[0.6px] text-mid-gray mb-2.5 px-1">
                  Rol en la UDES
                </Text>
                <View className="flex-row gap-2.5">
                  {(['estudiante', 'docente', 'administrativo'] as const).map((role) => (
                    <Chip
                      key={role}
                      label={role.charAt(0).toUpperCase() + role.slice(1)}
                      selected={universityRole === role}
                      onPress={() => setUniversityRole(role)}
                    />
                  ))}
                </View>
              </View>

              <Input
                label="Programa o Facultad"
                placeholder="Ej. Medicina / Sistemas"
                value={faculty}
                onChangeText={setFaculty}
                error={errors.faculty}
                leftIcon={<Icon icon={GraduationCap} size="sm" color="mid-gray" />}
              />

              <Input
                label="Celular"
                placeholder="Ej. 315 123 4567"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
                leftIcon={<Icon icon={Phone} size="sm" color="mid-gray" />}
              />
            </Animated.View>
          )}

          {step === 3 && (
            <Animated.View
              key="step-3"
              entering={slideDirection === 'forward' ? FadeInRight.duration(250) : FadeInLeft.duration(250)}
              className="gap-4"
            >
              <View className="mb-3">
                <Text className="text-[24px] leading-[30px] font-bold text-ink tracking-tight mb-1">
                  ¿Cómo viajarás?
                </Text>
                <Text className="text-[14px] leading-[20px] text-mid-gray">
                  Puedes seleccionar uno o ambos roles
                </Text>
              </View>

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isPassenger }}
                onPress={() => setIsPassenger(!isPassenger)}
                className={`p-5 rounded-2xl border transition-all ${
                  isPassenger
                    ? 'bg-paper border-2 border-primary shadow-xs'
                    : 'bg-paper border border-hairline'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3.5">
                    <View
                      className={`w-12 h-12 rounded-pill items-center justify-center ${
                        isPassenger ? 'bg-primary-soft' : 'bg-canvas'
                      }`}
                    >
                      <Icon icon={User} size="md" color={isPassenger ? 'primary' : 'mid-gray'} />
                    </View>
                    <View>
                      <Text className="text-[16px] font-semibold text-ink">Pasajero</Text>
                      <Text className="text-[13px] text-mid-gray mt-0.5">
                        Busco cupo hacia la UDES
                      </Text>
                    </View>
                  </View>
                  {isPassenger ? (
                    <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                      <Icon icon={Check} size="sm" color="white" />
                    </View>
                  ) : null}
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDriver }}
                onPress={() => setIsDriver(!isDriver)}
                className={`p-5 rounded-2xl border transition-all ${
                  isDriver
                    ? 'bg-paper border-2 border-primary shadow-xs'
                    : 'bg-paper border border-hairline'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3.5">
                    <View
                      className={`w-12 h-12 rounded-pill items-center justify-center ${
                        isDriver ? 'bg-primary-soft' : 'bg-canvas'
                      }`}
                    >
                      <Icon icon={Car} size="md" color={isDriver ? 'primary' : 'mid-gray'} />
                    </View>
                    <View>
                      <Text className="text-[16px] font-semibold text-ink">Conductor</Text>
                      <Text className="text-[13px] text-mid-gray mt-0.5">
                        Tengo carro y ofrezco cupos
                      </Text>
                    </View>
                  </View>
                  {isDriver ? (
                    <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                      <Icon icon={Check} size="sm" color="white" />
                    </View>
                  ) : null}
                </View>
              </Pressable>

              {errors.roles ? (
                <Text className="text-destructive text-[12px] px-1 mt-1">{errors.roles}</Text>
              ) : null}
            </Animated.View>
          )}

          {step === 4 && (
            <Animated.View
              key="step-4"
              entering={slideDirection === 'forward' ? FadeInRight.duration(250) : FadeInLeft.duration(250)}
              className="gap-4"
            >
              <View className="mb-1">
                <Text className="text-[24px] leading-[30px] font-bold text-ink tracking-tight mb-1">
                  Tu ruta habitual
                </Text>
                <Text className="text-[14px] leading-[20px] text-mid-gray">
                  Toca un sector en el mapa para marcar tu punto de origen
                </Text>
              </View>

              {/* Selector interactivo de ruta en mapa con origen y destino */}
              <RouteMapPicker
                selectedSectorName={originSector}
                onSelectSector={(sec) => {
                  setOriginSector(sec.shortName);
                  setOriginAddress(sec.address);
                }}
                originAddress={originAddress}
                onChangeOriginAddress={setOriginAddress}
              />

              {/* Franja Horaria y Tolerancia */}
              <View className="gap-3.5 pt-2">
                <View>
                  <View className="flex-row items-center gap-1.5 mb-2 px-1">
                    <Icon icon={Clock} size="sm" color="mid-gray" />
                    <Text className="text-[12px] font-medium uppercase tracking-[0.5px] text-mid-gray">
                      Hora habitual de llegada
                    </Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {TIMES.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        selected={habitualTime === t}
                        onPress={() => setHabitualTime(t)}
                        className="min-h-[40px] px-3.5 py-1.5"
                      />
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-[12px] font-medium uppercase tracking-[0.5px] text-mid-gray mb-2 px-1">
                    Tolerancia horaria
                  </Text>
                  <View className="flex-row gap-2.5">
                    {([15, 30, 45] as const).map((tol) => (
                      <Chip
                        key={tol}
                        label={`±${tol} min`}
                        selected={toleranceMin === tol}
                        onPress={() => setToleranceMin(tol)}
                        className="min-h-[40px] px-3.5 py-1.5"
                      />
                    ))}
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {step === 5 && (
            <Animated.View
              key="step-5"
              entering={slideDirection === 'forward' ? FadeInRight.duration(250) : FadeInLeft.duration(250)}
              className="gap-4"
            >
              <View className="mb-2">
                <Text className="text-[24px] leading-[30px] font-bold text-ink tracking-tight mb-1">
                  Tu vehículo
                </Text>
                <Text className="text-[14px] leading-[20px] text-mid-gray">
                  Datos visibles para tus pasajeros
                </Text>
              </View>

              <Input
                label="Placa"
                placeholder="Ej. WKL-823"
                autoCapitalize="characters"
                value={vehiclePlate}
                onChangeText={setVehiclePlate}
                error={errors.vehiclePlate}
                leftIcon={<Icon icon={Car} size="sm" color="mid-gray" />}
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="Marca y modelo"
                    placeholder="Ej. Chevrolet Onix"
                    value={vehicleModel}
                    onChangeText={(val) => {
                      setVehicleModel(val);
                      setVehicleMake(val.split(' ')[0] ?? '');
                    }}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Color"
                    placeholder="Ej. Gris"
                    value={vehicleColor}
                    onChangeText={setVehicleColor}
                  />
                </View>
              </View>

              <View>
                <Text className="text-[12px] font-medium uppercase tracking-[0.6px] text-mid-gray mb-2.5 px-1">
                  Cupos disponibles
                </Text>
                <View className="flex-row gap-2.5">
                  {[1, 2, 3, 4].map((seats) => (
                    <Chip
                      key={seats}
                      label={`${seats} ${seats === 1 ? 'cupo' : 'cupos'}`}
                      selected={vehicleSeats === seats}
                      onPress={() => setVehicleSeats(seats)}
                    />
                  ))}
                </View>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Botón de Acción Inferior Anclado con Holgura */}
        <Animated.View entering={FadeIn.duration(250)} className="pt-3 pb-1 border-t border-hairline/60 bg-canvas">
          <Button
            label={step === totalSteps ? 'Crear cuenta' : 'Continuar'}
            onPress={handleNext}
            variant="primary"
            loading={isLoading}
            fullWidth
          />

          {step === 1 ? (
            <View className="flex-row items-center justify-center gap-1 pt-3">
              <Text className="text-mid-gray text-[13px]">¿Ya tienes cuenta?</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/login')}
                className="py-1 px-1"
              >
                <Text className="text-primary font-semibold text-[13px]">Inicia sesión</Text>
              </Pressable>
            </View>
          ) : null}
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}
