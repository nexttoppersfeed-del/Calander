window.CalanderPermissions = {
  async notifications(){if(!("Notification"in window))return "unsupported";return Notification.permission==="default"?await Notification.requestPermission():Notification.permission},
  async location(){if(!navigator.geolocation)return null;return new Promise(r=>navigator.geolocation.getCurrentPosition(p=>r(p.coords),()=>r(null)))}
};
