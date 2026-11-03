import React, { useState } from 'react';
import { View, Text, Pressable, Alert, Linking, Share, Modal } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ArrowRight,
  Check,
  X,
  MessageCircle,
  MapPin,
  Clock,
  User,
  Star,
  Phone,
  Share2,
  Send,
} from 'lucide-react-native';
import { Card, Icon, StatusBadge, Button, Chip } from '@/components/ui';
import { useRideStore } from '@/features/rides';
import { useAuthStore } from '@/features/auth';
import { RequestCarFlowModal } from './RequestCarFlowModal';

export interface ActiveRideState {
  isPublished: boolean;
  timeSlot: string;
  availableSeats: number;
  totalSeats: number;
  confirmedPassengers: {
    id: string;
    name: string;
    faculty: string;
    pickupPoint: string;
    phone: string;
  }[];
  driverName?: string;
  driverCar?: string;
}

export interface RidesTabViewProps {
  className?: string;
  // Props opcionales para compatibilidad retroactiva
  user?: any;
  activeRole?: any;
  activeRide?: ActiveRideState;
  onPublishRide?: (seats: number, timeSlot: string) => void;
  onCancelRide?: () => void;
  onBookRide?: (driverName: string, timeSlot: string) => void;
}

const COORDINATION_STEPS = [
  { key: 'confirmed', label: 'Confirmado' },
  { key: 'on_the_way', label: 'En camino' },
  { key: 'arrived', label: 'En Campus' },
] as const;

