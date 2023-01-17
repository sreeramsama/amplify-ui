function isNewerIpad() {
  // iPads on iOS13+ return as if a desktop Mac
  // so check for maxTouchPoints also.
  return (
    /Macintosh/i.test(navigator.userAgent) &&
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 1
  );
}

export function isMobileScreen(): boolean {
  const isMobileDevice =
    // Test Android/iPhone/iPad
    /Android|iPhone|iPad/i.test(navigator.userAgent) || isNewerIpad();
  return isMobileDevice;
}

export function isIOS(): boolean {
  const isIOS = isNewerIpad() || navigator.userAgent.indexOf('like Mac') != -1;
  return isIOS;
}
export function isAndroid(): boolean {
  return navigator.userAgent.indexOf('Android') != -1;
}
export function isFirefox(): boolean {
  return navigator.userAgent.indexOf('Firefox') != -1;
}

export function isPortrait(): boolean {
  return screen.orientation?.type?.includes('portrait') || true;
}