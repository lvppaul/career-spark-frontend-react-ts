type Listener = (activeCount: number) => void;

let activeCount = 0;
const listeners: Listener[] = [];

export function subscribeLoading(fn: Listener) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(activeCount);
    } catch (_err) {
      console.error('Error in loading listener', _err);
    }
  });
}

export function showLoading() {
  activeCount += 1;
  notify();
}

export function hideLoading() {
  activeCount = Math.max(0, activeCount - 1);
  notify();
}

export function resetLoading() {
  activeCount = 0;
  notify();
}

export function getActiveCount() {
  return activeCount;
}
