window.CalanderAgenda = {sort(events){return [...events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))}};
