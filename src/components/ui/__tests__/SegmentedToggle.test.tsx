import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';

describe('SegmentedToggle component', () => {
  const options = [
    { value: 'passenger' as const, label: 'Pasajero' },
    { value: 'driver' as const, label: 'Conductor' },
  ] as const;

  it('debe renderizar todas las opciones', async () => {
    await render(
      <SegmentedToggle
        options={options}
        value="passenger"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Pasajero')).toBeTruthy();
    expect(screen.getByText('Conductor')).toBeTruthy();
  });

  it('debe llamar onChange con la opción seleccionada', async () => {
    const handleChange = jest.fn();
    await render(
      <SegmentedToggle
        options={options}
        value="passenger"
        onChange={handleChange}
      />
    );

    fireEvent.press(screen.getByText('Conductor'));
    expect(handleChange).toHaveBeenCalledWith('driver');
  });
});
