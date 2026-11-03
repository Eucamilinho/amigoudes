import React from 'react';
import { View, Text, Alert, Linking, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ArrowRight,
  Check,
  X,
  MessageCircle,
  MapPin,
  Car,
  Fuel,
  Star,
} from 'lucide-react-native';
import { Card, Icon, StatusBadge, Button } from '@/components/ui';
import { useRideStore } from '@/features/rides';
import { useAuthStore } from '@/features/auth';
import type { AppRole } from '@/types/theme';

export interface BookingRequest {
  id: string;
  name: string;
  faculty: string;
  phone: string;
  pickupPoint: string;
  rating: number;
  time: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ActivityTabViewProps {
  activeRole?: AppRole;
  confirmedCount?: number;
  onAcceptRequest?: (req: BookingRequest) => void;
  onRejectRequest?: (id: string) => void;
  className?: string;
}

export const ActivityTabView: React.FC<ActivityTabViewProps> = ({
  activeRole: propRole,
  className = '',
}) => {
  const authUser = useAuthStore((s) => s.user);
  const activeRole: AppRole = propRole ?? authUser?.activeRole ?? 'passenger';

  const driverRide = useRideStore((s) => s.driverRide);
  const passengerRide = useRideStore((s) => s.passengerRide);
  const pendingRequests = useRideStore((s) => s.pendingRequests);
  const history = useRideStore((s) => s.history);
  const acceptRequest = useRideStore((s) => s.acceptRequest);
  const rejectRequest = useRideStore((s) => s.rejectRequest);
  const requestPassengerRide = useRideStore((s) => s.requestPassengerRide);

  const isTodayActive =
    activeRole === 'driver' ? driverRide.isActive : passengerRide.isActive;

  const handleOpenWhatsApp = (phone: string, name: string) => {
    const text = encodeURIComponent(
      `Hola ${name}, te escribo desde AmigoUDES para coordinar el viaje a Campus Lagos.`
    );
    const url = `https://wa.me/57${phone}?text=${text}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Contacto', `Numero: +57 ${phone}`);
    });
  };

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      className={`gap-3.5 pb-6 ${className}`.trim()}
    >
      {/* ━━━ A. ENCABEZADO Y CONTADOR (MINIMALISTA) ━━━ */}
      <View>
        <Text
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          className="text-[22px] font-bold text-ink tracking-tight"
        >
          {activeRole === 'driver' ? 'Gestión de cupos' : 'Tu actividad'}
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

      {/* ━━━ B. MODO CONDUCTOR ━━━ */}
      {activeRole === 'driver' ? (
        <View className="gap-3.5">
          {/* 1. Métrica Compacta de Gasolina */}
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

          {/* 2. Bandeja de Solicitudes Rápidas */}
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
        /* ━━━ C. MODO PASAJERO ━━━ */
        <View className="gap-3.5">
          {passengerRide.isActive ? (
            /* 1. Ticket de Abordaje Activo */
            <Card className="p-4 bg-paper border-2 border-primary rounded-2xl shadow-xs">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2 flex-1 min-w-0 mr-2">
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[13px] font-bold text-ink"
                  >
                    {passengerRide.originShort}
                  </Text>
                  <Icon icon={ArrowRight} size="xs" color="mid-gray" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[13px] font-bold text-primary"
                  >
                    {passengerRide.destinationShort}
                  </Text>
                </View>

                <StatusBadge label={passengerRide.time} variant="primary" />
              </View>

              <View className="flex-row items-center gap-2 pt-1 mb-2.5">
                <View className="w-7 h-7 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[11px] font-bold text-primary"
                  >
                    {passengerRide.driverName?.charAt(0) ?? 'C'}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5 flex-1 min-w-0 flex-wrap">
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[13px] font-bold text-ink"
                  >
                    {passengerRide.driverName}
                  </Text>
                  <View className="flex-row items-center gap-0.5 bg-canvas px-1.5 py-0.5 rounded-pill border border-hairline">
                    <Icon icon={Star} size="xs" color="primary" />
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[10px] font-semibold text-primary"
                    >
                      4.9
                    </Text>
                  </View>
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[12px] text-mid-gray"
                  >
                    · {passengerRide.driverCar} ({passengerRide.plate})
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1.5 bg-canvas px-2.5 py-1.5 rounded-xl border border-hairline mb-3">
                <Icon icon={MapPin} size="xs" color="mid-gray" />
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] font-medium text-ink flex-1 min-w-0"
                >
                  Frente a C.C. Cuarta Etapa
                </Text>
              </View>

              <View className="flex-row items-center justify-between pt-2.5 border-t border-hairline">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Coordinar recogida por chat"
                  onPress={() =>
                    handleOpenWhatsApp(
                      passengerRide.driverPhone ?? '3184567890',
                      passengerRide.driverName ?? 'Conductor'
                    )
                  }
                  className="flex-row items-center gap-1.5 bg-primary px-3 py-2 rounded-pill active:opacity-80"
                >
                  <Icon icon={MessageCircle} size="xs" color="white" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    className="text-[12px] font-bold text-white"
                  >
                    Coordinar recogida
                  </Text>
                </Pressable>

                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] font-bold text-ink"
                >
                  Aporte {passengerRide.contribution} COP
                </Text>
              </View>
            </Card>
          ) : (
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
                label="Buscar viaje"
                variant="outline"
                size="sm"
                onPress={() => requestPassengerRide('6:30 AM')}
              />
            </Card>
          )}
        </View>
      )}

      {/* ━━━ D. HISTORIAL RECIENTE ━━━ */}
      <View className="mt-2">
        <Text
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          className="text-[12px] font-bold uppercase tracking-[0.5px] text-ink mb-2 px-1"
        >
          Anteriores
        </Text>

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
      </View>
    </Animated.View>
  );
};
