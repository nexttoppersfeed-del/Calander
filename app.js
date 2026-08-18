const state={
  date:new Date(),
  events:[],
  notes:[],
  color:"#9d6cff",
  category:"Personal",
  motion:true,
  background:true,
  notifications:true,
  monthOffset:0,
  view:"today"
};

const $=id=>document.getElementById(id);
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const FESTIVALS={
 "01-01":"New Year's Day","01-26":"Republic Day","03-14":"Holi","04-14":"Ambedkar Jayanti",
 "08-15":"Independence Day","08-27":"Ganesh Chaturthi","09-02":"Onam","10-02":"Gandhi Jayanti",
 "10-20":"Dussehra","11-08":"Diwali","11-24":"Guru Nanak Jayanti","12-25":"Christmas"
};
const COLORS={Personal:"#9d6cff",Work:"#4385ff",Family:"#35d8a0",Study:"#ff9822",Birthday:"#ff56a7"};

function key(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function clean(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function same(a,b){return key(a)===key(b)}
function add(d,n){let x=new Date(d);x.setDate(x.getDate()+n);return x}
function festival(d){return FESTIVALS[`${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`]||null}
function escapeHtml(s){const d=document.createElement("div");d.textContent=s??"";return d.innerHTML}
function toast(t){const x=$("toast");x.textContent=t;x.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>x.classList.remove("show"),2300)}

function load(){
 state.events=window.CalanderStorage?.load("calander-events",[])||[];
 state.notes=window.CalanderStorage?.load("calander-notes",[])||[];
 state.color=localStorage.getItem("calander-color")||"#9d6cff";
 state.category=localStorage.getItem("calander-category")||"Personal";
 state.motion=localStorage.getItem("calander-motion")!=="false";
 state.background=localStorage.getItem("calander-background")!=="false";
 state.notifications=localStorage.getItem("calander-notifications")!=="false";
}
function save(){window.CalanderStorage?.save("calander-events",state.events);window.CalanderStorage?.save("calander-notes",state.notes)}
function renderHero(){
 const d=state.date;
 $("weekday").textContent=d.toLocaleDateString("en-IN",{weekday:"long"}).toUpperCase();
 $("heroDate").textContent=d.getDate();
 $("heroMonth").textContent=`${MONTHS[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
 const f=festival(d); $("festivalPill").classList.toggle("hidden",!f); if(f)$("festivalText").textContent=f;
}
function eventsFor(d){return state.events.filter(e=>e.date===key(d)).sort((a,b)=>(a.time||"").localeCompare(b.time||""))}
function timeLabel(t){if(!t)return"All day";let [h,m]=t.split(":").map(Number);return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`}
function demoEvents(){
 if(key(state.date)!=="2026-08-18")return [];
 return [
  {time:"10:30",end:"11:30",title:"Design Review",meta:"Meeting Room A",color:"#9d6cff",category:"Work"},
  {time:"13:00",end:"14:00",title:"Team Standup",meta:"Online",color:"#35d8a0",category:"Work"},
  {time:"15:30",end:"16:30",title:"Client Presentation",meta:"Zoom",color:"#ff9822",category:"Work"},
  {time:"17:00",end:"18:00",title:"Gym Session",meta:"Be Fit Gym",color:"#4385ff",category:"Personal"}
 ];
}
function renderEvents(){
 const list=$("eventsList");list.innerHTML="";
 let items=eventsFor(state.date);
 if(!items.length)items=demoEvents();
 if(!items.length){list.innerHTML=`<div class="empty-event glass" style="padding:30px;text-align:center;color:#7f8aa0;border-radius:18px">Nothing planned for this day</div>`;return}
 items.forEach(e=>{
  const card=document.createElement("article");card.className="event-card";card.style.setProperty("--event-color",e.color||COLORS[e.category]||"#9d6cff");
  card.innerHTML=`<div class="event-time"><b>${timeLabel(e.time)}</b>${e.end?`<small>${timeLabel(e.end)}</small>`:""}</div>
  <div class="event-info"><div class="event-title">${escapeHtml(e.title)}</div><div class="event-meta"><span class="event-dot"></span>${escapeHtml(e.meta||e.category||"")}</div></div>
  <div class="event-action">⊞</div>`;
  card.onclick=()=>openEventDetails(e);
  list.appendChild(card);
 });
}
function renderMonth(){
 const base=new Date(state.date.getFullYear(),state.date.getMonth()+state.monthOffset,1);
 $("monthTitle").textContent=`${MONTHS[base.getMonth()].toUpperCase()} ${base.getFullYear()}`;
 const grid=$("monthGrid");grid.innerHTML="";
 const first=base.getDay(),days=new Date(base.getFullYear(),base.getMonth()+1,0).getDate();
 for(let i=0;i<first;i++){const b=document.createElement("button");b.className="month-day outside";b.textContent=new Date(base.getFullYear(),base.getMonth(),-first+i+1).getDate();grid.appendChild(b)}
 for(let n=1;n<=days;n++){
  const d=new Date(base.getFullYear(),base.getMonth(),n),b=document.createElement("button");b.className="month-day";b.textContent=n;
  if(same(d,state.date))b.classList.add("selected");
  if(eventsFor(d).length||festival(d))b.classList.add("has-dot");
  b.onclick=()=>{state.date=clean(d);state.monthOffset=0;renderAll()};
  grid.appendChild(b);
 }
 while(grid.children.length<35){const b=document.createElement("button");b.className="month-day outside";b.textContent=grid.children.length-first+1;grid.appendChild(b)}
}
function renderAll(){renderHero();renderEvents();renderMonth();renderAgenda();renderNotes()}
function renderAgenda(){
 const box=$("agendaExtra");if(!box)return;
 const items=[...state.events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,12);
 box.innerHTML=items.length?items.map(e=>`<button class="agenda-item glass" data-id="${e.id}"><b>${escapeHtml(e.title)}</b><span>${e.date} · ${timeLabel(e.time)}</span></button>`).join(""):`<div class="empty-extra">No saved events yet.</div>`;
 box.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>{const e=state.events.find(x=>String(x.id)===b.dataset.id);if(e){state.date=new Date(e.date+"T00:00:00");renderAll();toast("Opened event day")}})
}
function renderNotes(){
 const box=$("notesList");if(!box)return;
 box.innerHTML=state.notes.map(n=>`<div class="note-card glass"><b>${escapeHtml(n.title)}</b><p>${escapeHtml(n.body)}</p><small>${n.date}</small></div>`).join("");
}
function openSheet(id){$(id).classList.add("show");$(id).setAttribute("aria-hidden","false");$("scrim").classList.add("show")}
function closeSheets(){document.querySelectorAll(".sheet").forEach(x=>{x.classList.remove("show");x.setAttribute("aria-hidden","true")});$("scrim").classList.remove("show")}
function openSearch(){$("searchOverlay").classList.add("show");$("searchOverlay").setAttribute("aria-hidden","false");setTimeout(()=>$("searchInput").focus(),150)}
function closeSearch(){$("searchOverlay").classList.remove("show");$("searchOverlay").setAttribute("aria-hidden","true");$("searchInput").value="";$("searchResults").innerHTML=""}

