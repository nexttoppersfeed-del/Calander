window.CalanderCountdown={
  daysUntil(date){
    const a=new Date();a.setHours(0,0,0,0);
    const b=new Date(date+"T00:00:00");
    return Math.ceil((b-a)/86400000);
  },
  text(date,title){
    const d=this.daysUntil(date);
    if(d<0)return `${title} was ${Math.abs(d)} days ago`;
    if(d===0)return `${title} is today`;
    if(d===1)return `${title} is tomorrow`;
    return `${d} days until ${title}`;
  }
};
