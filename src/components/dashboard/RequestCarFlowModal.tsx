import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  X,
  MapPin,
  Clock,
  Car,
  Star,
  Check,
  Search,
  Users,
  MessageCircle,
} from 'lucide-react-native';
import { Icon, Button, StatusBadge, Card } from '@/components/ui';
import { RouteMapPicker, SectorLocation } from '@/components/map/RouteMapPicker';
import { useRideStore } from '@/features/rides';

export interface RequestCarFlowModalProps {
  visible: boolean;
  onClose: () => void;
  onRideBooked?: (driverName: string) => void;
}

type FlowStep = 'configure' | 'searching' | 'confirmed';

interface MatchedDriver {
  id: string;
  name: string;
  car: string;
  plate: string;
  phone: string;
  timeMin: number;
  timeLabel: string;
  rating: number;
  tripsCount: number;
  faculty: string;
}

const SECTOR_OPTIONS = [
  { id: 'cabecera', name: 'Cabecera', defaultSpot: 'Parque San Pío' },
  { id: 'canaveral', name: 'Cañaveral', defaultSpot: 'C.C. Cañaveral' },
  { id: 'provenza', name: 'Provenza', defaultSpot: 'Puente Provenza' },
  { id: 'real_minas', name: 'Real de Minas', defaultSpot: 'Plaza Mayor' },
  { id: 'san_francisco', name: 'San Francisco', defaultSpot: 'Cra. 22 con 18' },
  { id: 'giron', name: 'Girón', defaultSpot: 'Parque Principal' },
  { id: 'piedecuesta', name: 'Piedecuesta', defaultSpot: 'La Rioja / Autopista' },
];

const TIME_SLOTS = [
  { id: 'now', label: 'Ahora (~5 min)' },
  { id: '6:30', label: '6:30 AM' },
  { id: '7:00', label: '7:00 AM' },
  { id: '12:00', label: '12:00 M' },
];

const AVAILABLE_DRIVERS: Record<string, MatchedDriver[]> = {
  cabecera: [
    {
      id: 'drv-carlos',
      name: 'Ing. Carlos Mantilla',
      car: 'Chevrolet Onix',
      plate: 'WKL-823',
      phone: '3184567890',
      timeMin: 4,
      timeLabel: 'En ~4 min',
      rating: 4.9,
      tripsCount: 128,
      faculty: 'Ing. Sistemas',
    },
    {
      id: 'drv-patricia',
      name: 'Dra. Patricia Rueda',
      car: 'Renault Duster',
      plate: 'UDZ-104',
      phone: '3157891234',
      timeMin: 8,
      timeLabel: 'En ~8 min',
      rating: 5.0,
      tripsCount: 94,
      faculty: 'Medicina',
    },
    {
      id: 'drv-andres',
      name: 'Prof. Andrés Peña',
      car: 'Mazda 2',
      plate: 'BSM-992',
      phone: '3104567890',
      timeMin: 12,
      timeLabel: 'En ~12 min',
      rating: 4.8,
      tripsCount: 62,
      faculty: 'Fisioterapia',
    },
  ],
  canaveral: [
    {
      id: 'drv-andrea',
      name: 'Dra. Andrea Rueda',
      car: 'Chevrolet Tracker',
      plate: 'TRK-441',
      phone: '3123456789',
      timeMin: 5,
      timeLabel: 'En ~5 min',
      rating: 4.9,
      tripsCount: 110,
      faculty: 'Odontología',
    },
    {
      id: 'drv-felipe',
      name: 'Ing. Felipe Duarte',
      car: 'Nissan Versa',
      plate: 'NSS-312',
      phone: '3145678901',
      timeMin: 9,
      timeLabel: 'En ~9 min',
      rating: 4.8,
      tripsCount: 45,
      faculty: 'Ing. Civil',
    },
  ],
  provenza: [
    {
      id: 'drv-camilo',
      name: 'Prof. Camilo Ortiz',
      car: 'Kia Rio',
      plate: 'KIO-552',
      phone: '3167890123',
      timeMin: 6,
      timeLabel: 'En ~6 min',
      rating: 4.9,
      tripsCount: 88,
      faculty: 'Bacteriología',
    },
  ],
  real_minas: [
    {
      id: 'drv-lucia',
      name: 'Dra. Lucía Mendoza',
      car: 'Ford Fiesta',
      plate: 'FST-719',
      phone: '3178901234',
      timeMin: 7,
      timeLabel: 'En ~7 min',
      rating: 5.0,
      tripsCount: 72,
      faculty: 'Enfermería',
    },
  ],
  san_francisco: [
    {
      id: 'drv-daniel',
      name: 'Dr. Daniel Vargas',
      car: 'Volkswagen Gol',
      plate: 'VWG-341',
      phone: '3112345678',
      timeMin: 6,
      timeLabel: 'En ~6 min',
      rating: 4.9,
      tripsCount: 56,
      faculty: 'Derecho',
    },
  ],
  giron: [
    {
      id: 'drv-mauricio',
      name: 'Ing. Mauricio Flórez',
      car: 'Chevrolet Sail',
      plate: 'SLF-802',
      phone: '3139876543',
      timeMin: 15,
      timeLabel: 'En ~15 min',
      rating: 4.8,
      tripsCount: 104,
      faculty: 'Ing. Industrial',
    },
  ],
  piedecuesta: [
    {
      id: 'drv-silvia',
      name: 'Dra. Silvia Parra',
      car: 'Kia Picanto',
      plate: 'KAP-229',
      phone: '3156789012',
      timeMin: 18,
      timeLabel: 'En ~18 min',
      rating: 5.0,
      tripsCount: 81,
      faculty: 'Psicología',
    },
  ],
};

