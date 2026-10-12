import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemedText } from '@/components/ui/ThemedText';

describe('ThemedText component', () => {
  it('debe renderizar el texto correctamente', async () => {
    await render(<ThemedText>Texto de prueba</ThemedText>);
    expect(screen.getByText('Texto de prueba')).toBeTruthy();
  });

  it('debe resolver el alias h1 a display con accessibilityRole header', async () => {
    await render(<ThemedText variant="h1">Título Display</ThemedText>);
    const headerElement = screen.getByRole('header');
    expect(headerElement).toBeTruthy();
    expect(screen.getByText('Título Display')).toBeTruthy();
  });

  it('debe resolver el alias h2 a heading', async () => {
    await render(<ThemedText variant="h2">Título Secundario</ThemedText>);
    const headerElement = screen.getByRole('header');
    expect(headerElement).toBeTruthy();
  });

  it('debe soportar la variante display nativa', async () => {
    await render(<ThemedText variant="display">¿A dónde vas hoy?</ThemedText>);
    expect(screen.getByText('¿A dónde vas hoy?')).toBeTruthy();
  });
});
