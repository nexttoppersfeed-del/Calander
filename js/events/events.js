window.CalanderEvents = {
  all(){return CalanderStorage.load("calander-events",[])},
  save(events){CalanderStorage.save("calander-events",events)},
  add(event){const e=this.all();e.push(event);this.save(e);return event},
  remove(id){this.save(this.all().filter(e=>e.id!==id))}
};
