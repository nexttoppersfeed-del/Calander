window.CalanderBackup={
  export(){
    const payload={
      version:1,
      exportedAt:new Date().toISOString(),
      events:window.CalanderStorage?.load("calander-events",[])||[],
      tasks:window.CalanderStorage?.load("calander-tasks",[])||[],
      notes:window.CalanderStorage?.load("calander-notes",[])||[],
      settings:{
        theme:localStorage.getItem("calander-theme"),
        motion:localStorage.getItem("calander-motion"),
        background:localStorage.getItem("calander-background"),
        notifications:localStorage.getItem("calander-notifications")
      }
    };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="calander-backup.json";a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  },
  import(file,done){
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const p=JSON.parse(reader.result);
        if(p.events)window.CalanderStorage?.save("calander-events",p.events);
        if(p.tasks)window.CalanderStorage?.save("calander-tasks",p.tasks);
        if(p.notes)window.CalanderStorage?.save("calander-notes",p.notes);
        done?.(true);
      }catch{done?.(false)}
    };
    reader.readAsText(file);
  }
};
