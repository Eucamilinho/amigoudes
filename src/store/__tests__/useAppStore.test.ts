import { useAppStore } from '@/store/useAppStore';

describe('useAppStore (Zustand)', () => {
  beforeEach(() => {
    useAppStore.setState({ mode: 'passenger' });
  });

  it('debe iniciar en modo passenger por defecto', () => {
    const { mode } = useAppStore.getState();
    expect(mode).toBe('passenger');
  });

  it('debe permitir cambiar de modo a driver con setMode', () => {
    useAppStore.getState().setMode('driver');
    expect(useAppStore.getState().mode).toBe('driver');
  });

  it('debe alternar de modo con toggleMode', () => {
    expect(useAppStore.getState().mode).toBe('passenger');

    useAppStore.getState().toggleMode();
    expect(useAppStore.getState().mode).toBe('driver');

    useAppStore.getState().toggleMode();
    expect(useAppStore.getState().mode).toBe('passenger');
  });
});
