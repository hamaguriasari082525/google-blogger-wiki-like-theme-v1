// contents-bootstrap.js

(function () {
  "use strict";

  const state = { started: false, ready: false };

  function runModule(name, module) {
    if (!module || typeof module.process !== "function") {
      console.warn("[ContentsBootstrap] Module not found: " + name);
      return false;
    }

    try {
      module.process();
      return true;
    } catch (error) {
      console.error("[ContentsBootstrap] Module failed: " + name, error);
      return false;
    }
  }

  function bootstrap() {
    if (state.started) return;

    state.started = true;
    console.log("[ContentsBootstrap] START");

    runModule("Contents Core", window.articleContentsCore);
    runModule("Contents Display", window.articleContentsDisplay);
    runModule("Contents List", window.articleContentsList);
    runModule("Contents Navigation", window.articleContentsNavigation);

    state.ready = true;
    console.log("[ContentsBootstrap] READY");

    document.dispatchEvent(
      new CustomEvent("articleContentsBootstrapReady", { detail: state })
    );
  }

  window.articleContentsBootstrap = {
    process: bootstrap,
    getState: () => state
  };
})();

