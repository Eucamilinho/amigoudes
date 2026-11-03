import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  X,
  MapPin,
  Clock,
  Car,
  Star,
  Check,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react-native';
import { Icon, Button } from '@/components/ui';
import { RouteMapPicker } from '@/components/map/RouteMapPicker';

export interface DriverToBook {
  id: string;
  name: string;
  car: string;
  plate?: string;
  phone?: string;
  seats: number;
  time: string;
  rating: number;
  faculty?: string;
}

export interface BookRideModalProps {
  visible: boolean;
  onClose: () => void;
  driver: DriverToBook | null;
  sectorName: string;
  onConfirm: (data: {
    driver: DriverToBook;
    pickupPoint: string;
    note?: string;
  }) => void;
}

const PICKUP_SUGGESTIONS: Record<string, string[]> = {
  cabecera: ['Parque San Pío', 'Cra 33 con Calle 48', 'C.C. Cuarta Etapa', 'Parque San Antonio'],
  canaveral: ['C.C. Cañaveral', 'Estación Lagos Metrolinea', 'La Florida', 'C.C. La Florida'],
  provenza: ['Puente Provenza', 'Calle 105 con 23', 'Parque de Provenza', 'Vía Terminal'],
  real_minas: ['Plaza Mayor', 'Parque Las Cigarras', 'Av. Los Samanes', 'C.C. Acrópolis'],
};

