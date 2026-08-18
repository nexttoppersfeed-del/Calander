window.CalanderTasks={
  load(){return window.CalanderStorage?.load("calander-tasks",[])||[]},
  save(tasks){window.CalanderStorage?.save("calander-tasks",tasks)},
  add(title,due){const tasks=this.load();tasks.push({id:Date.now(),title,due,done:false});this.save(tasks);return tasks},
  toggle(id){const tasks=this.load();const t=tasks.find(x=>x.id===id);if(t)t.done=!t.done;this.save(tasks);return tasks}
};
