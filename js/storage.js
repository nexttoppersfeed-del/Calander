window.CalanderStorage = {
  load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
    catch { return fallback; }
  },
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};
