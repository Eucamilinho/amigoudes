import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StickyBottomBar } from '@/components/ui/StickyBottomBar';

const renderWithSafeArea = async (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
        frame: { x: 0, y: 0, width: 375, height: 812 },
      }}
    >
      {component}
    </SafeAreaProvider>
  );
};

describe('StickyBottomBar component', () => {
  it('debe renderizar el label correctamente', async () => {
    await renderWithSafeArea(<StickyBottomBar label="Ver viajes disponibles" />);
    expect(screen.getByText('Ver viajes disponibles')).toBeTruthy();
  });

  it('debe tener el rol de accesibilidad button', async () => {
    await renderWithSafeArea(<StickyBottomBar label="Publicar recorrido" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeTruthy();
  });

  it('debe ejecutar onPress al pulsar la barra', async () => {
    const handlePress = jest.fn();
    await renderWithSafeArea(<StickyBottomBar label="Continuar" onPress={handlePress} />);

    fireEvent.press(screen.getByRole('button'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});
