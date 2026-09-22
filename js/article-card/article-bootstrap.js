// article-bootstrap.js

(function () {
  'use strict';
  
  const state = {
    started: false,
    ready: false,
  };

  function runModule (name, module) {
    if (!module || typeof module.process !== 'function') {
      console.warn ('[ArticleBootstrap] Module not found: ' + name);
      return false;
    }

    try {
      module.process ();

      return true;
    } catch (error) {
      console.error ('[ArticleBootstrap] Module failed: ' + name, error);

      return false;
    }
  }

  function bootstrap () {
    if (state.started) {
      return;
    }

    state.started = true;

    console.log ('[ArticleBootstrap] START');

    runModule ('Article Display', window.articleDisplay);

    state.ready = true;

    console.log ('[ArticleBootstrap] READY');

    document.dispatchEvent (
      new CustomEvent ('articleBootstrapReady', {
        detail: state,
      })
    );
  }

  window.articleBootstrap = {
    process: bootstrap,
    getState: function () {
      return state;
    },
  };
}) ();
