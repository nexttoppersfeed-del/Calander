window.CalanderNotifications = {
  async request() {
    if (!("Notification" in window)) return "unsupported";
    if (Notification.permission === "default") return await Notification.requestPermission();
    return Notification.permission;
  },
  notify(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      try { new Notification(title, { body }); } catch {}
    }
  }
};
