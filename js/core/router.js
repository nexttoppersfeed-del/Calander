window.CalanderRouter = {
  current:"today",
  go(view){this.current=view;document.dispatchEvent(new CustomEvent("calander:view",{detail:{view}}))}
};
