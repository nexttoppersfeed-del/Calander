window.CalanderViews={
  weekDates(date){
    const d=new Date(date),day=d.getDay(),start=new Date(d);
    start.setDate(d.getDate()-day);
    return Array.from({length:7},(_,i)=>{const x=new Date(start);x.setDate(start.getDate()+i);return x});
  },
  dayHours(){return Array.from({length:24},(_,i)=>i)}
};
