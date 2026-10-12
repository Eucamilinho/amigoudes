import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button component', () => {
  it('debe renderizar el texto del botón correctamente', async () => {
    await render(<Button label="Iniciar viaje" />);
    expect(screen.getByText('Iniciar viaje')).toBeTruthy();
  });

  it('debe ejecutar onPress al pulsar', async () => {
    const handlePress = jest.fn();
    await render(<Button label="Confirmar" onPress={handlePress} />);

    fireEvent.press(screen.getByText('Confirmar'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('no debe ejecutar onPress cuando disabled={true}', async () => {
    const handlePress = jest.fn();
    await render(<Button label="Guardar" onPress={handlePress} disabled />);

    fireEvent.press(screen.getByText('Guardar'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  it('debe tener el rol de accesibilidad button', async () => {
    await render(<Button label="Accesible" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeTruthy();
  });
});
