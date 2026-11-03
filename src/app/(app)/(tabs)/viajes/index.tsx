import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, Linking, Share, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowRight,
  Check,
  X,
  MessageCircle,
  MapPin,
  Car,
  Fuel,
  Star,
  ChevronDown,
  ChevronUp,
  Phone,
  Share2,
  Send,
  Clock,
} from 'lucide-react-native';
import { Card, Icon, StatusBadge, Button } from '@/components/ui';
import { RequestCarFlowModal } from '@/components/dashboard';
import { useRideStore } from '@/features/rides';
import { useAuthStore } from '@/features/auth';

function useSafeTabBarHeight(): number {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 10);
  return bottomInset + 64;
}

const COORDINATION_STEPS = [
  { key: 'confirmed', label: 'Confirmado' },
  { key: 'on_the_way', label: 'En camino' },
  { key: 'arrived', label: 'En Campus' },
] as const;

export default function MisViajesScreen() {
  const user = useAuthStore((s) => s.user);
  const activeRole = user?.activeRole ?? 'passenger';

  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState<boolean>(false);

  const driverRide = useRideStore((s) => s.driverRide);
  const passengerRide = useRideStore((s) => s.passengerRide);
  const pendingRequests = useRideStore((s) => s.pendingRequests);
  const history = useRideStore((s) => s.history);
  const acceptRequest = useRideStore((s) => s.acceptRequest);
  const rejectRequest = useRideStore((s) => s.rejectRequest);
  const cancelPassengerRide = useRideStore((s) => s.cancelPassengerRide);
  const updatePassengerRideStatus = useRideStore((s) => s.updatePassengerRideStatus);

  const bottomTabBarHeight = useSafeTabBarHeight();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(true);

  const isTodayActive =
    activeRole === 'driver' ? driverRide.isActive : passengerRide.isActive;

  const handleOpenWhatsApp = (phone: string, name: string, customMessage?: string) => {
    const defaultText = `Hola ${name}, te escribo desde AmigoUDES. Te confirmo mi punto de encuentro en ${passengerRide.pickupPoint ?? passengerRide.originShort} para el viaje de las ${passengerRide.time} a Campus Lagos.`;
    const message = encodeURIComponent(customMessage ?? defaultText);
    const url = `https://wa.me/57${phone}?text=${message}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Contacto', `Numero: +57 ${phone}`);
    });
  };

  const handleNotifyAtPickup = (phone: string, name: string) => {
    const text = `Hola ${name}, ya me encuentro en el punto acordado (${passengerRide.pickupPoint ?? passengerRide.originShort}). ¡Estoy atento a tu llegada!`;
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
        message: `Voy en camino a Campus Lagos UDES con el conductor ${passengerRide.driverName ?? 'institucional'} (${passengerRide.driverCar ?? 'Vehículo'} - Placa ${passengerRide.plate ?? 'Registrada'}). Punto: ${passengerRide.pickupPoint ?? passengerRide.originShort}. Coordinado con AmigoUDES.`,
        title: 'Mi viaje UDES en tiempo real',
      });
    } catch {
      // Ignorar descarte
    }
  };

  const handleConfirmCancelPassenger = () => {
    setIsCancelConfirmOpen(true);
  };

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="p-4"
      contentContainerStyle={{ paddingBottom: bottomTabBarHeight + 20 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ━━━ A. ENCABEZADO Y CONTADOR (MINIMALISTA) ━━━ */}
      <View className="mb-3.5">
        <Text
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          className="text-[22px] font-bold text-ink tracking-tight"
        >
          Mis viajes
        </Text>
        <Text
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          className="text-[13px] text-mid-gray mt-0.5"
        >
          {isTodayActive
            ? '1 viaje programado para hoy'
            : 'Sin viajes activos para hoy'}
        </Text>
      </View>

      {/* ━━━ B. MODO CONDUCTOR (GESTIÓN DE CUPOS Y ABORDAJE) ━━━ */}
      {activeRole === 'driver' ? (
        <View className="gap-3.5">
          {/* 1. Métrica Compacta de Gasolina (1 sola fila) */}
          <View className="flex-row items-center justify-between bg-paper border border-hairline rounded-xl p-3 shadow-xs">
            <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
              <View className="w-8 h-8 rounded-full bg-primary-soft items-center justify-center border border-primary/20 shrink-0">
                <Icon icon={Fuel} size="xs" color="primary" />
              </View>
              <View className="flex-row items-center gap-1.5 flex-1 min-w-0 flex-wrap">
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[18px] font-bold text-ink"
                >
                  {driverRide.contribution} COP
                </Text>
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] text-mid-gray shrink-0"
                >
                  · {driverRide.occupiedSeats} aportes confirmados
                </Text>
              </View>
            </View>
            <StatusBadge label="Gasolina" variant="soft" />
          </View>

          {/* 2. Bandeja de Solicitudes Rápidas (si hay pendientes) */}
          {pendingRequests.length > 0 ? (
            <View>
              <View className="flex-row items-center justify-between mb-2 px-1">
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] font-bold uppercase tracking-[0.5px] text-ink"
                >
                  Solicitudes
                </Text>
                <StatusBadge
                  label={`${pendingRequests.length}`}
                  variant="primary"
                />
              </View>

              <View className="gap-2">
                {pendingRequests.map((req) => (
                  <View
                    key={req.id}
                    className="p-3 rounded-xl border border-hairline bg-paper shadow-xs flex-row items-center justify-between"
                  >
                    {/* Izquierda: Avatar + Nombre + Punto de recogida */}
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
                        <Text
                          maxFontSizeMultiplier={1.3}
                          numberOfLines={1}
                          className="text-[13px] font-bold text-ink"
                        >
                          {req.name}
                        </Text>
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

                    {/* Derecha: Botones circulares rápidos de 36px */}
                    <View className="flex-row items-center gap-2 shrink-0">
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Rechazar solicitud"
                        onPress={() => rejectRequest(req.id)}
                        className="w-9 h-9 rounded-full bg-canvas border border-hairline items-center justify-center active:bg-hairline"
                      >
                        <Icon icon={X} size="xs" color="mid-gray" />
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Aceptar solicitud"
                        onPress={() => acceptRequest(req.id)}
                        className="w-9 h-9 rounded-full bg-primary items-center justify-center active:opacity-80"
                      >
                        <Icon icon={Check} size="xs" color="white" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* 3. Lista de Abordaje Confirmada */}
          <View>
            <View className="flex-row items-center justify-between mb-2 px-1">
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className="text-[12px] font-bold uppercase tracking-[0.5px] text-ink"
              >
                En tu carro hoy ({driverRide.occupiedSeats}/{driverRide.totalSeats} cupos)
              </Text>
              <StatusBadge label="HOY" variant="soft" />
            </View>

            <View className="gap-2">
              {driverRide.passengers.map((p) => (
                <View
                  key={p.id}
                  className="flex-row items-center justify-between bg-paper border border-hairline rounded-xl p-3 shadow-xs"
                >
                  <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
                    <View className="w-8 h-8 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                      <Text
                        maxFontSizeMultiplier={1.3}
                        className="text-[11px] font-bold text-primary"
                      >
                        {p.name.charAt(0)}
                      </Text>
                    </View>

                    <View className="flex-1 min-w-0">
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[13px] font-bold text-ink"
                      >
                        {p.name}
                      </Text>
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <Icon icon={MapPin} size="xs" color="mid-gray" />
                        <Text
                          maxFontSizeMultiplier={1.3}
                          numberOfLines={1}
                          className="text-[11px] text-mid-gray"
                        >
                          {p.pickupShort}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Chat WhatsApp con pasajero"
                    onPress={() => handleOpenWhatsApp(p.phone, p.name)}
                    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-pill bg-primary-soft border border-primary/20 shrink-0 active:opacity-70"
                  >
                    <Icon icon={MessageCircle} size="xs" color="primary" />
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[11px] font-bold text-primary"
                    >
                      Chat
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        /* ━━━ C. MODO PASAJERO (PASE DE ABORDAJE / TU RESERVA) ━━━ */
        <View className="gap-3.5">
          {passengerRide.isActive ? (
            /* 1. Ticket de Abordaje Activo */
            <Card className="p-4 bg-paper border border-hairline rounded-2xl shadow-xs">
              {/* Fila 1: Ruta y Hora */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-1.5 bg-primary-soft border border-primary/20 px-2.5 py-1 rounded-pill">
                  <Icon icon={Clock} size="xs" color="primary" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[11px] font-bold text-primary"
                  >
                    Salida {passengerRide.time}
                  </Text>
                </View>

                <StatusBadge label={`${passengerRide.contribution} COP`} variant="primary" />
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
                    {passengerRide.originShort}
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
                    {passengerRide.destinationShort}
                  </Text>
                </View>
              </View>

              {/* Stepper de Progreso */}
              <View className="flex-row items-center justify-between bg-canvas px-3 py-2 rounded-xl border border-hairline mb-3">
                {COORDINATION_STEPS.map((step, idx) => {
                  const isCurrent = (passengerRide.statusStep ?? 'confirmed') === step.key;
                  const isPast =
                    passengerRide.statusStep === 'arrived' ||
                    (passengerRide.statusStep === 'on_the_way' && step.key === 'confirmed');

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
              <View className="flex-row items-center justify-between bg-canvas p-3 rounded-xl border border-hairline mb-3">
                <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
                  <View className="w-9 h-9 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[13px] font-bold text-primary"
                    >
                      {passengerRide.driverName?.charAt(0) ?? 'C'}
                    </Text>
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-center gap-1.5">
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[13px] font-bold text-ink"
                      >
                        {passengerRide.driverName}
                      </Text>
                      <View className="flex-row items-center gap-0.5 bg-paper px-1.5 py-0.5 rounded-pill border border-hairline">
                        <Icon icon={Star} size="xs" color="primary" />
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className="text-[10px] font-semibold text-primary"
                        >
                          {passengerRide.driverRating ?? 4.9}
                        </Text>
                      </View>
                    </View>
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[11px] text-mid-gray mt-0.5"
                    >
                      {passengerRide.driverCar} · Placa {passengerRide.plate ?? 'WKL-823'}
                    </Text>
                  </View>
                </View>

                {/* Acciones directas de llamada y compartir */}
                <View className="flex-row items-center gap-1.5 shrink-0">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Llamar al conductor"
                    onPress={() =>
                      handleCallPhone(passengerRide.driverPhone ?? '3184567890')
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
              <View className="bg-canvas p-3 rounded-xl border border-hairline mb-3">
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
                  {passengerRide.pickupPoint ?? 'Parque San Pío (Cra 33 con Calle 45)'}
                </Text>
                {passengerRide.note ? (
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[11px] text-mid-gray italic pl-5 mt-1"
                  >
                    Nota: {`"${passengerRide.note}"`}
                  </Text>
                ) : null}
              </View>

              {/* Botones de Coordinación Directa WhatsApp */}
              <View className="gap-2 mb-3">
                <Button
                  label="Coordinar por WhatsApp"
                  icon={<Icon icon={MessageCircle} size="xs" color="white" />}
                  size="sm"
                  variant="primary"
                  fullWidth
                  onPress={() =>
                    handleOpenWhatsApp(
                      passengerRide.driverPhone ?? '3184567890',
                      passengerRide.driverName ?? 'Conductor'
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
                      passengerRide.driverPhone ?? '3184567890',
                      passengerRide.driverName ?? 'Conductor'
                    )
                  }
                />
              </View>

              {/* Pie de tarjeta: Cancelar cupo */}
              <View className="flex-row items-center justify-between pt-2.5 border-t border-hairline">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar reserva"
                  onPress={handleConfirmCancelPassenger}
                  className="py-1"
                >
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[12px] font-medium text-destructive"
                  >
                    Cancelar cupo
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
            /* 2. Estado Sin Viaje */
            <Card className="p-5 bg-paper border border-hairline rounded-2xl shadow-xs items-center justify-center">
              <View className="w-10 h-10 rounded-full bg-primary-soft items-center justify-center mb-2">
                <Icon icon={Car} size="sm" color="primary" />
              </View>
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className="text-[14px] font-bold text-ink mb-3"
              >
                No tienes viajes para hoy
              </Text>
              <Button
                label="Pedir un carro a Campus Lagos"
                variant="primary"
                size="sm"
                onPress={() => setIsRequestModalOpen(true)}
              />
            </Card>
          )}
        </View>
      )}

      {/* ━━━ D. HISTORIAL RECIENTE (COMÚN PARA AMBOS ROLES) ━━━ */}
      <View className="mt-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Alternar visualización de viajes anteriores"
          onPress={() => setIsHistoryExpanded((prev) => !prev)}
          className="flex-row items-center justify-between mb-2 px-1"
        >
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            className="text-[12px] font-bold uppercase tracking-[0.5px] text-ink"
          >
            Anteriores
          </Text>
          <Icon
            icon={isHistoryExpanded ? ChevronUp : ChevronDown}
            size="xs"
            color="mid-gray"
          />
        </Pressable>

        {isHistoryExpanded ? (
          <View className="bg-paper border border-hairline rounded-2xl p-3 shadow-xs">
            {history.slice(0, 3).map((item, idx) => (
              <View
                key={item.id}
                className={`py-2.5 flex-row items-center justify-between ${
                  idx !== Math.min(history.length, 3) - 1
                    ? 'border-b border-hairline'
                    : ''
                }`}
              >
                <View className="flex-row items-center gap-1.5 flex-1 min-w-0 mr-2">
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[11px] font-bold text-mid-gray shrink-0"
                  >
                    {item.date}
                  </Text>
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[12px] text-ink flex-1 min-w-0"
                  >
                    · {item.destinationShort} · {item.companion} · {item.contribution}
                  </Text>
                </View>

                <StatusBadge label={item.status} variant="soft" />
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <RequestCarFlowModal
        visible={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      {/* Modal de confirmación para cancelar cupo */}
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
                ¿Cancelar cupo?
              </Text>
            </View>

            <Text
              maxFontSizeMultiplier={1.3}
              className="text-[13px] text-mid-gray leading-relaxed"
            >
              Liberarás tu lugar en este vehículo para que otro compañero pueda tomarlo.
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
                  cancelPassengerRide();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

