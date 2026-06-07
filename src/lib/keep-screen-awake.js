const activeTokens = new Set();
let nativeApplied = false;

function getAndroidBridge() {
  if (typeof window === 'undefined') return null;
  return window.BenkyoAndroid ?? null;
}

function callNativeGenerationMethod(bridge, methodName, enabled) {
  const method = bridge?.[methodName];
  if (!method) return false;

  try {
    method.call(bridge, enabled);
    return true;
  } catch (error) {
    console.warn(`[KeepScreenAwake] native ${methodName} failed:`, error);
    return false;
  }
}

function applyGenerationNativeState() {
  const shouldKeepAwake = activeTokens.size > 0;
  const bridge = getAndroidBridge();
  if (!bridge || nativeApplied === shouldKeepAwake) return;

  const didApplyKeepScreen = callNativeGenerationMethod(
    bridge,
    'setKeepScreenOn',
    shouldKeepAwake
  );
  const didApplyForegroundService = callNativeGenerationMethod(
    bridge,
    'setCourseGenerationServiceActive',
    shouldKeepAwake
  );

  if (didApplyKeepScreen || didApplyForegroundService) {
    nativeApplied = shouldKeepAwake;
  }
}

export function acquireKeepScreenAwake(reason = 'generation') {
  const token = Symbol(reason);
  activeTokens.add(token);
  applyGenerationNativeState();
  return token;
}

export function releaseKeepScreenAwake(token) {
  if (!token || !activeTokens.delete(token)) return;
  applyGenerationNativeState();
}

export function releaseAllKeepScreenAwake() {
  if (activeTokens.size === 0) return;
  activeTokens.clear();
  applyGenerationNativeState();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', releaseAllKeepScreenAwake);
}
