import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_ICON_SKIN = 'benkyochan';

export const ICON_SKINS = [
  { id: 'benkyochan', label: 'benkyochan', isDefault: true },
  { id: 'hiyohiyo', label: 'hiyohiyo' },
];

const ICON_SKIN_IDS = new Set(ICON_SKINS.map(skin => skin.id));

export function isIconSkin(value) {
  return ICON_SKIN_IDS.has(value);
}

const useAppearanceStore = create(
  persist(
    (set) => ({
      iconSkin: DEFAULT_ICON_SKIN,

      setIconSkin(iconSkin) {
        set({
          iconSkin: isIconSkin(iconSkin) ? iconSkin : DEFAULT_ICON_SKIN,
        });
      },
    }),
    {
      name: 'benkyo-ai-appearance',
      partialize: (s) => ({
        iconSkin: isIconSkin(s.iconSkin) ? s.iconSkin : DEFAULT_ICON_SKIN,
      }),
    }
  )
);

export default useAppearanceStore;
