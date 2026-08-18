window.CalanderPomodoro = {work:25,break:5,start(kind="work"){const minutes=kind==="break"?this.break:this.work;return CalanderFocus.start(minutes)}};
