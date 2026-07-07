jest.mock('axios', () => ({ create: jest.fn(), post: jest.fn() }));
jest.mock('axios-cache-interceptor', () => ({ setupCache: jest.fn((a: unknown) => a) }));
jest.mock('../../utils/VisibilitySingleton', () => ({
  updateVisibilityFunctionsBeta: jest.fn(),
  visibilityFunctionsExist: jest.fn(() => false),
}));
jest.mock('../../components/FeatureFlags/unleashClient', () => ({
  getUnleashClient: jest.fn(),
  unleashClientExists: jest.fn(() => false),
}));
jest.mock('../../hooks/useBundle', () => ({
  getUrl: jest.fn(),
  __esModule: true,
  default: jest.fn(() => ({ bundleTitle: '' })),
}));

import { createStore } from 'jotai';
import { describe, it, expect, afterEach } from '@jest/globals';

describe('releaseAtom pathname-based initialization', () => {
  afterEach(() => {
    document.documentElement.classList.remove('pf-v6-theme-felt', 'pf-v6-theme-glass');
    jsdomReset();
    jest.resetModules();
  });

  const importAtoms = async () => import('./releaseAtom');

  it.each(['/lightwell', '/lightwell/repos'])(
    'initializes layoutBannerHiddenAtom and layoutForceGlassThemeAtom to true for %s',
    async (path) => {
      jsdomReconfigure({ url: `https://test.com${path}` });
      jest.resetModules();
      const { layoutBannerHiddenAtom, layoutForceGlassThemeAtom } = await importAtoms();
      const store = createStore();
      expect(store.get(layoutBannerHiddenAtom)).toBe(true);
      expect(store.get(layoutForceGlassThemeAtom)).toBe(true);
    }
  );

  it.each(['/', '/insights/dashboard'])(
    'initializes layoutBannerHiddenAtom and layoutForceGlassThemeAtom to false for %s',
    async (path) => {
      jsdomReconfigure({ url: `https://test.com${path}` });
      jest.resetModules();
      const { layoutBannerHiddenAtom, layoutForceGlassThemeAtom } = await importAtoms();
      const store = createStore();
      expect(store.get(layoutBannerHiddenAtom)).toBe(false);
      expect(store.get(layoutForceGlassThemeAtom)).toBe(false);
    }
  );

  it.each(['/lightwell', '/lightwell/repos'])(
    'adds felt and glass theme classes to documentElement for %s',
    async (path) => {
      jsdomReconfigure({ url: `https://test.com${path}` });
      jest.resetModules();
      await importAtoms();
      expect(document.documentElement.classList.contains('pf-v6-theme-felt')).toBe(true);
      expect(document.documentElement.classList.contains('pf-v6-theme-glass')).toBe(true);
    }
  );

  it.each(['/', '/insights/dashboard'])(
    'does not add theme classes to documentElement for %s',
    async (path) => {
      jsdomReconfigure({ url: `https://test.com${path}` });
      jest.resetModules();
      await importAtoms();
      expect(document.documentElement.classList.contains('pf-v6-theme-felt')).toBe(false);
      expect(document.documentElement.classList.contains('pf-v6-theme-glass')).toBe(false);
    }
  );
});
