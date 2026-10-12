import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Card } from '@/components/ui/Card';

describe('Card component', () => {
  it('debe renderizar sus hijos correctamente', async () => {
    await render(
      <Card>
        <Text>Contenido de prueba</Text>
      </Card>
    );

    expect(screen.getByText('Contenido de prueba')).toBeTruthy();
  });

  it('debe soportar la prop selected', async () => {
    await render(
      <Card selected>
        <Text>Tarjeta seleccionada</Text>
      </Card>
    );

    expect(screen.getByText('Tarjeta seleccionada')).toBeTruthy();
  });
});
