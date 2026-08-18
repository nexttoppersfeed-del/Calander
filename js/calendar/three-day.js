window.CalanderThreeDayView = {dates(date){return [-1,0,1].map(n=>{const d=new Date(date);d.setDate(d.getDate()+n);return d})}};
