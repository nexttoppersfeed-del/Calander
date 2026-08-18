window.CalanderReminders={
  presets:[5,10,15,30,60,1440],
  label(minutes){
    if(minutes<60)return `${minutes} min before`;
    if(minutes===60)return "1 hour before";
    if(minutes===1440)return "1 day before";
    return `${minutes} min before`;
  },
  schedule(event){
    if(!event.reminder || !event.date)return;
    const [h,m]=(event.time||"09:00").split(":").map(Number);
    const at=new Date(`${event.date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`).getTime()-Number(event.reminder)*60000;
    if(at>Date.now()) setTimeout(()=>window.CalanderNotifications?.notify(event.title,event.meta||"Calendar reminder"),at-Date.now());
  }
};
