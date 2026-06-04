import { useCallback } from 'react';
import useAppearanceStore, {
  DEFAULT_ICON_SKIN,
  isIconSkin,
} from '../store/appearanceStore';

const iconModules = {
  ...import.meta.glob('../assets/icons/*/logo.png', { eager: true, import: 'default' }),
  ...import.meta.glob('../assets/icons/*/logo_32.png', { eager: true, import: 'default' }),
  ...import.meta.glob('../assets/icons/*/nav/*.png', { eager: true, import: 'default' }),
  ...import.meta.glob('../assets/icons/*/item/*.png', { eager: true, import: 'default' }),
  ...import.meta.glob('../assets/icons/*/ui/*.png', { eager: true, import: 'default' }),
  ...import.meta.glob('../assets/icons/*/sd/*.png', { eager: true, import: 'default' }),
};

function normalizeIconPath(iconPath) {
  return String(iconPath ?? '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
}

function moduleKey(iconSkin, iconPath) {
  return `../assets/icons/${iconSkin}/${normalizeIconPath(iconPath)}`;
}

export function resolveIconSrc(iconPath, iconSkin = DEFAULT_ICON_SKIN) {
  const requestedSkin = isIconSkin(iconSkin) ? iconSkin : DEFAULT_ICON_SKIN;
  const requestedIcon = iconModules[moduleKey(requestedSkin, iconPath)];
  if (requestedIcon) return requestedIcon;

  return iconModules[moduleKey(DEFAULT_ICON_SKIN, iconPath)] ?? '';
}

export function useIcon(iconPath) {
  const iconSkin = useAppearanceStore(s => s.iconSkin);
  return resolveIconSrc(iconPath, iconSkin);
}

export function useIconResolver() {
  const iconSkin = useAppearanceStore(s => s.iconSkin);
  return useCallback((iconPath) => resolveIconSrc(iconPath, iconSkin), [iconSkin]);
}
