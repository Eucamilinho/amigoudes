import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  MapPin,
  LogOut,
  ArrowRight,
  Star,
  Sun,
  Moon,
  Smartphone,
} from 'lucide-react-native';
import {
  Card,
  StatusBadge,
  Icon,
} from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/hooks/useTheme';
import { confirmAction } from '@/lib/alert';
import type { AppRole } from '@/types/theme';

export interface ProfileTabViewProps {
  className?: string;
  // Props opcionales para compatibilidad
  user?: any;
  activeRole?: AppRole;
  onLogout?: () => void;
  onSwitchDemo?: (role: 'passenger' | 'driver') => void;
}

export const ProfileTabView: React.FC<ProfileTabViewProps> = ({
  className = '',
}) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loginAsDemo = useAuthStore((s) => s.loginAsDemo);
  const { preference, setThemePreference } = useTheme();

  const activeRole: AppRole = user?.activeRole ?? 'passenger';

  const [maxDeviation, setMaxDeviation] = useState<number>(300);
  const [waitingTime, setWaitingTime] = useState<number>(5);
  const [activeDays, setActiveDays] = useState<string[]>(['L', 'M', 'Mi', 'J', 'V']);

  const weekDays = [
    { id: 'L', label: 'L' },
    { id: 'M', label: 'M' },
    { id: 'Mi', label: 'M' },
    { id: 'J', label: 'J' },
    { id: 'V', label: 'V' },
  ];

  const handleToggleDay = (dayId: string) => {
    setActiveDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleLogout = () => {
    confirmAction({
      title: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir de AmigoUDES?',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar',
      onConfirm: () => logout(),
    });
  };

  if (!user) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      className={`gap-3.5 pb-6 ${className}`.trim()}
    >
      {/* ━━━ A. TARJETA DE CREDENCIAL INSTITUCIONAL UDES (HERO) ━━━ */}
      <Card className="p-4 border border-hairline rounded-2xl bg-paper shadow-xs">
        {/* Fila 1: Avatar + Nombre + Badge Verificado */}
        <View className="flex-row items-center gap-3 mb-2.5">
          <View className="w-12 h-12 rounded-full bg-primary-soft items-center justify-center border border-primary/20 shrink-0">
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[17px] font-bold text-primary"
            >
              {user.fullName.charAt(0)}
            </Text>
          </View>

          <View className="flex-1 min-w-0">
            <View className="flex-row items-center gap-2 mb-0.5 flex-wrap">
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className="text-[17px] font-bold text-ink leading-tight shrink"
              >
                {user.fullName}
              </Text>
              <StatusBadge label="VERIFICADO" variant="primary" />
            </View>

            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className="text-[12px] text-mid-gray"
            >
              {user.universityRole === 'docente' ? 'Docente' : 'Estudiante'} · {user.faculty}
            </Text>
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className="text-[12px] font-medium text-primary mt-0.5"
            >
              {user.email}
            </Text>
          </View>
        </View>

        {/* Fila 2: Métricas integradas en 3 columnas compactas */}
        <View className="flex-row items-center justify-between pt-3 border-t border-hairline">
          <View className="flex-1 items-center">
            <View className="flex-row items-center gap-1">
              <Icon icon={Star} size="xs" color="primary" />
              <Text
                maxFontSizeMultiplier={1.3}
                className="text-[15px] font-bold text-ink"
              >
                {user.ratingAvg.toFixed(1)}
              </Text>
            </View>
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[11px] text-mid-gray mt-0.5"
            >
              Calificación
            </Text>
          </View>

          <View className="w-[1px] h-7 bg-hairline" />

          <View className="flex-1 items-center">
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[15px] font-bold text-ink"
            >
              {user.ridesCount}
            </Text>
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[11px] text-mid-gray mt-0.5"
            >
              Viajes
            </Text>
          </View>

          <View className="w-[1px] h-7 bg-hairline" />

          <View className="flex-1 items-center">
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[15px] font-bold text-ink"
            >
              Lagos
            </Text>
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[11px] text-mid-gray mt-0.5"
            >
              Campus
            </Text>
          </View>
        </View>
      </Card>

      {/* ━━━ B. VEHÍCULO REGISTRADO (SOLO CONDUCTOR) ━━━ */}
      {activeRole === 'driver' ? (
        <View className="bg-canvas p-3 rounded-xl border border-hairline gap-2.5">
          {/* Fila única de vehículo */}
          <View className="flex-row items-center justify-between">
            <View className="bg-paper border border-hairline px-2 py-0.5 rounded-md shrink-0">
              <Text
                maxFontSizeMultiplier={1.3}
                className="font-mono text-[12px] font-bold text-ink tracking-wider"
              >
                {user.vehicle?.plate ?? 'UDE-482'}
              </Text>
            </View>

            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className="text-[12px] font-semibold text-ink flex-1 min-w-0 text-right ml-2"
            >
              {user.vehicle?.make ?? 'Chevrolet'} {user.vehicle?.model ?? 'Onix'} · {user.vehicle?.color ?? 'Gris'} · {user.vehicle?.seats ?? 3} cupos
            </Text>
          </View>

          {/* Selectores compactos en píldoras */}
          <View className="flex-row items-center gap-2">
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[11px] font-bold text-mid-gray uppercase tracking-wider shrink-0"
            >
              Desvío
            </Text>
            <View className="flex-1 flex-row gap-1.5">
              {[200, 300, 500].map((d) => (
                <Pressable
                  key={d}
                  accessibilityRole="button"
                  accessibilityLabel={`Desvío ${d} metros`}
                  onPress={() => setMaxDeviation(d)}
                  className={`flex-1 py-1 rounded-pill border items-center justify-center ${
                    maxDeviation === d
                      ? 'bg-primary border-primary'
                      : 'bg-paper border-hairline active:bg-hairline'
                  }`}
                >
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className={`text-[11px] font-semibold ${
                      maxDeviation === d ? 'text-white' : 'text-mid-gray'
                    }`}
                  >
                    {d}m
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[11px] font-bold text-mid-gray uppercase tracking-wider shrink-0"
            >
              Espera
            </Text>
            <View className="flex-1 flex-row gap-1.5">
              {[3, 5, 8].map((m) => (
                <Pressable
                  key={m}
                  accessibilityRole="button"
                  accessibilityLabel={`Espera ${m} minutos`}
                  onPress={() => setWaitingTime(m)}
                  className={`flex-1 py-1 rounded-pill border items-center justify-center ${
                    waitingTime === m
                      ? 'bg-primary border-primary'
                      : 'bg-paper border-hairline active:bg-hairline'
                  }`}
                >
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className={`text-[11px] font-semibold ${
                      waitingTime === m ? 'text-white' : 'text-mid-gray'
                    }`}
                  >
                    {m} min
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {/* ━━━ C. RUTA HABITUAL GUARDADA (RESUMEN DE 1 BLOQUE) ━━━ */}
      <View className="bg-canvas p-3 rounded-xl border border-hairline gap-2.5">
        {/* Trazado simple */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5 flex-1 min-w-0 mr-2">
            <Icon icon={MapPin} size="xs" color="primary" />
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className="text-[12px] font-bold text-ink"
            >
              {user.routine?.originSector ?? 'Cabecera'}
            </Text>
            <Icon icon={ArrowRight} size="xs" color="mid-gray" />
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className="text-[12px] font-bold text-primary flex-1 min-w-0"
            >
              Campus Lagos (±15 min)
            </Text>
          </View>
        </View>

        {/* Días activos: Píldoras compactas L M M J V */}
        <View className="flex-row items-center gap-1.5">
          <Text
            maxFontSizeMultiplier={1.3}
            className="text-[11px] font-bold text-mid-gray uppercase tracking-wider mr-1"
          >
            Días
          </Text>
          {weekDays.map((w) => {
            const isSelected = activeDays.includes(w.id);
            return (
              <Pressable
                key={w.id}
                accessibilityRole="button"
                accessibilityLabel={`Día ${w.label}`}
                onPress={() => handleToggleDay(w.id)}
                className={`w-7 h-7 rounded-pill border items-center justify-center ${
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'bg-paper border-hairline active:bg-hairline'
                }`}
              >
                <Text
                  maxFontSizeMultiplier={1.3}
                  className={`text-[11px] font-bold ${
                    isSelected ? 'text-white' : 'text-mid-gray'
                  }`}
                >
                  {w.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ━━━ D. APARIENCIA / MODO OSCURO ━━━ */}
      <View className="pt-1">
        <Text
          maxFontSizeMultiplier={1.3}
          className="text-[11px] font-semibold uppercase tracking-[0.5px] text-mid-gray mb-1.5 px-0.5"
        >
          Apariencia
        </Text>
        <View className="flex-row gap-2">
          {(
            [
              { id: 'light', label: 'Claro', icon: Sun },
              { id: 'dark', label: 'Oscuro', icon: Moon },
              { id: 'system', label: 'Sistema', icon: Smartphone },
            ] as const
          ).map((themeOpt) => {
            const isSelected = preference === themeOpt.id;
            return (
              <Pressable
                key={themeOpt.id}
                accessibilityRole="button"
                accessibilityLabel={`Cambiar tema a ${themeOpt.label}`}
                onPress={() => setThemePreference(themeOpt.id)}
                className={`flex-1 min-h-[40px] py-2 px-2 rounded-pill border flex-row items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'bg-paper border-hairline active:bg-hairline'
                }`}
              >
                <Icon
                  icon={themeOpt.icon}
                  size="xs"
                  color={isSelected ? 'white' : 'mid-gray'}
                />
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className={`text-[12px] ${
                    isSelected ? 'text-white font-bold' : 'text-ink font-semibold'
                  }`}
                >
                  {themeOpt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ━━━ E. CONMUTADOR DE CUENTA DEMO (DISCRETO AL PIE) ━━━ */}
      <View className="pt-1">
        <Text
          maxFontSizeMultiplier={1.3}
          className="text-[11px] font-semibold uppercase tracking-[0.5px] text-mid-gray mb-1.5 px-0.5"
        >
          Modo Evaluación / Demo
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Activar perfil demo Valentina Pasajera"
            onPress={() => loginAsDemo('passenger')}
            className={`flex-1 py-2 px-3 rounded-pill border items-center justify-center ${
              user.id === 'usr-demo-01'
                ? 'bg-primary border-primary'
                : 'bg-paper border-hairline active:bg-hairline'
            }`}
          >
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className={`text-[12px] ${
                user.id === 'usr-demo-01'
                  ? 'text-white font-bold'
                  : 'text-ink font-semibold'
              }`}
            >
              Valentina (Pasajera)
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Activar perfil demo Carlos Conductor"
            onPress={() => loginAsDemo('driver')}
            className={`flex-1 py-2 px-3 rounded-pill border items-center justify-center ${
              user.id === 'usr-demo-02'
                ? 'bg-primary border-primary'
                : 'bg-paper border-hairline active:bg-hairline'
            }`}
          >
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className={`text-[12px] ${
                user.id === 'usr-demo-02'
                  ? 'text-white font-bold'
                  : 'text-ink font-semibold'
              }`}
            >
              Carlos (Conductor)
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ━━━ E. CERRAR SESIÓN (ACCIÓN DESTRUCTIVA AL FONDO) ━━━ */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión de AmigoUDES"
        onPress={handleLogout}
        className="mt-2 min-h-[46px] flex-row items-center justify-center gap-2 rounded-2xl bg-paper border border-destructive/30 py-3 active:bg-destructive/10 shadow-xs"
      >
        <Icon icon={LogOut} size="sm" color="destructive" />
        <Text
          maxFontSizeMultiplier={1.3}
          className="text-[13px] font-semibold text-destructive"
        >
          Cerrar Sesión
        </Text>
      </Pressable>
    </Animated.View>
  );
};
