window.CalanderStorage = {
  load(key, fallback=null){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}},
  save(key,value){localStorage.setItem(key,JSON.stringify(value))},
  remove(key){localStorage.removeItem(key)}
};
