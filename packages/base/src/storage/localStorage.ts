import { useAppStore } from '@base/store';

export function useLocal() {
  const authStore = useAppStore();

  const appId = authStore.appInfo?.appId;

  const prefix = appId ? `app_${appId}_` : 'app_';

  function setLocal(key: string, value: any) {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  }

  function getLocal(key: string) {
    const value = localStorage.getItem(prefix + key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  function removeLocal(key: string) {
    localStorage.removeItem(prefix + key);
  }

  function clearLocal() {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  return {
    setLocal,
    getLocal,
    removeLocal,
    clearLocal,
  };
}
