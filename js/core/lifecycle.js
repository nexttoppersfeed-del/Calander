window.CalanderLifecycle = {
  start(){document.dispatchEvent(new Event("calander:ready"))},
  onResume(fn){document.addEventListener("visibilitychange",()=>{if(!document.hidden)fn()})}
};
