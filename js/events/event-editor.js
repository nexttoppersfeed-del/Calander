window.CalanderEventEditor = {validate(e){return Boolean(e&&e.title&&e.date)},normalize(e){return {...e,title:String(e.title||"").trim()}}};
