import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { FormInput } from '@/components/ui/FormInput';

describe('FormInput component', () => {
  it('debe renderizar la etiqueta y el placeholder correctamente', async () => {
    await render(
      <FormInput
        label="Correo institucional"
        value=""
        onChangeText={() => {}}
        placeholder="nombre@correo.com"
      />
    );

    expect(screen.getByText('Correo institucional')).toBeTruthy();
    expect(screen.getByPlaceholderText('nombre@correo.com')).toBeTruthy();
  });

  it('debe llamar a onChangeText al escribir en el campo', async () => {
    const handleChangeText = jest.fn();
    await render(
      <FormInput
        label="Nombre"
        value=""
        onChangeText={handleChangeText}
        placeholder="Tu nombre"
      />
    );

    const input = screen.getByPlaceholderText('Tu nombre');
    fireEvent.changeText(input, 'Camilo');
    expect(handleChangeText).toHaveBeenCalledWith('Camilo');
  });

  it('debe mostrar mensaje de error cuando se le pasa error prop', async () => {
    await render(
      <FormInput
        label="Contraseña"
        value=""
        onChangeText={() => {}}
        error="La contraseña debe tener al menos 6 caracteres"
      />
    );

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeTruthy();
  });

  it('permite alternar visibilidad con el botón Mostrar/Ocultar cuando secureTextEntry={true}', async () => {
    await render(
      <FormInput
        label="Contraseña"
        value="miClaveSegura"
        onChangeText={() => {}}
        secureTextEntry
      />
    );

    const toggleButton = screen.getByRole('button');
    expect(screen.getByText('Mostrar')).toBeTruthy();

    fireEvent.press(toggleButton);
    expect(await screen.findByText('Ocultar')).toBeTruthy();
  });
});
