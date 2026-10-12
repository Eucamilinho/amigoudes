import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AppLogo } from '@/components/ui/AppLogo';

describe('AppLogo component', () => {
  it('debe renderizar el logotipo con la etiqueta accesible de imagen', async () => {
    await render(<AppLogo size="md" />);
    expect(screen.getByLabelText('Logotipo Carpooling UDES')).toBeTruthy();
  });

  it('debe renderizar el texto institucional "UDES Ride" cuando showText={true}', async () => {
    await render(<AppLogo size="lg" showText={true} />);
    expect(screen.getByText('UDES Ride')).toBeTruthy();
    expect(screen.getByText('Carpooling Universitario')).toBeTruthy();
  });

  it('no debe mostrar el texto cuando showText={false}', async () => {
    await render(<AppLogo size="xl" showText={false} />);
    expect(screen.queryByText('UDES Ride')).toBeNull();
  });

  it('debe renderizar la variante vectorial institucional correctamente', async () => {
    await render(<AppLogo variant="vector" showText={false} />);
    expect(screen.getByText('U')).toBeTruthy();
  });
});
