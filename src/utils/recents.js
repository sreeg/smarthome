export const addToRecents = (deviceId) => {
  if (!deviceId) return;
  try {
    const list = JSON.parse(localStorage.getItem('recentDevices') || '[]');
    const newList = [deviceId, ...list.filter(id => id !== deviceId)].slice(0, 10);
    localStorage.setItem('recentDevices', JSON.stringify(newList));
  } catch (e) {
    console.error('Failed to save recents', e);
  }
};

export const getRecents = () => {
  try {
    return JSON.parse(localStorage.getItem('recentDevices') || '[]');
  } catch (e) {
    return [];
  }
};
