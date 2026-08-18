window.CalanderAttendees = {normalize(list=[]){return list.map(x=>typeof x==="string"?{name:x}:x)},add(event,person){event.attendees=[...(event.attendees||[]),person];return event}};
