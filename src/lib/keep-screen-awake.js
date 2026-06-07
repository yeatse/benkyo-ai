const activeTokens = new Set();
let nativeApplied = false;

function getAndroidBridge() {
  if (typeof window === 'undefined') return null;
  return window.BenkyoAndroid ?? null;
}

function applyKeepScreenOn() {
  const shouldKeepAwake = activeTokens.size > 0;
  const bridge = getAndroidBridge();
  if (!bridge?.setKeepScreenOn || nativeApplied === shouldKeepAwake) return;

  try {
    bridge.setKeepScreenOn(shouldKeepAwake);
    nativeApplied = shouldKeepAwake;
  } catch (error) {
    console.warn('[KeepScreenAwake] failed to update native screen flag:', error);
  }
}

export function acquireKeepScreenAwake(reason = 'generation') {
  const token = Symbol(reason);
  activeTokens.add(token);
  applyKeepScreenOn();
  return token;
}

export function releaseKeepScreenAwake(token) {
  if (!token || !activeTokens.delete(token)) return;
  applyKeepScreenOn();
}

export function releaseAllKeepScreenAwake() {
  if (activeTokens.size === 0) return;
  activeTokens.clear();
  applyKeepScreenOn();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', releaseAllKeepScreenAwake);
}