function saveNewEvent(){
 const title=$("eventName").value.trim(),date=$("eventDate").value;
 if(!title||!date){toast("Enter an event name and date");return}
 const e={id:crypto.randomUUID?crypto.randomUUID():Date.now(),title,date,time:$("eventTime").value,end:$("eventEnd")?.value||"",color:state.color,category:state.category,meta:state.category,repeat:$("eventRepeat")?.value||"Never",reminder:Number($("eventReminder")?.value||0)};
 const expanded=window.CalanderRecurrence?.expand(e,12)||[e]; expanded.forEach(x=>state.events.push(x)); if(e.reminder)expanded.forEach(x=>window.CalanderReminders?.schedule(x));
 state.events.push(e);save();state.date=new Date(date+"T00:00:00");closeSheets();$("eventName").value="";renderAll();toast("Event created");
}
function openEventDetails(e){
 const ok=confirm(`"${e.title}"\n\n${e.date} · ${timeLabel(e.time)}\n${e.category||""}\n\nOK = export .ics\nCancel = close`);
 if(ok&&window.CalanderICS)window.CalanderICS.exportEvent(e);
}
function setup(){
 load();renderAll();
 $("prevDay").onclick=()=>{state.date=add(state.date,-1);renderAll()}
 $("nextDay").onclick=()=>{state.date=add(state.date,1);renderAll()}
 $("todayButton").onclick=()=>{state.date=clean(new Date());state.monthOffset=0;renderAll();toast("Today")}
 $("nextMonth").onclick=()=>{state.monthOffset++;renderMonth()}
 $("fab").onclick=()=>{$("eventDate").value=key(state.date);openSheet("eventSheet")}
 $("saveEvent").onclick=saveNewEvent;$("closeEvent").onclick=closeSheets;$("closeSettings").onclick=closeSheets;$("closeCalendar").onclick=closeSheets;$("scrim").onclick=closeSheets;
 $("menuButton").onclick=()=>openSheet("settingsSheet");$("searchButton").onclick=openSearch;$("closeSearch").onclick=closeSearch;
 $("viewAllEvents").onclick=()=>{state.view="agenda";$("agendaExtra")?.scrollIntoView({behavior:"smooth"});toast("Agenda")}
 $("colorRow").querySelectorAll("button").forEach(b=>b.onclick=()=>{$("colorRow").querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.color=b.dataset.color;localStorage.setItem("calander-color",state.color)});
 document.querySelectorAll(".nav-item").forEach(item=>item.onclick=()=>{
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));item.classList.add("active");
  const tab=item.dataset.tab;
  if(tab==="today"){window.scrollTo({top:0,behavior:state.motion?"smooth":"auto"});renderAll()}
  if(tab==="calendar")openSheet("calendarSheet");
  if(tab==="agenda")$("agendaExtra")?.scrollIntoView({behavior:state.motion?"smooth":"auto"});
  if(tab==="settings")openSheet("settingsSheet");
 });
 $("motionSetting").onclick=()=>{state.motion=!state.motion;localStorage.setItem("calander-motion",state.motion);$("motionSetting").querySelector(".toggle").classList.toggle("on",state.motion);toast(state.motion?"Smooth motion on":"Smooth motion off")};
 $("backgroundSetting").onclick=()=>{state.background=!state.background;localStorage.setItem("calander-background",state.background);document.querySelector(".aurora").style.opacity=state.background?1:0;$("backgroundSetting").querySelector(".toggle").classList.toggle("on",state.background)};
 $("notificationSetting").onclick=async()=>{state.notifications=!state.notifications;localStorage.setItem("calander-notifications",state.notifications);$("notificationSetting").querySelector(".toggle").classList.toggle("on",state.notifications);if(state.notifications&&window.CalanderNotifications)await window.CalanderNotifications.request();toast(state.notifications?"Notifications enabled":"Notifications disabled")};
 $("searchInput").oninput=e=>{const q=e.target.value.toLowerCase().trim(),r=$("searchResults");r.innerHTML="";if(!q)return;let a=state.events.filter(x=>x.title.toLowerCase().includes(q)).map(x=>({title:x.title,date:x.date,type:"Event"}));Object.entries(FESTIVALS).forEach(([md,name])=>{if(name.toLowerCase().includes(q))a.push({title:name,date:`2026-${md}`,type:"Indian festival"})});if(!a.length){r.innerHTML=`<div style="padding:30px;color:#7f8aa0;text-align:center">No results</div>`;return}a.forEach(x=>{const b=document.createElement("button");b.className="search-result glass";b.innerHTML=`<b>${escapeHtml(x.title)}</b><small>${x.type} • ${x.date}</small>`;b.onclick=()=>{state.date=new Date(x.date+"T00:00:00");renderAll();closeSearch()};r.appendChild(b)})};
 document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")$("prevDay").click();if(e.key==="ArrowRight")$("nextDay").click();if(e.key==="Escape"){closeSheets();closeSearch()}});
 let sx=0,sy=0;document.querySelector(".hero").addEventListener("touchstart",e=>{sx=e.changedTouches[0].clientX;sy=e.changedTouches[0].clientY},{passive:true});document.querySelector(".hero").addEventListener("touchend",e=>{let dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){state.date=add(state.date,dx<0?1:-1);renderAll()}},{passive:true});
 if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",setup):setup();