export const RidesTabView: React.FC<RidesTabViewProps> = ({ className = '' }) => {
  // Consumo directo de Zustand (Cero paso de props requerido)
  const authUser = useAuthStore((s) => s.user);
  const activeRole = authUser?.activeRole ?? 'passenger';

  const [isRequestCarModalOpen, setIsRequestCarModalOpen] = useState<boolean>(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState<boolean>(false);

  const tabFilter = useRideStore((s) => s.tabFilter);
  const setTabFilter = useRideStore((s) => s.setTabFilter);
  const driverRide = useRideStore((s) => s.driverRide);
  const passengerRide = useRideStore((s) => s.passengerRide);
  const pendingRequests = useRideStore((s) => s.pendingRequests);
  const history = useRideStore((s) => s.history);
  const publishDriverRide = useRideStore((s) => s.publishDriverRide);
  const cancelDriverRide = useRideStore((s) => s.cancelDriverRide);
  const cancelPassengerRide = useRideStore((s) => s.cancelPassengerRide);
  const updatePassengerRideStatus = useRideStore((s) => s.updatePassengerRideStatus);
  const acceptRequest = useRideStore((s) => s.acceptRequest);
  const rejectRequest = useRideStore((s) => s.rejectRequest);

  const [selectedSlot, setSelectedSlot] = useState<string>('6:30 AM');
  const activeRide = activeRole === 'driver' ? driverRide : passengerRide;

  const handleOpenWhatsApp = (
    phone: string,
    name: string,
    customMessage?: string
  ) => {
    const defaultText = `Hola ${name}, te escribo desde AmigoUDES. Te confirmo mi punto de encuentro en ${activeRide.pickupPoint ?? activeRide.originShort} para el viaje de las ${activeRide.time} a Campus Lagos.`;
    const message = encodeURIComponent(customMessage ?? defaultText);
    const url = `https://wa.me/57${phone}?text=${message}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Contacto', `Numero: +57 ${phone}`);
    });
  };

  const handleNotifyAtPickup = (phone: string, name: string) => {
    const text = `Hola ${name}, ya me encuentro en el punto acordado (${activeRide.pickupPoint ?? activeRide.originShort}). ¡Estoy atento a tu llegada!`;
    handleOpenWhatsApp(phone, name, text);
  };

  const handleCallPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Llamar', `Numero: +57 ${phone}`);
    });
  };

  const handleShareTrip = async () => {
    try {
      await Share.share({
        message: `Voy en camino a Campus Lagos UDES con el conductor ${activeRide.driverName ?? 'institucional'} (${activeRide.driverCar ?? 'Vehículo'} - Placa ${activeRide.plate ?? 'Registrada'}). Punto: ${activeRide.pickupPoint ?? activeRide.originShort}. Coordinado con AmigoUDES.`,
        title: 'Mi viaje UDES en tiempo real',
      });
    } catch {
      // Ignorar descarte
    }
  };

  const handleConfirmCancel = () => {
    setIsCancelConfirmOpen(true);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      className={`gap-4 pb-4 ${className}`.trim()}
    >
      {/* ━━━ A. ENCABEZADO MINIMALISTA ━━━ */}
      <View className="flex-row items-center justify-between">
        <Text
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          className="text-[22px] font-bold text-ink tracking-tight"
        >
          Mis viajes
        </Text>

        {/* Selector segmentado compacto: Hoy / Historial */}
        <View className="flex-row items-center bg-paper border border-hairline rounded-pill p-1 shadow-xs">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver viajes de hoy"
            onPress={() => setTabFilter('today')}
            className={`px-3 py-1 rounded-pill ${
              tabFilter === 'today' ? 'bg-primary-soft' : 'bg-transparent'
            }`}
          >
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className={`text-[12px] ${
                tabFilter === 'today'
                  ? 'font-bold text-primary'
                  : 'font-medium text-mid-gray'
              }`}
            >
              Hoy
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver historial de viajes"
            onPress={() => setTabFilter('history')}
            className={`px-3 py-1 rounded-pill ${
              tabFilter === 'history' ? 'bg-primary-soft' : 'bg-transparent'
            }`}
          >
            <Text
              maxFontSizeMultiplier={1.3}
              numberOfLines={1}
              className={`text-[12px] ${
                tabFilter === 'history'
                  ? 'font-bold text-primary'
                  : 'font-medium text-mid-gray'
              }`}
            >
              Historial
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ━━━ VISTA HOY ━━━ */}
      {tabFilter === 'today' ? (
        <View className="gap-3.5">
          {/* ━━━ B. TICKET DE ABORDAJE (VIAJE ACTIVO) ━━━ */}
          {activeRide.isActive ? (
            <Card className="p-4 bg-paper border border-hairline rounded-2xl shadow-xs">
              {/* Fila superior: Chip de estado + Badge de aporte */}
              <View className="flex-row items-center justify-between mb-3.5">
                <View className="flex-row items-center gap-1.5 bg-primary-soft border border-primary/20 px-2.5 py-1 rounded-pill">
                  <Icon icon={Clock} size="xs" color="primary" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[11px] font-bold text-primary"
                  >
                    Salida {activeRide.time}
                  </Text>
                </View>

                <StatusBadge
                  label={
                    activeRole === 'driver'
                      ? `${activeRide.contribution} COP`
                      : activeRide.contribution
                  }
                  variant="primary"
                />
              </View>

              {/* Trazado de ruta compacto tipo Boarding Pass */}
              <View className="flex-row items-center justify-between bg-canvas px-3 py-2.5 rounded-xl border border-hairline mb-3">
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon icon={MapPin} size="xs" color="mid-gray" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[13px] font-bold text-ink"
                  >
                    {activeRide.originShort}
                  </Text>
                </View>

                <View className="flex-1 flex-row items-center justify-center px-3">
                  <View className="h-[1px] flex-1 bg-hairline" />
                  <View className="px-1.5">
                    <Icon icon={ArrowRight} size="xs" color="mid-gray" />
                  </View>
                  <View className="h-[1px] flex-1 bg-hairline" />
                </View>

                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Icon icon={MapPin} size="xs" color="primary" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[13px] font-bold text-primary"
                  >
                    {activeRide.destinationShort}
                  </Text>
                </View>
              </View>

              {/* Modo Pasajero: Coordinación en Vivo */}
              {activeRole === 'passenger' ? (
                <View className="gap-3">
                  {/* Stepper de Progreso */}
                  <View className="flex-row items-center justify-between bg-canvas px-3 py-2 rounded-xl border border-hairline">
                    {COORDINATION_STEPS.map((step, idx) => {
                      const isCurrent = (activeRide.statusStep ?? 'confirmed') === step.key;
                      const isPast =
                        activeRide.statusStep === 'arrived' ||
                        (activeRide.statusStep === 'on_the_way' && step.key === 'confirmed');

                      return (
                        <Pressable
                          key={step.key}
                          onPress={() => updatePassengerRideStatus(step.key)}
                          className="flex-row items-center gap-1.5 py-0.5"
                        >
                          <View
                            className={`w-5 h-5 rounded-full items-center justify-center ${
                              isCurrent || isPast
                                ? 'bg-primary'
                                : 'bg-canvas border border-hairline'
                            }`}
                          >
                            {isCurrent || isPast ? (
                              <Icon icon={Check} size="xs" color="white" />
                            ) : (
                              <View className="w-1.5 h-1.5 rounded-full bg-mid-gray" />
                            )}
                          </View>
                          <Text
                            maxFontSizeMultiplier={1.3}
                            numberOfLines={1}
                            className={`text-[11px] ${
                              isCurrent
                                ? 'font-bold text-primary'
                                : isPast
                                ? 'font-semibold text-ink'
                                : 'text-mid-gray'
                            }`}
                          >
                            {step.label}
                          </Text>
                          {idx < COORDINATION_STEPS.length - 1 ? (
                            <View className="w-3 h-[1px] bg-hairline mx-1" />
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Conductor y Vehículo */}
                  <View className="flex-row items-center justify-between bg-canvas p-3 rounded-xl border border-hairline">
                    <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
                      <View className="w-9 h-9 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className="text-[13px] font-bold text-primary"
                        >
                          {activeRide.driverName?.charAt(0) ?? 'C'}
                        </Text>
                      </View>
                      <View className="flex-1 min-w-0">
                        <View className="flex-row items-center gap-1.5">
                          <Text
                            maxFontSizeMultiplier={1.3}
                            numberOfLines={1}
                            className="text-[13px] font-bold text-ink"
                          >
                            {activeRide.driverName}
                          </Text>
                          <View className="flex-row items-center gap-0.5 bg-paper px-1.5 py-0.5 rounded-pill border border-hairline">
                            <Icon icon={Star} size="xs" color="primary" />
                            <Text
                              maxFontSizeMultiplier={1.3}
                              className="text-[10px] font-semibold text-primary"
                            >
                              {activeRide.driverRating ?? 4.9}
                            </Text>
                          </View>
                        </View>
                        <Text
                          maxFontSizeMultiplier={1.3}
                          numberOfLines={1}
                          className="text-[11px] text-mid-gray mt-0.5"
                        >
                          {activeRide.driverCar} · Placa {activeRide.plate ?? 'WKL-823'}
                        </Text>
                      </View>
                    </View>

                    {/* Acciones directas de llamada y compartir */}
                    <View className="flex-row items-center gap-1.5 shrink-0">
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Llamar al conductor"
                        onPress={() =>
                          handleCallPhone(activeRide.driverPhone ?? '3184567890')
                        }
                        className="w-8 h-8 rounded-full bg-paper border border-hairline items-center justify-center active:bg-hairline"
                      >
                        <Icon icon={Phone} size="xs" color="ink" />
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Compartir viaje"
                        onPress={handleShareTrip}
                        className="w-8 h-8 rounded-full bg-paper border border-hairline items-center justify-center active:bg-hairline"
                      >
                        <Icon icon={Share2} size="xs" color="ink" />
                      </Pressable>
                    </View>
                  </View>

                  {/* Punto de Encuentro Acordado */}
                  <View className="bg-canvas p-3 rounded-xl border border-hairline">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Icon icon={MapPin} size="xs" color="primary" />
                      <Text
                        maxFontSizeMultiplier={1.3}
                        className="text-[10px] font-bold uppercase tracking-wider text-primary"
                      >
                        Punto de encuentro acordado
                      </Text>
                    </View>
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={2}
                      className="text-[12px] font-semibold text-ink pl-5"
                    >
                      {activeRide.pickupPoint ?? 'Parque San Pío (Cra 33 con Calle 45)'}
                    </Text>
                    {activeRide.note ? (
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[11px] text-mid-gray italic pl-5 mt-1"
                      >
                        Nota: {`"${activeRide.note}"`}
                      </Text>
                    ) : null}
                  </View>

                  {/* Botones de Coordinación Directa WhatsApp */}
                  <View className="gap-2">
                    <Button
                      label="Coordinar por WhatsApp"
                      icon={<Icon icon={MessageCircle} size="xs" color="white" />}
                      size="sm"
                      variant="primary"
                      fullWidth
                      onPress={() =>
                        handleOpenWhatsApp(
                          activeRide.driverPhone ?? '3184567890',
                          activeRide.driverName ?? 'Conductor'
                        )
                      }
                    />

                    <Button
                      label="Avisar que ya estoy en el punto"
                      icon={<Icon icon={Send} size="xs" color="primary" />}
                      size="sm"
                      variant="outline"
                      fullWidth
                      onPress={() =>
                        handleNotifyAtPickup(
                          activeRide.driverPhone ?? '3184567890',
                          activeRide.driverName ?? 'Conductor'
                        )
                      }
                    />
                  </View>
                </View>
              ) : (
                /* Modo Conductor: Control de Cupos y Pasajeros */
                <View className="gap-3">
                  <View className="flex-row items-center justify-between pt-0.5">
                    {/* Indicador visual de cupos con dots */}
                    <View className="flex-row items-center gap-2">
                      <View className="flex-row items-center gap-1">
                        {Array.from({ length: activeRide.totalSeats }).map((_, idx) => (
                          <View
                            key={idx}
                            className={`w-2.5 h-2.5 rounded-full ${
                              idx < activeRide.occupiedSeats
                                ? 'bg-primary'
                                : 'bg-hairline border border-hairline'
                            }`}
                          />
                        ))}
                      </View>
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[12px] font-semibold text-ink"
                      >
                        {activeRide.occupiedSeats} de {activeRide.totalSeats} cupos
                      </Text>
                    </View>

                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[12px] font-bold text-primary"
                    >
                      {activeRide.contribution} recaudado
                    </Text>
                  </View>

                  {/* Lista de pasajeros a bordo */}
                  {activeRide.passengers.length > 0 ? (
                    <View className="gap-2 pt-1 border-t border-hairline">
                      <Text className="text-[11px] font-bold uppercase tracking-wider text-mid-gray px-1">
                        Pasajeros confirmados ({activeRide.passengers.length})
                      </Text>
                      {activeRide.passengers.map((p) => (
                        <View
                          key={p.id}
                          className="flex-row items-center justify-between bg-canvas p-2.5 rounded-xl border border-hairline"
                        >
                          <View className="flex-row items-center gap-2 flex-1 min-w-0 mr-2">
                            <View className="w-7 h-7 rounded-full bg-primary-soft items-center justify-center shrink-0">
                              <Text className="text-[11px] font-bold text-primary">
                                {p.name.charAt(0)}
                              </Text>
                            </View>
                            <View className="flex-1 min-w-0">
                              <Text
                                numberOfLines={1}
                                className="text-[12px] font-bold text-ink"
                              >
                                {p.name}
                              </Text>
                              <View className="flex-row items-center gap-1 mt-0.5">
                                <Icon icon={MapPin} size="xs" color="mid-gray" />
                                <Text
                                  numberOfLines={1}
                                  className="text-[10px] text-mid-gray"
                                >
                                  {p.pickupShort}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View className="flex-row items-center gap-1.5 shrink-0">
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`WhatsApp a ${p.name}`}
                              onPress={() =>
                                handleOpenWhatsApp(
                                  p.phone,
                                  p.name,
                                  `Hola ${p.name}, salgo en camino hacia Campus Lagos. Te recojo en ${p.pickupShort}. ¿Listo?`
                                )
                              }
                              className="w-8 h-8 rounded-full bg-primary-soft border border-primary/20 items-center justify-center active:opacity-70"
                            >
                              <Icon icon={MessageCircle} size="xs" color="primary" />
                            </Pressable>

                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Llamar a ${p.name}`}
                              onPress={() => handleCallPhone(p.phone)}
                              className="w-8 h-8 rounded-full bg-paper border border-hairline items-center justify-center active:bg-hairline"
                            >
                              <Icon icon={Phone} size="xs" color="ink" />
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              )}

              {/* Pie de tarjeta: Botón secundario directo */}
              <View className="flex-row items-center justify-between pt-3 mt-3 border-t border-hairline">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    activeRole === 'driver' ? 'Cerrar viaje' : 'Cancelar reserva'
                  }
                  onPress={handleConfirmCancel}
                  className="py-1"
                >
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[12px] font-medium text-destructive"
                  >
                    {activeRole === 'driver' ? 'Cancelar viaje' : 'Cancelar cupo'}
                  </Text>
                </Pressable>

                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[11px] font-medium text-mid-gray"
                >
                  UDES Lagos del Cacique
                </Text>
              </View>
            </Card>
          ) : (
            /* Estado rápido si NO hay viaje activo hoy */
            <Card className="p-4 bg-paper border border-hairline rounded-2xl shadow-xs">
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[14px] font-bold text-ink"
                >
                  {activeRole === 'driver' ? 'Salida de hoy' : 'Pedir un carro hoy'}
                </Text>
                <StatusBadge
                  label={activeRole === 'driver' ? 'PROGRAMAR' : '$2.500 COP'}
                  variant={activeRole === 'driver' ? 'soft' : 'primary'}
                />
              </View>

              {activeRole === 'driver' ? (
                <>
                  <View className="flex-row items-center gap-2 mb-3">
                    {['6:30 AM', '7:00 AM', '12:00 M', '2:00 PM'].map((slot) => (
                      <Chip
                        key={slot}
                        label={slot}
                        selected={selectedSlot === slot}
                        onPress={() => setSelectedSlot(slot)}
                        className="flex-1 py-1.5"
                      />
                    ))}
                  </View>

                  <Button
                    label="Publicar ruta"
                    variant="primary"
                    size="sm"
                    fullWidth
                    onPress={() =>
                      publishDriverRide(selectedSlot, authUser?.vehicle?.seats ?? 3)
                    }
                  />
                </>
              ) : (
                <View className="gap-3">
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[12px] text-mid-gray"
                  >
                    Encuentra conductores UDES en tu zona y viaja seguro a Campus Lagos.
                  </Text>

                  <Button
                    label="Pedir un carro a Campus Lagos"
                    variant="primary"
                    size="sm"
                    fullWidth
                    onPress={() => setIsRequestCarModalOpen(true)}
                  />
                </View>
              )}
            </Card>
          )}

          {/* ━━━ C. BANDEJA DE SOLICITUDES (SOLO CONDUCTOR) ━━━ */}
          {activeRole === 'driver' && pendingRequests.length > 0 ? (
            <View className="mt-1">
              <View className="flex-row items-center justify-between mb-2 px-1">
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] font-bold uppercase tracking-[0.5px] text-ink"
                >
                  Solicitudes ({pendingRequests.length})
                </Text>
                <StatusBadge
                  label={`${pendingRequests.length} pendientes`}
                  variant="primary"
                />
              </View>

              <View className="gap-2">
                {pendingRequests.map((req) => (
                  <View
                    key={req.id}
                    className="h-[60px] bg-paper border border-hairline rounded-xl px-3 flex-row items-center justify-between shadow-xs"
                  >
                    <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
                      <View className="w-8 h-8 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className="text-[11px] font-bold text-primary"
                        >
                          {req.name.charAt(0)}
                        </Text>
                      </View>

                      <View className="flex-1 min-w-0">
                        <View className="flex-row items-center gap-1.5">
                          <Text
                            maxFontSizeMultiplier={1.3}
                            numberOfLines={1}
                            className="text-[13px] font-bold text-ink shrink"
                          >
                            {req.name}
                          </Text>
                          <Text
                            maxFontSizeMultiplier={1.3}
                            numberOfLines={1}
                            className="text-[11px] text-mid-gray shrink-0"
                          >
                            {req.faculty}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <Icon icon={MapPin} size="xs" color="mid-gray" />
                          <Text
                            maxFontSizeMultiplier={1.3}
                            numberOfLines={1}
                            className="text-[11px] text-mid-gray"
                          >
                            {req.pickupShort}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Botones circulares rápidos: Declinar (X) y Aceptar (Check) */}
                    <View className="flex-row items-center gap-2 shrink-0">
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Declinar solicitud"
                        onPress={() => rejectRequest(req.id)}
                        className="w-8 h-8 rounded-full bg-canvas border border-hairline items-center justify-center active:bg-hairline"
                      >
                        <Icon icon={X} size="xs" color="mid-gray" />
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Aceptar solicitud"
                        onPress={() => acceptRequest(req.id)}
                        className="w-8 h-8 rounded-full bg-primary items-center justify-center active:opacity-80"
                      >
                        <Icon icon={Check} size="xs" color="white" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        /* ━━━ D. HISTORIAL / VIAJES ANTERIORES ━━━ */
        <Card className="p-4 bg-paper border border-hairline rounded-2xl shadow-xs">
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            className="text-[12px] font-bold uppercase tracking-[0.5px] text-ink mb-2"
          >
            Registro de viajes
          </Text>

          <View>
            {history.map((item, index) => (
              <View
                key={item.id}
                className={`py-3 ${
                  index !== history.length - 1 ? 'border-b border-hairline' : ''
                }`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center gap-1.5 flex-1 min-w-0 mr-2">
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[11px] font-bold text-mid-gray uppercase tracking-wider shrink-0"
                    >
                      {item.date}
                    </Text>
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[13px] font-bold text-ink"
                    >
                      {item.originShort}
                    </Text>
                    <Icon icon={ArrowRight} size="xs" color="mid-gray" />
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[13px] font-bold text-ink"
                    >
                      {item.destinationShort}
                    </Text>
                  </View>

                  <StatusBadge
                    label={item.status}
                    variant={item.status === 'Completado' ? 'soft' : 'destructive'}
                  />
                </View>

                <View className="flex-row items-center justify-between mt-0.5">
                  <View className="flex-row items-center gap-1">
                    <Icon icon={User} size="xs" color="mid-gray" />
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[11px] text-mid-gray"
                    >
                      {item.companion}
                    </Text>
                  </View>

                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[11px] font-bold text-ink"
                  >
                    {item.contribution}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Modal para pedir carro bajo demanda */}
      <RequestCarFlowModal
        visible={isRequestCarModalOpen}
        onClose={() => setIsRequestCarModalOpen(false)}
      />

      {/* Modal de confirmación para cancelar cupo / viaje */}
      <Modal
        visible={isCancelConfirmOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCancelConfirmOpen(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-paper rounded-2xl p-5 w-full max-w-sm border border-hairline shadow-md gap-3">
            <View className="flex-row items-center gap-2.5">
              <View className="w-9 h-9 rounded-full bg-destructive/10 items-center justify-center shrink-0">
                <Icon icon={X} size="xs" color="destructive" />
              </View>
              <Text
                maxFontSizeMultiplier={1.3}
                className="text-[16px] font-bold text-ink flex-1"
              >
                {activeRole === 'driver' ? '¿Cancelar viaje?' : '¿Cancelar cupo?'}
              </Text>
            </View>

            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[13px] text-mid-gray leading-relaxed"
            >
              {activeRole === 'driver'
                ? 'Se notificará a los pasajeros confirmados que el viaje ha sido cancelado.'
                : 'Liberarás tu lugar en este vehículo para que otro compañero pueda tomarlo.'}
            </Text>

            <View className="flex-row items-center gap-2.5 pt-2">
              <Button
                label="Volver"
                variant="outline"
                size="sm"
                className="flex-1"
                onPress={() => setIsCancelConfirmOpen(false)}
              />
              <Button
                label="Sí, cancelar"
                variant="destructive"
                size="sm"
                className="flex-1"
                onPress={() => {
                  setIsCancelConfirmOpen(false);
                  if (activeRole === 'driver') {
                    cancelDriverRide();
                  } else {
                    cancelPassengerRide();
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

