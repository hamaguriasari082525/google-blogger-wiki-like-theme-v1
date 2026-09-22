// bootstrap.js

(function () {
  "use strict";

  console.log(
    "[Bootstrap] FEATURES",
    {
      contents:window.articleContentsBootstrap,
      gallery:window.articleGalleryBootstrap,
      reference:window.articleReferenceBootstrap,
      article:window.articleBootstrap
    }
  );

  const state = { started: false, ready: false };

  function runFeature(name, feature) {
    if (!feature || typeof feature.process !== "function") {
      console.warn("[Bootstrap] Feature Bootstrap not found: " + name);
      return;
    }

    try {
      feature.process();
    } catch (error) {
      console.error("[Bootstrap] Feature failed: " + name, error);
    }
  }

  function bootstrap() {
    if (state.started) return;

    state.started = true;
    console.log("[Bootstrap] START");

    [
      ["Gallery", window.articleGalleryBootstrap],
      ["Contents", window.articleContentsBootstrap],
      ["Article", window.articleBootstrap],
      ["Reference", window.articleReferenceBootstrap],
    ].forEach(([name, feature]) => runFeature(name, feature));

    state.ready = true;
    console.log("[Bootstrap] READY");
    document.dispatchEvent(
      new CustomEvent("articleBootstrapReady", { detail: state })
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }

  window.articleBootstrap = { process: bootstrap, getState: () => state };
})();
