window.CalanderAttachments = {metadata(file){return {name:file.name,type:file.type,size:file.size}},add(event,file){event.attachments=[...(event.attachments||[]),this.metadata(file)];return event}};
