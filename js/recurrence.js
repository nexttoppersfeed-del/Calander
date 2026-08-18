window.CalanderRecurrence={
  options:["Never","Daily","Weekly","Monthly","Yearly"],
  expand(event, count=12){
    if(!event.repeat || event.repeat==="Never") return [event];
    const out=[];
    let d=new Date(event.date+"T00:00:00");
    for(let i=0;i<count;i++){
      const copy={...event,date:d.toISOString().slice(0,10),seriesId:event.seriesId||event.id};
      out.push(copy);
      if(event.repeat==="Daily") d.setDate(d.getDate()+1);
      if(event.repeat==="Weekly") d.setDate(d.getDate()+7);
      if(event.repeat==="Monthly") d.setMonth(d.getMonth()+1);
      if(event.repeat==="Yearly") d.setFullYear(d.getFullYear()+1);
    }
    return out;
  }
};
