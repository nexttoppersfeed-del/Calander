window.CalanderDailyPlan = {load(date){return CalanderStorage.load("daily-plan-"+date,[])},save(date,items){CalanderStorage.save("daily-plan-"+date,items)}};