export const RequestCarFlowModal: React.FC<RequestCarFlowModalProps> = ({
  visible,
  onClose,
  onRideBooked,
}) => {
  const requestPassengerRide = useRideStore((s) => s.requestPassengerRide);

  const [step, setStep] = useState<FlowStep>('configure');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('cabecera');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('now');
  const [seatsRequested, setSeatsRequested] = useState<number>(1);
  const [selectedDriver, setSelectedDriver] = useState<MatchedDriver | null>(null);

  const currentSector =
    SECTOR_OPTIONS.find((s) => s.id === selectedSectorId) ?? SECTOR_OPTIONS[0];

  const matchedDrivers: MatchedDriver[] =
    AVAILABLE_DRIVERS[selectedSectorId] ?? AVAILABLE_DRIVERS.cabecera;

  const handleSelectSectorFromMap = (sector: SectorLocation) => {
    const match = SECTOR_OPTIONS.find(
      (s) =>
        s.id.toLowerCase() === sector.id.toLowerCase() ||
        s.name.toLowerCase() === sector.shortName.toLowerCase() ||
        s.name.toLowerCase() === sector.name.toLowerCase()
    );
    if (match) {
      setSelectedSectorId(match.id);
    }
  };

  const handleStartSearch = () => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }
    setStep('searching');
  };

  const handleSelectDriverAndConfirm = (driver: MatchedDriver) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }

    setSelectedDriver(driver);

    // Persistir reserva en Zustand
    const departureTime =
      selectedTimeSlot === 'now' ? 'Ahora (5 min)' : selectedTimeSlot;

    requestPassengerRide(departureTime, currentSector.name, {
      name: driver.name,
      car: driver.car,
      plate: driver.plate,
      phone: driver.phone,
      rating: driver.rating,
      pickupPoint: currentSector.defaultSpot,
      note: `${seatsRequested} cupo(s) solicitados`,
    });

    setStep('confirmed');
  };

  const handleFinish = () => {
    if (selectedDriver) {
      onRideBooked?.(selectedDriver.name);
    }
    setStep('configure');
    onClose();
  };

  const handleModalClose = () => {
    setStep('configure');
    setSelectedDriver(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleModalClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-paper rounded-t-3xl max-h-[88%] border-t border-hairline overflow-hidden">
          {/* Barra superior de arrastre */}
          <View className="items-center pt-2.5 pb-1">
            <View className="w-10 h-1 rounded-full bg-hairline" />
          </View>

          {/* Encabezado */}
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-hairline">
            <View className="flex-1 min-w-0 pr-2">
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className="text-[17px] font-bold text-ink"
              >
                {step === 'configure'
                  ? 'Pedir un carro a Campus Lagos'
                  : step === 'searching'
                  ? 'Conductores en tu ruta'
                  : 'Carro confirmado'}
              </Text>
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className="text-[12px] text-mid-gray mt-0.5"
              >
                {step === 'configure'
                  ? 'Elige tu punto de recogida y salida'
                  : step === 'searching'
                  ? `${matchedDrivers.length} carros pasando por ${currentSector.name}`
                  : 'Tu conductor viene en camino'}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar ventana de solicitud"
              onPress={handleModalClose}
              className="w-8 h-8 rounded-full bg-canvas items-center justify-center active:bg-hairline"
            >
              <Icon icon={X} size="xs" color="mid-gray" />
            </Pressable>
          </View>

          <ScrollView
            className="p-5"
            contentContainerClassName="gap-4 pb-8"
            showsVerticalScrollIndicator={false}
          >
            {/* ━━━ PASO 1: CONFIGURAR VIAJE ━━━ */}
            {step === 'configure' ? (
              <View className="gap-4">
                {/* 1. Visor de Mapa Interactivo Leaflet con Trazado a Campus Lagos */}
                <RouteMapPicker
                  selectedSectorName={currentSector.name}
                  onSelectSector={handleSelectSectorFromMap}
                  mapHeight={185}
                  mapOnly
                />

                {/* 2. Trazado de Ruta Origen ➔ Destino */}
                <Card className="p-3.5 bg-canvas border border-hairline rounded-2xl gap-3">
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-7 h-7 rounded-full bg-paper border border-hairline items-center justify-center shrink-0">
                      <Icon icon={MapPin} size="xs" color="mid-gray" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text
                        maxFontSizeMultiplier={1.3}
                        className="text-[10px] font-bold uppercase tracking-wider text-mid-gray"
                      >
                        Recogida en Bucaramanga
                      </Text>
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[13px] font-bold text-ink"
                      >
                        {currentSector.defaultSpot} ({currentSector.name})
                      </Text>
                    </View>
                  </View>

                  <View className="h-[1px] bg-hairline ml-9" />

                  <View className="flex-row items-center gap-2.5">
                    <View className="w-7 h-7 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                      <Icon icon={MapPin} size="xs" color="primary" />
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text
                        maxFontSizeMultiplier={1.3}
                        className="text-[10px] font-bold uppercase tracking-wider text-primary"
                      >
                        Destino Institucional
                      </Text>
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[13px] font-bold text-ink"
                      >
                        Campus Lagos del Cacique (UDES)
                      </Text>
                    </View>
                  </View>
                </Card>

                {/* 2. Selector de Sector */}
                <View>
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[11px] font-bold uppercase tracking-wider text-mid-gray mb-2"
                  >
                    Zona de salida
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {SECTOR_OPTIONS.map((sec) => (
                      <Pressable
                        key={sec.id}
                        onPress={() => setSelectedSectorId(sec.id)}
                        className={`px-3 py-2 rounded-xl border ${
                          selectedSectorId === sec.id
                            ? 'bg-primary-soft border-primary'
                            : 'bg-canvas border-hairline'
                        }`}
                      >
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className={`text-[12px] ${
                            selectedSectorId === sec.id
                              ? 'font-bold text-primary'
                              : 'font-medium text-ink'
                          }`}
                        >
                          {sec.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* 3. Momento de Salida */}
                <View>
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[11px] font-bold uppercase tracking-wider text-mid-gray mb-2"
                  >
                    ¿Cuándo sales?
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <Pressable
                        key={slot.id}
                        onPress={() => setSelectedTimeSlot(slot.id)}
                        className={`px-3 py-2 rounded-xl border ${
                          selectedTimeSlot === slot.id
                            ? 'bg-primary-soft border-primary'
                            : 'bg-canvas border-hairline'
                        }`}
                      >
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className={`text-[12px] ${
                            selectedTimeSlot === slot.id
                              ? 'font-bold text-primary'
                              : 'font-medium text-ink'
                          }`}
                        >
                          {slot.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* 4. Número de Cupos y Aporte Solidario */}
                <View className="flex-row items-center justify-between bg-canvas p-3 rounded-2xl border border-hairline">
                  <View className="flex-row items-center gap-2">
                    <Icon icon={Users} size="xs" color="mid-gray" />
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[12px] font-semibold text-ink"
                    >
                      Cupos requeridos
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5">
                    {[1, 2].map((num) => (
                      <Pressable
                        key={num}
                        onPress={() => setSeatsRequested(num)}
                        className={`w-8 h-8 rounded-lg items-center justify-center border ${
                          seatsRequested === num
                            ? 'bg-primary border-primary'
                            : 'bg-paper border-hairline'
                        }`}
                      >
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className={`text-[12px] font-bold ${
                            seatsRequested === num ? 'text-white' : 'text-ink'
                          }`}
                        >
                          {num}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* 5. Aporte Solidario de Combustible */}
                <View className="flex-row items-center justify-between bg-primary-soft border border-primary/20 p-3.5 rounded-2xl">
                  <View className="flex-1 mr-2">
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[12px] font-bold text-primary"
                    >
                      Aporte fijo de gasolina
                    </Text>
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[11px] text-mid-gray mt-0.5"
                    >
                      Tarifa comunitaria UDES sin tarifas dinámicas
                    </Text>
                  </View>
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[16px] font-bold text-primary"
                  >
                    ${(seatsRequested * 2500).toLocaleString('es-CO')} COP
                  </Text>
                </View>

                {/* Botón de Buscar Carros */}
                <Button
                  label="Buscar carros disponibles"
                  icon={<Icon icon={Search} size="xs" color="white" />}
                  size="md"
                  variant="primary"
                  fullWidth
                  onPress={handleStartSearch}
                />
              </View>
            ) : null}

            {/* ━━━ PASO 2: RESULTADOS DE RADAR / CONDUCTORES ━━━ */}
            {step === 'searching' ? (
              <View className="gap-3.5">
                {/* Banner de Radar Activo */}
                <View className="flex-row items-center justify-between bg-primary-soft/40 border border-primary/20 p-3 rounded-2xl">
                  <View className="flex-row items-center gap-2.5">
                    <ActivityIndicator size="small" color="#005B38" />
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[12px] font-bold text-primary"
                    >
                      Conductores en ruta hacia Campus Lagos
                    </Text>
                  </View>
                  <StatusBadge label="En vivo" variant="primary" />
                </View>

                {/* Lista de Conductores Compatibles */}
                <View className="gap-2.5">
                  {matchedDrivers.map((d, index) => (
                    <Card
                      key={d.id}
                      className="p-3.5 bg-canvas border border-hairline rounded-2xl shadow-xs"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2.5 flex-1 min-w-0 mr-2">
                          <View className="w-9 h-9 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                            <Text
                              maxFontSizeMultiplier={1.3}
                              className="text-[13px] font-bold text-primary"
                            >
                              {d.name.charAt(0)}
                            </Text>
                          </View>
                          <View className="flex-1 min-w-0">
                            <View className="flex-row items-center gap-1.5">
                              <Text
                                maxFontSizeMultiplier={1.3}
                                numberOfLines={1}
                                className="text-[13px] font-bold text-ink"
                              >
                                {d.name}
                              </Text>
                              <View className="flex-row items-center gap-0.5 bg-paper px-1.5 py-0.5 rounded-pill border border-hairline">
                                <Icon icon={Star} size="xs" color="primary" />
                                <Text
                                  maxFontSizeMultiplier={1.3}
                                  className="text-[10px] font-semibold text-primary"
                                >
                                  {d.rating}
                                </Text>
                              </View>
                            </View>
                            <Text
                              maxFontSizeMultiplier={1.3}
                              numberOfLines={1}
                              className="text-[11px] text-mid-gray mt-0.5"
                            >
                              {d.faculty} · {d.tripsCount} viajes
                            </Text>
                          </View>
                        </View>

                        <StatusBadge
                          label={index === 0 ? 'Más rápido' : d.timeLabel}
                          variant={index === 0 ? 'primary' : 'soft'}
                        />
                      </View>

                      {/* Detalles de Carro y Llegada */}
                      <View className="flex-row items-center justify-between bg-paper px-3 py-2 rounded-xl border border-hairline mb-3">
                        <View className="flex-row items-center gap-1.5">
                          <Icon icon={Car} size="xs" color="mid-gray" />
                          <Text
                            maxFontSizeMultiplier={1.3}
                            className="text-[11px] text-ink font-medium"
                          >
                            {d.car} ({d.plate})
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Icon icon={Clock} size="xs" color="primary" />
                          <Text
                            maxFontSizeMultiplier={1.3}
                            className="text-[11px] text-primary font-bold"
                          >
                            {d.timeLabel}
                          </Text>
                        </View>
                      </View>

                      <Button
                        label={`Pedir carro a ${d.name.split(' ')[0]}`}
                        size="sm"
                        variant={index === 0 ? 'primary' : 'outline'}
                        fullWidth
                        onPress={() => handleSelectDriverAndConfirm(d)}
                      />
                    </Card>
                  ))}
                </View>

                <Button
                  label="Modificar búsqueda"
                  variant="outline"
                  size="sm"
                  onPress={() => setStep('configure')}
                />
              </View>
            ) : null}

            {/* ━━━ PASO 3: CONFIRMACIÓN Y ASIGNACIÓN ━━━ */}
            {step === 'confirmed' && selectedDriver ? (
              <View className="gap-4 items-center pt-2">
                <View className="w-14 h-14 rounded-full bg-primary-soft border border-primary/20 items-center justify-center">
                  <Icon icon={Check} size="lg" color="primary" />
                </View>

                <View className="items-center">
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[18px] font-bold text-ink text-center"
                  >
                    ¡Tu carro viene en camino!
                  </Text>
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[12px] text-mid-gray text-center mt-1"
                  >
                    Tu conductor ha aceptado el abordaje hacia Campus Lagos
                  </Text>
                </View>

                {/* Mapa con la ruta confirmada hacia Campus Lagos */}
                <RouteMapPicker
                  selectedSectorName={currentSector.name}
                  mapHeight={140}
                  mapOnly
                />

                {/* Resumen del Conductor y Vehículo */}
                <Card className="w-full p-4 bg-canvas border border-hairline rounded-2xl gap-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-10 h-10 rounded-full bg-primary-soft items-center justify-center">
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className="text-[14px] font-bold text-primary"
                        >
                          {selectedDriver.name.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className="text-[14px] font-bold text-ink"
                        >
                          {selectedDriver.name}
                        </Text>
                        <Text
                          maxFontSizeMultiplier={1.3}
                          className="text-[11px] text-mid-gray"
                        >
                          {selectedDriver.car} · Placa {selectedDriver.plate}
                        </Text>
                      </View>
                    </View>

                    <StatusBadge label={selectedDriver.timeLabel} variant="primary" />
                  </View>

                  <View className="h-[1px] bg-hairline" />

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <Icon icon={MapPin} size="xs" color="primary" />
                      <Text
                        maxFontSizeMultiplier={1.3}
                        className="text-[12px] font-semibold text-ink"
                      >
                        Punto: {currentSector.defaultSpot}
                      </Text>
                    </View>
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[12px] font-bold text-primary"
                    >
                      $2.500 COP
                    </Text>
                  </View>
                </Card>

                <View className="w-full gap-2.5 pt-2">
                  <Button
                    label="Ver viaje y coordinar por WhatsApp"
                    icon={<Icon icon={MessageCircle} size="xs" color="white" />}
                    size="md"
                    variant="primary"
                    fullWidth
                    onPress={handleFinish}
                  />

                  <Button
                    label="Volver al inicio"
                    size="sm"
                    variant="outline"
                    fullWidth
                    onPress={handleFinish}
                  />
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
