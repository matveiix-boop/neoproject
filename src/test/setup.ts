import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  configurable: true,
  value: (callback: FrameRequestCallback) => window.setTimeout(callback, 0),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  configurable: true,
  value: (id: number) => window.clearTimeout(id),
});
