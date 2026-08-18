window.CalanderTimeline = {hours(){return Array.from({length:24},(_,i)=>i)},slot(minutes=30){return Array.from({length:1440/minutes},(_,i)=>i*minutes)}};
