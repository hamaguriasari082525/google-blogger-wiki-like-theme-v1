// article-loader.js

(function () {
  'use strict';
  
  async function load (url) {
    if (!url) {
      throw new Error ('Article URL is required.');
    }

    const response = await fetch (url);

    if (!response.ok) {
      throw new Error ('Article request failed: ' + response.status);
    }

    const html = await response.text ();

    const parser = new DOMParser ();

    const doc = parser.parseFromString (html, 'text/html');

    return {
      url: url,
      title: getTitle (doc),
      meta: getMeta (doc),
      abstract: getAbstract (doc),
      image: getImage (doc),
    };
  }

  function getTitle (document) {
    const element = document.querySelector ('.article-title');

    if (!element) {
      return null;
    }

    const title = element.textContent.replace (/\s+/g, ' ').trim ();

    return title || null;
  }

  function getMeta (document) {
    const element = document.querySelector ('.article-meta');

    if (!element) {
      return null;
    }

    const meta = element.textContent.replace (/\s+/g, ' ').trim ();

    return meta || null;
  }

  function getAbstract (document) {
    const headings = document.querySelectorAll ('h2, h3');

    for (const heading of headings) {
      const text = heading.textContent
        .replace (/\s+/g, ' ')
        .trim ()
        .toLowerCase ();

      if (text !== 'abstract') {
        continue;
      }

      const element = heading.nextElementSibling;

      if (!element) {
        return null;
      }

      const abstract = element.textContent.replace (/\s+/g, ' ').trim ();

      return abstract || null;
    }

    return null;
  }

  function getImage (document) {
    const image = document.querySelector ('.article-body img');

    if (!image) {
      return null;
    }

    const src = image.getAttribute ('src');

    if (!src) {
      return null;
    }

    return {
      src: src,
      alt: image.getAttribute ('alt') || '',
    };
  }

  window.articleLoader = {
    load: load,
  };
}) ();
