// gallery-bootstrap.js

(function () {
  "use strict";

  const state = { started: false, ready: false };

  function bootstrap() {
    if (state.started) return;

    state.started = true;
    console.log("[GalleryBootstrap] START");

    const gallery = window.articleGallery;

    if (!gallery || typeof gallery.process !== "function") {
      console.warn("[GalleryBootstrap] Gallery module not found.");
    } else {
      try {
        gallery.process();
      } catch (error) {
        console.error("[GalleryBootstrap] Gallery failed:", error);
      }
    }

    state.ready = true;
    console.log("[GalleryBootstrap] READY");

    document.dispatchEvent(
      new CustomEvent("articleGalleryBootstrapReady", { detail: state })
    );
  }

  window.articleGalleryBootstrap = {
    process: bootstrap,
    getState: () => state
  };
})();
