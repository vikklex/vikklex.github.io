class Router {
  constructor() {
    this.state = {};

    this.handlers = {};
  }

  handle(path, onRenderCallback, onStartCallback, onStopCallback, isDefault = false) {
    this.state[path] = {
      onRender: onRenderCallback,
      onStartCallback: onStartCallback,
      onStopCallback: onStopCallback
    };

    if (isDefault) {
      this.handlers = this.state[path];

      this.handlers.onRender();
      this.handlers.onStartCallback();
    }
  }

  setPath(href) {
    for (let [path, handlers] of Object.entries(this.state)) {
      // TODO: Improve path parse
      if (href.indexOf(path) >= 0) {
        if (Object.entries(this.handlers).length) {
          this.handlers.onStopCallback();
        }

        this.handlers = handlers;

        handlers.onRender();
        handlers.onStartCallback();
      }
    }
  }
}