import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MapPin,
  Star,
  Car,
  ChevronDown,
  X,
  Search,
} from 'lucide-react-native';
import {
  Card,
  Button,
  StatusBadge,
  Icon,
} from '@/components/ui';
import {
  RouteMapPicker,
  BUCARAMANGA_SECTORS,
  POPULAR_ADDRESS_SUGGESTIONS,
  type SectorLocation,
} from '@/components/map/RouteMapPicker';
import { useAuthStore } from '@/features/auth';
import { useRideStore } from '@/features/rides';
import { BookRideModal, type DriverToBook } from '@/components/dashboard/BookRideModal';
import type { AppRole } from '@/types/theme';

export interface ExploreTabViewProps {
  activeRole?: AppRole;
  initialSectorName?: string;
  onBookRide?: (driverName: string) => void;
  className?: string;
}

export const ExploreTabView: React.FC<ExploreTabViewProps> = ({
  activeRole: propRole,
  initialSectorName = 'Cabecera',
  onBookRide,
  className = '',
}) => {
  const authUser = useAuthStore((s) => s.user);
  const activeRole: AppRole = propRole ?? authUser?.activeRole ?? 'passenger';
  const requestPassengerRide = useRideStore((s) => s.requestPassengerRide);

  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 10) + 70;

  const [selectedSector, setSelectedSector] = useState<SectorLocation>(() => {
    return (
      BUCARAMANGA_SECTORS.find(
        (s) =>
          s.shortName.toLowerCase() === initialSectorName.toLowerCase() ||
          s.name.toLowerCase() === initialSectorName.toLowerCase()
      ) ?? BUCARAMANGA_SECTORS[0]
    );
  });

  const [originAddress, setOriginAddress] = useState<string>(selectedSector.address);
  const [isSectorModalOpen, setIsSectorModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingDriver, setBookingDriver] = useState<DriverToBook | null>(null);

  // Estudiantes buscando cupo en el sector activo (Modo Conductor)
  const passengersInSector = [
    {
      id: 'p-1',
      name: 'Daniel M.',
      faculty: 'Medicina',
      spot: 'San Pío',
      deviation: '+80m',
      rating: 4.9,
    },
    {
      id: 'p-2',
      name: 'Mariana C.',
      faculty: 'Fisioterapia',
      spot: 'Cra 33 # 48',
      deviation: 'Directo',
      rating: 5.0,
    },
    {
      id: 'p-3',
      name: 'Felipe D.',
      faculty: 'Ingeniería',
      spot: 'Plaza Real',
      deviation: '+120m',
      rating: 4.8,
    },
    {
      id: 'p-4',
      name: 'Camila R.',
      faculty: 'Bacteriología',
      spot: 'Av. Samanes',
      deviation: 'Directo',
      rating: 4.9,
    },
  ];

  // Conductores saliendo del sector activo (Modo Pasajero)
  const driversInSector: DriverToBook[] = [
    {
      id: 'd-1',
      name: 'Ing. Carlos',
      car: 'Chevrolet Onix',
      plate: 'WKL-823',
      phone: '3184567890',
      seats: 2,
      time: '6:30 AM',
      rating: 4.9,
    },
    {
      id: 'd-2',
      name: 'Dra. Patricia',
      car: 'Renault Duster',
      plate: 'UDZ-104',
      phone: '3157891234',
      seats: 3,
      time: '6:45 AM',
      rating: 5.0,
    },
    {
      id: 'd-3',
      name: 'Prof. Andrés',
      car: 'Mazda 2',
      plate: 'BSM-992',
      phone: '3104567890',
      seats: 1,
      time: '7:00 AM',
      rating: 4.8,
    },
    {
      id: 'd-4',
      name: 'Dra. Andrea',
      car: 'Chevrolet Tracker',
      plate: 'TRK-441',
      phone: '3123456789',
      seats: 2,
      time: '7:15 AM',
      rating: 4.9,
    },
  ];

  const handleSelectSector = (sec: SectorLocation) => {
    setSelectedSector(sec);
    setOriginAddress(sec.address);
    setIsSectorModalOpen(false);
  };

  const handleBook = (driver: DriverToBook) => {
    setBookingDriver(driver);
  };

  const handleConfirmBooking = ({
    driver,
    pickupPoint,
    note,
  }: {
    driver: DriverToBook;
    pickupPoint: string;
    note?: string;
  }) => {
    requestPassengerRide(driver.time, selectedSector.shortName, {
      name: driver.name,
      car: driver.car,
      plate: driver.plate ?? 'WKL-823',
      phone: driver.phone ?? '3184567890',
      rating: driver.rating,
      pickupPoint,
      note,
    });
    onBookRide?.(driver.name);
    Alert.alert(
      `Cupo Confirmado con ${driver.name}`,
      `Punto de encuentro: ${pickupPoint} a las ${driver.time}.\n\nTu ticket está listo y ya puedes coordinar por WhatsApp en Mis viajes.`,
      [{ text: 'Ver viaje', onPress: () => onBookRide?.(driver.name) }]
    );
  };

  const handleInvite = (studentName: string) => {
    Alert.alert(
      'Invitación enviada',
      `Le has ofrecido un cupo a ${studentName} hacia Campus Lagos.`
    );
  };

  const filteredSectors = BUCARAMANGA_SECTORS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      style={{ paddingBottom: bottomPadding }}
      className={`gap-3 ${className}`.trim()}
    >
      {/* ━━━ A. ENCABEZADO MINIMALISTA ━━━ */}
      <View className="flex-row items-center justify-between">
        <Text
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
          className="text-[22px] font-bold text-ink tracking-tight"
        >
          Explorar ruta
        </Text>

        <StatusBadge
          label={activeRole === 'driver' ? 'Conductor' : 'Pasajero'}
          variant="primary"
        />
      </View>

      {/* Píldora interactiva del sector actual */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Sector actual: ${selectedSector.name}. Toca para cambiar.`}
        onPress={() => setIsSectorModalOpen(true)}
        className="flex-row items-center justify-between bg-paper border border-hairline rounded-pill px-3.5 py-2 shadow-xs active:bg-hairline"
      >
        <View className="flex-row items-center gap-2 flex-1 min-w-0 mr-2">
          <Icon icon={MapPin} size="xs" color="primary" />
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            className="text-[13px] font-bold text-ink flex-1 min-w-0"
          >
            {selectedSector.name} · {selectedSector.estTime} a UDES
          </Text>
        </View>

        <View className="w-5 h-5 rounded-full bg-canvas items-center justify-center shrink-0">
          <Icon icon={ChevronDown} size="xs" color="mid-gray" />
        </View>
      </Pressable>

      {/* ━━━ B. VISOR DE MAPA PROTAGONISTA ━━━ */}
      <View className="w-full rounded-2xl overflow-hidden border border-hairline shadow-xs bg-paper">
        <RouteMapPicker
          mapOnly
          mapHeight={260}
          selectedSectorName={selectedSector.shortName}
          onSelectSector={handleSelectSector}
          originAddress={originAddress}
          onChangeOriginAddress={setOriginAddress}
        />
      </View>

      {/* ━━━ C. CHIPS RÁPIDOS DE SECTORES (Scroll Horizontal) ━━━ */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-0.5 py-1"
        >
          {BUCARAMANGA_SECTORS.map((sec) => {
            const isSelected = sec.id === selectedSector.id;
            return (
              <Pressable
                key={sec.id}
                accessibilityRole="button"
                accessibilityLabel={`Seleccionar sector ${sec.shortName}`}
                onPress={() => handleSelectSector(sec)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-pill border ${
                  isSelected
                    ? 'bg-primary-soft border-primary'
                    : 'bg-paper border-hairline active:bg-hairline'
                }`}
              >
                <Icon
                  icon={MapPin}
                  size="xs"
                  color={isSelected ? 'primary' : 'mid-gray'}
                />
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className={`text-[12px] ${
                    isSelected ? 'font-bold text-primary' : 'font-medium text-ink'
                  }`}
                >
                  {sec.shortName}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ━━━ D. LISTADO COMPACTO DE COINCIDENCIAS (Carrusel Horizontal) ━━━ */}
      <View className="mt-1">
        <View className="flex-row items-center justify-between mb-2 px-1">
          <Text
            maxFontSizeMultiplier={1.3}
            numberOfLines={1}
            className="text-[12px] font-bold uppercase tracking-[0.5px] text-ink"
          >
            {activeRole === 'driver' ? 'Pasajeros en tu zona' : 'Conductores en tu zona'}
          </Text>

          <StatusBadge
            label={
              activeRole === 'driver'
                ? `${passengersInSector.length} estudiantes`
                : `${driversInSector.length} disponibles`
            }
            variant="soft"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2.5 px-0.5 py-0.5"
        >
          {activeRole === 'passenger'
            ? driversInSector.map((d) => (
                <Card
                  key={d.id}
                  className="w-[235px] p-3 bg-paper border border-hairline rounded-2xl shadow-xs justify-between"
                >
                  <View className="mb-2.5">
                    {/* Fila superior: Avatar + Nombre + Rating */}
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-2 flex-1 min-w-0 mr-1.5">
                        <View className="w-7 h-7 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                          <Text
                            maxFontSizeMultiplier={1.3}
                            className="text-[11px] font-bold text-primary"
                          >
                            {d.name.charAt(0)}
                          </Text>
                        </View>
                        <Text
                          maxFontSizeMultiplier={1.3}
                          numberOfLines={1}
                          className="text-[13px] font-bold text-ink flex-1 min-w-0"
                        >
                          {d.name}
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-0.5 bg-canvas px-1.5 py-0.5 rounded-pill border border-hairline shrink-0">
                        <Icon icon={Star} size="xs" color="primary" />
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className="text-[10px] font-semibold text-primary"
                        >
                          {d.rating}
                        </Text>
                      </View>
                    </View>

                    {/* Fila compacta de detalles de viaje */}
                    <View className="flex-row items-center gap-1.5">
                      <Icon icon={Car} size="xs" color="mid-gray" />
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[11px] text-mid-gray"
                      >
                        {d.car} · {d.seats} cupos · {d.time}
                      </Text>
                    </View>
                  </View>

                  <Button
                    label="Pedir cupo"
                    size="sm"
                    variant="primary"
                    fullWidth
                    onPress={() => handleBook(d)}
                  />
                </Card>
              ))
            : passengersInSector.map((p) => (
                <Card
                  key={p.id}
                  className="w-[235px] p-3 bg-paper border border-hairline rounded-2xl shadow-xs justify-between"
                >
                  <View className="mb-2.5">
                    {/* Fila superior: Avatar + Nombre + Carrera */}
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-2 flex-1 min-w-0 mr-1.5">
                        <View className="w-7 h-7 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                          <Text
                            maxFontSizeMultiplier={1.3}
                            className="text-[11px] font-bold text-primary"
                          >
                            {p.name.charAt(0)}
                          </Text>
                        </View>
                        <Text
                          maxFontSizeMultiplier={1.3}
                          numberOfLines={1}
                          className="text-[13px] font-bold text-ink shrink"
                        >
                          {p.name}
                        </Text>
                      </View>

                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[11px] font-medium text-mid-gray shrink-0"
                      >
                        {p.faculty}
                      </Text>
                    </View>

                    {/* Fila compacta: Parada + Desvío mínimo */}
                    <View className="flex-row items-center gap-1.5">
                      <Icon icon={MapPin} size="xs" color="mid-gray" />
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[11px] text-mid-gray"
                      >
                        {p.spot} · {p.deviation}
                      </Text>
                    </View>
                  </View>

                  <Button
                    label="Invitar"
                    size="sm"
                    variant="primary"
                    fullWidth
                    onPress={() => handleInvite(p.name)}
                  />
                </Card>
              ))}
        </ScrollView>
      </View>

      {/* ━━━ MODAL DE BÚSQUEDA / SELECCIÓN DE SECTOR ━━━ */}
      <Modal
        visible={isSectorModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsSectorModalOpen(false)}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-paper rounded-t-3xl p-5 max-h-[80%] border-t border-hairline">
            <View className="flex-row items-center justify-between mb-3">
              <Text
                maxFontSizeMultiplier={1.3}
                className="text-[16px] font-bold text-ink"
              >
                Seleccionar sector en Bucaramanga
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar modal"
                onPress={() => setIsSectorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-canvas items-center justify-center active:bg-hairline"
              >
                <Icon icon={X} size="xs" color="mid-gray" />
              </Pressable>
            </View>

            {/* Input de filtro */}
            <View className="flex-row items-center bg-canvas rounded-xl px-3 h-10 border border-hairline mb-3">
              <Icon icon={Search} size="xs" color="mid-gray" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar sector o dirección..."
                placeholderTextColor="#737373"
                className="flex-1 text-[13px] text-ink ml-2 h-full"
              />
              {searchQuery.length > 0 ? (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Icon icon={X} size="xs" color="mid-gray" />
                </Pressable>
              ) : null}
            </View>

            <ScrollView className="max-h-72">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-mid-gray mb-1.5 px-1">
                Sectores
              </Text>
              {filteredSectors.map((sec) => (
                <Pressable
                  key={sec.id}
                  onPress={() => handleSelectSector(sec)}
                  className={`flex-row items-center justify-between p-3 rounded-xl mb-1 ${
                    sec.id === selectedSector.id
                      ? 'bg-primary-soft'
                      : 'active:bg-canvas'
                  }`}
                >
                  <View className="flex-1 mr-2">
                    <Text
                      numberOfLines={1}
                      className={`text-[13px] ${
                        sec.id === selectedSector.id
                          ? 'font-bold text-primary'
                          : 'font-semibold text-ink'
                      }`}
                    >
                      {sec.name}
                    </Text>
                    <Text numberOfLines={1} className="text-[11px] text-mid-gray mt-0.5">
                      {sec.address}
                    </Text>
                  </View>
                  <Text className="text-[11px] font-semibold text-mid-gray shrink-0">
                    {sec.estTime}
                  </Text>
                </Pressable>
              ))}

              <Text className="text-[11px] font-bold uppercase tracking-wider text-mid-gray mt-3 mb-1.5 px-1">
                Puntos destacados
              </Text>
              {POPULAR_ADDRESS_SUGGESTIONS.slice(0, 4).map((sug) => (
                <Pressable
                  key={sug.id}
                  onPress={() => {
                    setOriginAddress(sug.address);
                    const matchingSec = BUCARAMANGA_SECTORS.find(
                      (s) => s.id === sug.sectorId
                    );
                    if (matchingSec) setSelectedSector(matchingSec);
                    setIsSectorModalOpen(false);
                  }}
                  className="flex-row items-center gap-2 p-2.5 rounded-xl active:bg-canvas"
                >
                  <Icon icon={MapPin} size="xs" color="mid-gray" />
                  <View className="flex-1">
                    <Text numberOfLines={1} className="text-[12px] font-semibold text-ink">
                      {sug.title}
                    </Text>
                    <Text numberOfLines={1} className="text-[10px] text-mid-gray">
                      {sug.subtitle}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ━━━ MODAL DE SOLICITUD Y CONFIRMACIÓN DE CUPO ━━━ */}
      <BookRideModal
        visible={Boolean(bookingDriver)}
        driver={bookingDriver}
        sectorName={selectedSector.shortName}
        onClose={() => setBookingDriver(null)}
        onConfirm={handleConfirmBooking}
      />
    </Animated.View>
  );
};

