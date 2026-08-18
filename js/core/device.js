window.CalanderDevice = {
  isMobile:matchMedia("(max-width:720px)").matches,
  standalone:matchMedia("(display-mode:standalone)").matches || navigator.standalone===true
};