export const BookRideModal: React.FC<BookRideModalProps> = ({
  visible,
  onClose,
  driver,
  sectorName,
  onConfirm,
}) => {
  const sectorKey = sectorName.toLowerCase().includes('cañ')
    ? 'canaveral'
    : sectorName.toLowerCase().includes('prov')
    ? 'provenza'
    : sectorName.toLowerCase().includes('real')
    ? 'real_minas'
    : 'cabecera';

  const defaultSuggestions = PICKUP_SUGGESTIONS[sectorKey] ?? PICKUP_SUGGESTIONS.cabecera;

  const [selectedPickup, setSelectedPickup] = useState<string>(defaultSuggestions[0]);
  const [customNote, setCustomNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!driver) return null;

  const handleSelectPickup = (spot: string) => {
    try {
      Haptics.selectionAsync().catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }
    setSelectedPickup(spot);
  };

  const handleConfirm = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      // Ignorar en plataformas sin soporte
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm({
        driver,
        pickupPoint: selectedPickup,
        note: customNote.trim() || undefined,
      });
      onClose();
    }, 250);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-paper rounded-t-3xl border-t border-hairline p-5 max-h-[85%] shadow-xl">
          {/* Barra superior de cierre */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-1.5">
              <Icon icon={ShieldCheck} size="xs" color="primary" />
              <Text
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                className="text-[13px] font-bold text-ink uppercase tracking-wider"
              >
                Solicitar Cupo Seguro
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar modal"
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-canvas border border-hairline items-center justify-center active:bg-hairline"
            >
              <Icon icon={X} size="xs" color="mid-gray" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            className="space-y-4"
          >
            {/* Credencial del Conductor UDES */}
            <View className="p-3.5 bg-canvas rounded-2xl border border-hairline">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
                  <View className="w-10 h-10 rounded-full bg-primary-soft border border-primary/20 items-center justify-center shrink-0">
                    <Text
                      maxFontSizeMultiplier={1.3}
                      className="text-[14px] font-bold text-primary"
                    >
                      {driver.name.charAt(0)}
                    </Text>
                  </View>

                  <View className="flex-1 min-w-0">
                    <Text
                      maxFontSizeMultiplier={1.3}
                      numberOfLines={1}
                      className="text-[14px] font-bold text-ink leading-tight"
                    >
                      {driver.name}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <Icon icon={Car} size="xs" color="mid-gray" />
                      <Text
                        maxFontSizeMultiplier={1.3}
                        numberOfLines={1}
                        className="text-[11px] text-mid-gray"
                      >
                        {driver.car} {driver.plate ? `(${driver.plate})` : ''}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Calificación */}
                <View className="flex-row items-center gap-1 bg-paper px-2 py-1 rounded-pill border border-hairline shrink-0">
                  <Icon icon={Star} size="xs" color="primary" />
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="text-[11px] font-bold text-ink"
                  >
                    {driver.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Mapa de trazado interactivo a Campus Lagos */}
            <RouteMapPicker
              selectedSectorName={sectorName}
              mapHeight={140}
              mapOnly
            />

            {/* Trazado y Horario */}
            <View className="p-3 bg-canvas rounded-xl border border-hairline flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5 flex-1 min-w-0">
                <Icon icon={MapPin} size="xs" color="primary" />
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] font-bold text-ink"
                >
                  {sectorName}
                </Text>
                <Icon icon={ArrowRight} size="xs" color="mid-gray" />
                <Text
                  maxFontSizeMultiplier={1.3}
                  numberOfLines={1}
                  className="text-[12px] font-bold text-primary"
                >
                  Campus Lagos
                </Text>
              </View>

              <View className="flex-row items-center gap-1 shrink-0 ml-2">
                <Icon icon={Clock} size="xs" color="mid-gray" />
                <Text
                  maxFontSizeMultiplier={1.3}
                  className="text-[11px] font-semibold text-ink"
                >
                  {driver.time}
                </Text>
              </View>
            </View>

            {/* Selección de Punto de Encuentro */}
            <View className="pt-1">
              <Text
                maxFontSizeMultiplier={1.3}
                className="text-[11px] font-semibold uppercase tracking-[0.5px] text-mid-gray mb-2"
              >
                Punto de encuentro sugerido
              </Text>

              <View className="flex-row flex-wrap gap-1.5 mb-2.5">
                {defaultSuggestions.map((spot) => {
                  const isSelected = selectedPickup === spot;
                  return (
                    <Pressable
                      key={spot}
                      accessibilityRole="button"
                      accessibilityLabel={`Punto de encuentro: ${spot}`}
                      onPress={() => handleSelectPickup(spot)}
                      className={`py-1.5 px-3 rounded-pill border flex-row items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'bg-canvas border-hairline active:bg-hairline'
                      }`}
                    >
                      {isSelected ? (
                        <Icon icon={Check} size="xs" color="white" />
                      ) : null}
                      <Text
                        maxFontSizeMultiplier={1.3}
                        className={`text-[11px] ${
                          isSelected
                            ? 'text-white font-bold'
                            : 'text-ink font-medium'
                        }`}
                      >
                        {spot}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="bg-canvas border border-hairline rounded-xl px-3 py-2 flex-row items-center">
                <Icon icon={MapPin} size="xs" color="mid-gray" />
                <TextInput
                  value={selectedPickup}
                  onChangeText={setSelectedPickup}
                  placeholder="O escribe otro punto de recogida..."
                  placeholderTextColor="#737373"
                  className="flex-1 text-[12px] text-ink ml-2 font-normal"
                />
              </View>
            </View>

            {/* Aporte de Gasolina sugerido */}
            <View className="p-3 bg-primary-soft/30 rounded-xl border border-primary/20 flex-row items-center justify-between">
              <View>
                <Text
                  maxFontSizeMultiplier={1.3}
                  className="text-[11px] font-bold text-primary uppercase tracking-wider"
                >
                  Aporte institucional
                </Text>
                <Text
                  maxFontSizeMultiplier={1.3}
                  className="text-[10px] text-mid-gray mt-0.5"
                >
                  Solidario para gasolina · Pago directo
                </Text>
              </View>

              <Text
                maxFontSizeMultiplier={1.3}
                className="text-[16px] font-bold text-primary"
              >
                $2.500 COP
              </Text>
            </View>

            {/* Nota opcional para el conductor */}
            <View className="pt-1">
              <Text
                maxFontSizeMultiplier={1.3}
                className="text-[11px] font-semibold uppercase tracking-[0.5px] text-mid-gray mb-1.5"
              >
                Nota para el conductor (opcional)
              </Text>
              <TextInput
                value={customNote}
                onChangeText={setCustomNote}
                placeholder="Ej: Llevo bata médica / estaré en el semáforo..."
                placeholderTextColor="#737373"
                className="bg-canvas border border-hairline rounded-xl px-3 py-2 text-[12px] text-ink font-normal min-h-[40px]"
              />
            </View>

            {/* Botón de Confirmación Principal */}
            <View className="pt-2 pb-4">
              <Button
                label={isSubmitting ? 'Registrando...' : 'Confirmar solicitud de cupo'}
                onPress={handleConfirm}
                fullWidth
                loading={isSubmitting}
                variant="primary"
                size="md"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
