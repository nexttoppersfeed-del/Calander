window.CalanderICS = {
  exportEvent(event) {
    const dt = (event.date || "").replaceAll("-", "") + "T" + (event.time || "0900").replace(":", "") + "00";
    const end = (event.end || event.time || "1000");
    const dtEnd = (event.date || "").replaceAll("-", "") + "T" + end.replace(":", "") + "00";
    const esc = s => String(s || "").replaceAll("\\","\\\\").replaceAll(";","\\;").replaceAll(",","\\,").replaceAll("\n","\\n");
    const text = [
      "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Calander//EN",
      "BEGIN:VEVENT",
      `UID:${event.id || Date.now()}@calander`,
      `DTSTART:${dt}`, `DTEND:${dtEnd}`,
      `SUMMARY:${esc(event.title)}`,
      `DESCRIPTION:${esc(event.meta)}`,
      "END:VEVENT","END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([text], {type:"text/calendar;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(event.title || "event").replace(/[^\w-]+/g,"-")}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
};