/* ===== Extended feature layer ===== */
(function(){
  function openX(id){document.querySelectorAll(".sheet").forEach(x=>{x.classList.remove("show");x.setAttribute("aria-hidden","true")});$(id).classList.add("show");$(id).setAttribute("aria-hidden","false");$("scrim").classList.add("show")}
  function renderTasks(){
    const list=$("taskList"); if(!list)return;
    const tasks=window.CalanderTasks?.load()||[];
    list.innerHTML=tasks.length?tasks.map(t=>`<div class="task-row glass ${t.done?"done":""}" data-task="${t.id}"><button class="task-check">${t.done?"✓":""}</button><span class="task-name">${escapeHtml(t.title)}</span><small class="task-due">${t.due||""}</small></div>`).join(""):`<div class="empty-extra">No tasks yet.</div>`;
    list.querySelectorAll(".task-row").forEach(row=>row.querySelector(".task-check").onclick=()=>{window.CalanderTasks.toggle(Number(row.dataset.task));renderTasks()});
  }
  function renderTimeline(mode){
    const box=$("timelineView");if(!box)return;
    const dates=mode==="week"?window.CalanderViews.weekDates(state.date):[state.date];
    box.innerHTML=dates.map(d=>{
      const es=eventsFor(d);
      return `<div class="timeline-day"><div class="timeline-day-title">${d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"})}</div>
      ${Array.from({length: mode==="week"?1:24},(_,h)=>{
        if(mode==="week")return es.length?`<div class="time-row"><div class="time-label">ALL</div><div class="time-events">${es.map(e=>`<div class="time-event">${escapeHtml(e.title)} · ${timeLabel(e.time)}</div>`).join("")}</div></div>`:"";
        const hour=String(h).padStart(2,"0"),matches=es.filter(e=>(e.time||"09:00").startsWith(hour));
        return `<div class="time-row"><div class="time-label">${timeLabel(hour+":00")}</div><div class="time-events">${matches.map(e=>`<div class="time-event">${escapeHtml(e.title)}</div>`).join("")}</div></div>`;
      }).join("")}</div>`;
    }).join("");
  }

  document.addEventListener("DOMContentLoaded",()=>{
    $("openFeatures")?.addEventListener("click",()=>openX("featuresSheet"));
    $("closeFeatures")?.addEventListener("click",closeSheets);
    $("openTasks")?.addEventListener("click",()=>{renderTasks();openX("tasksSheet")});
    $("closeTasks")?.addEventListener("click",closeSheets);
    $("addTask")?.addEventListener("click",()=>{
      const v=$("taskInput").value.trim();if(!v)return;
      window.CalanderTasks.add(v,key(state.date));$("taskInput").value="";renderTasks();toast("Task added");
    });
    $("taskInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")$("addTask").click()});
    $("openWeek")?.addEventListener("click",()=>{ $("viewTitle").textContent="Week View";$("viewModeLabel").textContent="SCHEDULE";renderTimeline("week");openX("viewSheet")});
    $("openDay")?.addEventListener("click",()=>{ $("viewTitle").textContent="Day View";$("viewModeLabel").textContent="24 HOURS";renderTimeline("day");openX("viewSheet")});
    $("closeView")?.addEventListener("click",closeSheets);
    $("exportBackup")?.addEventListener("click",()=>{window.CalanderBackup?.export();toast("Backup exported")});
    $("importBackup")?.addEventListener("click",()=>$("backupFile").click());
    $("backupFile")?.addEventListener("change",e=>{
      const f=e.target.files?.[0];if(!f)return;
      window.CalanderBackup?.import(f,ok=>{toast(ok?"Backup restored — reload the app":"Invalid backup file")});
    });
    $("countdownButton")?.addEventListener("click",()=>{
      const es=state.events.length?state.events:[...demoEvents()];
      const e=es.find(x=>x.date>=key(new Date()));
      toast(e?window.CalanderCountdown.text(e.date,e.title):"Create an event to start a countdown");
    });
    $("timezoneButton")?.addEventListener("click",()=>{
      const zones=["Asia/Kolkata","Europe/London","America/New_York","Asia/Tokyo","Australia/Sydney"];
      const now=new Date();
      toast(zones.map(z=>`${z.split("/").pop().replace("_"," ")} ${new Intl.DateTimeFormat("en-IN",{timeZone:z,hour:"2-digit",minute:"2-digit"}).format(now)}`).join(" • "));
    });
    $("focusButton")?.addEventListener("click",()=>{
      const d=key(state.date);
      const e={id:Date.now(),title:"Focus Time",date:d,time:"09:00",end:"10:00",color:"#9d6cff",category:"Study",meta:"Focus session",repeat:"Never"};
      state.events.push(e);save();renderAll();toast("1-hour Focus Time added");
    });
  });
})();
