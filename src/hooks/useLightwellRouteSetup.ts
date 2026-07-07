import { useLayoutEffect } from 'react';
import { useSetAtom } from 'jotai';
import { layoutForceGlassThemeAtom } from '../state/atoms/releaseAtom';
import { LIGHTWELL_PATH } from '../utils/common';

const FELT_THEME_CLASS = 'pf-v6-theme-felt';
const GLASS_THEME_CLASS = 'pf-v6-theme-glass';

type UseLightwellRouteSetupOptions = {
  enabled?: boolean;
};

/**
 * Applies Lightwell felt + glass themes synchronously before paint.
 * Also forces glass via layoutForceGlassThemeAtom for Header toolbar state.
 *
 * The initial CSS classes are applied eagerly at module-eval time in
 * releaseAtom.ts (main bundle) so they are present before any React render.
 * This hook handles the lifecycle: re-applying on mount and cleaning up on
 * unmount when navigating away from Lightwell routes.
 */
const useLightwellRouteSetup = ({ enabled = true }: UseLightwellRouteSetupOptions = {}) => {
  const setLayoutForceGlassTheme = useSetAtom(layoutForceGlassThemeAtom);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    document.documentElement.classList.add(FELT_THEME_CLASS, GLASS_THEME_CLASS);
    setLayoutForceGlassTheme(true);

    return () => {
      document.documentElement.classList.remove(FELT_THEME_CLASS, GLASS_THEME_CLASS);
      setLayoutForceGlassTheme(false);
    };
  }, [enabled, setLayoutForceGlassTheme]);
};

export default useLightwellRouteSetup;
